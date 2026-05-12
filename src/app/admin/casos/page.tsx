"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Edit,
  FileText,
  Calendar,
  MapPin,
  Download,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";

const VALID_STATUSES = ["RECIBIDO", "EN_REVISION", "COMPLETADO"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

const STATUS_LABELS: Record<ValidStatus, string> = {
  RECIBIDO: "Recibido",
  EN_REVISION: "En revisión",
  COMPLETADO: "Completado",
};

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  status: string;
  trackerCode: string;
  citizenName: string | null;
  citizenDni: string | null;
  createdAt: string;
  updatedAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getStatusColor(status: string) {
  switch (status) {
    case "RECIBIDO":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "EN_REVISION":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "COMPLETADO":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

function getPriorityFromStatus(status: string) {
  switch (status) {
    case "RECIBIDO":
      return "Alta";
    case "EN_REVISION":
      return "Media";
    case "COMPLETADO":
      return "Baja";
    default:
      return "N/A";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Alta":
      return "bg-red-100 text-red-700";
    case "Media":
      return "bg-amber-100 text-amber-700";
    case "Baja":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function CasosPage() {
  const [casesData, setCasesData] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterPriority, setFilterPriority] = useState("todos");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "todos" && { status: filterStatus }),
        ...(sortBy && { sort: sortBy }),
      });
      const response = await fetch(`/api/admin/incidents?${params}`);
      const data = await response.json();
      setCasesData(data.success ? data.incidents : []);
    } catch {
      setCasesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, filterStatus, sortBy]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = casesData.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (caseItem.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.trackerCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "todos" || caseItem.status === filterStatus;

    let matchesPriority = filterPriority === "todos";
    if (!matchesPriority) {
      const derivedPriority = getPriorityFromStatus(caseItem.status);
      matchesPriority = derivedPriority === filterPriority;
    }

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows = [
      ["Código", "Título", "Descripción", "Ubicación", "Estado", "Prioridad", "Categoría", "Fecha", "Ciudadano"],
    ];
    filteredCases.forEach((c) => {
      rows.push([
        c.trackerCode,
        c.title,
        c.description,
        c.location || "",
        STATUS_LABELS[c.status as ValidStatus] || c.status,
        getPriorityFromStatus(c.status),
        c.category,
        new Date(c.createdAt).toLocaleDateString("es-VE"),
        c.citizenName || "Anónimo",
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Casos");
    XLSX.writeFile(wb, `casos-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Casos</h2>
          <p className="text-slate-500 mt-1">Administra todas las incidencias reportadas</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por código, título o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {showFilters && <X className="w-4 h-4" />}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Más recientes</option>
              <option value="status">Estado</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los estados</option>
                {VALID_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todas las prioridades</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Cases Table */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
            <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Caso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider hidden sm:table-cell">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCases.map((caseItem, index) => (
                  <motion.tr
                    key={caseItem.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">
                        {caseItem.trackerCode}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">{caseItem.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{caseItem.category}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{caseItem.location || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                        {STATUS_LABELS[caseItem.status as ValidStatus] || caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(getPriorityFromStatus(caseItem.status))}`}>
                        {getPriorityFromStatus(caseItem.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                        {new Date(caseItem.createdAt).toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/casos/${caseItem.trackerCode}`}>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Ver detalle">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                        </Link>
                        <Link href={`/admin/casos/${caseItem.trackerCode}?edit=true`}>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Editar">
                            <Edit className="w-4 h-4 text-slate-600" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
