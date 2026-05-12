"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Search,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Calendar,
  Download,
  FileText,
  ArrowLeft,
  Wrench,
} from "lucide-react";
import * as XLSX from "xlsx";

const STATUS_LABELS: Record<string, string> = {
  RECIBIDO: "Recibido",
  EN_REVISION: "En revisión",
  COMPLETADO: "Completado",
};

interface Case {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  status: string;
  trackerCode: string;
  createdAt: string;
}

const DEPARTMENTS = [
  "Obras Públicas",
  "Mantenimiento Vial",
  "Servicios Urbanos",
  "Seguridad Ciudadana",
  "Medio Ambiente",
  "Tecnología",
];

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

export default function AsignacionPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pendientes");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/incidents");
      const data = await response.json();
      setCases(data.success ? data.incidents : []);
    } catch {
      setCases([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      (case_.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (case_.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (case_.trackerCode || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" ||
      (filterStatus === "pendientes" && case_.status === "RECIBIDO") ||
      (filterStatus === "en_revision" && case_.status === "EN_REVISION") ||
      (filterStatus === "completados" && case_.status === "COMPLETADO");

    return matchesSearch && matchesStatus;
  });

  const handleAssign = async () => {
    if (!selectedCase || !selectedDepartment) return;
    setAssigning(true);
    try {
      const response = await fetch(`/api/admin/incidents/${selectedCase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "EN_REVISION" }),
      });
      const data = await response.json();
      if (data.success) {
        setCases((prev) =>
          prev.map((c) => (c.id === selectedCase.id ? { ...c, status: "EN_REVISION" } : c))
        );
        setShowAssignModal(false);
        setSelectedCase(null);
        setSelectedDepartment("");
      }
    } catch {
      console.error("Error assigning case");
    } finally {
      setAssigning(false);
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows = [["Código", "Título", "Ubicación", "Categoría", "Estado", "Fecha"]];
    cases.forEach((c) => {
      rows.push([
        c.trackerCode,
        c.title,
        c.location || "",
        c.category,
        STATUS_LABELS[c.status] || c.status,
        new Date(c.createdAt).toLocaleDateString("es-VE"),
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Asignación");
    XLSX.writeFile(wb, `asignacion-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const pendingCount = cases.filter((c) => c.status === "RECIBIDO").length;
  const inReviewCount = cases.filter((c) => c.status === "EN_REVISION").length;
  const completedCount = cases.filter((c) => c.status === "COMPLETADO").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Asignación de Casos</h2>
          <p className="text-slate-500 mt-1">Asigna casos pendientes a departamentos de trabajo</p>
        </div>
        <button onClick={exportToExcel} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" />
          Exportar Excel
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => setFilterStatus("pendientes")} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">Pendientes</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{pendingCount}</h3>
          <p className="text-sm text-slate-500 mt-1">Casos por asignar</p>
        </button>

        <button onClick={() => setFilterStatus("en_revision")} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">En revisión</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{inReviewCount}</h3>
          <p className="text-sm text-slate-500 mt-1">Casos en proceso</p>
        </button>

        <button onClick={() => setFilterStatus("completados")} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Completados</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{completedCount}</h3>
          <p className="text-sm text-slate-500 mt-1">Casos resueltos</p>
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar casos por código, título o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="pendientes">Pendientes</option>
            <option value="en_revision">En revisión</option>
            <option value="completados">Completados</option>
            <option value="todos">Todos</option>
          </select>
        </div>
      </motion.div>

      {/* Cases List */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Lista de Casos</h3>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-16">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
            <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredCases.map((case_, index) => (
              <motion.div key={case_.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-700">{case_.trackerCode}</span>
                      <h4 className="font-medium text-slate-900">{case_.title}</h4>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(case_.status)}`}>
                        {STATUS_LABELS[case_.status] || case_.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {case_.location || "Sin ubicación"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wrench className="w-4 h-4" />
                        {case_.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(case_.createdAt).toLocaleDateString("es-VE")}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4">
                    {case_.status === "RECIBIDO" && (
                      <button onClick={() => { setSelectedCase(case_); setShowAssignModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        <Users className="w-4 h-4 mr-1 inline" />
                        Asignar
                      </button>
                    )}
                    <Link href={`/admin/casos/${case_.trackerCode}`}>
                      <button className="mt-2 w-full px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                        <FileText className="w-4 h-4 mr-1 inline" />
                        Ver Detalles
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Assignment Modal */}
      {showAssignModal && selectedCase && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-xl p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Asignar Departamento</h3>
              <button onClick={() => { setShowAssignModal(false); setSelectedCase(null); setSelectedDepartment(""); }} className="p-2 rounded-lg hover:bg-slate-100">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-700">{selectedCase.trackerCode}</span>
                <h4 className="font-medium text-slate-900">{selectedCase.title}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-2">{selectedCase.description}</p>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                {selectedCase.location || "Sin ubicación"}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Seleccionar Departamento</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Seleccionar departamento...</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowAssignModal(false); setSelectedCase(null); setSelectedDepartment(""); }} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                Cancelar
              </button>
              <button onClick={handleAssign} disabled={!selectedDepartment || assigning} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {assigning ? "Asignando..." : "Confirmar Asignación"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
