"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  MapPin,
  User,
  ArrowUpDown,
  Download,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

interface CaseData {
  id: string;
  uuid: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  priority: string;
  reportedBy: string;
  reportedPhone: string;
  reportedEmail: string | null;
  reportedDate: string;
  reportedTime: string;
  assignedTo: string;
  assignedDepartment: string;
  estimatedResolution: string;
  images: string[];
  tags: string[];
  coordinates: any;
}

export default function CasosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterPriority, setFilterPriority] = useState("todos");
  const [sortBy, setSortBy] = useState("date");
  const [casesData, setCasesData] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchCases();
    }
  }, [mounted, searchTerm, filterStatus, filterPriority, sortBy]);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== "todos" && { status: filterStatus }),
        ...(filterPriority !== "todos" && { priority: filterPriority }),
        ...(sortBy && { sort: sortBy }),
      });

      const response = await fetch(`/api/admin/incidents?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setCasesData(data.incidents || []);
      } else {
        setCasesData([]);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
      setCasesData([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = (casesData || []).filter((caseItem) => {
    if (!caseItem) return false;
    const matchesSearch = caseItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || caseItem.status === filterStatus;
    const matchesPriority = filterPriority === "todos" || caseItem.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETADO": return "bg-green-100 text-green-700";
      case "EN_REVISION": return "bg-blue-100 text-blue-700";
      case "ASIGNADO": return "bg-purple-100 text-purple-700";
      case "RECIBIDO": return "bg-amber-100 text-amber-700";
      case "PENDIENTE": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-700";
      case "Media": return "bg-amber-100 text-amber-700";
      case "Baja": return "bg-green-100 text-green-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link
                href="/gestion"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                ← Volver
              </Link>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gestión de Casos</h1>
                <p className="text-sm text-slate-500">Todas las incidencias reportadas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <Link
                href="/gestion/casos/nuevo"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Caso
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="RECIBIDO">Recibido</option>
              <option value="EN_REVISION">En revisión</option>
              <option value="ASIGNADO">Asignado</option>
              <option value="EN_PROCESO">En proceso</option>
              <option value="COMPLETADO">Completado</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todas las prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Más recientes</option>
              <option value="priority">Prioridad</option>
              <option value="status">Estado</option>
            </select>
          </div>
        </motion.div>

        {/* Cases Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-4"
        >
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              </div>
            ))
          ) : filteredCases.length > 0 ? (
            filteredCases.map((caseItem, index) => (
              <motion.div
                key={caseItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{caseItem.title}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3">{caseItem.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{caseItem.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{caseItem.reportedBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{caseItem.reportedDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Asignado a:</span> {caseItem.assignedTo}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/gestion/casos/${caseItem.id}`}
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Link>
                    <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-center py-12"
            >
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
              <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
