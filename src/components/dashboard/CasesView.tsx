"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  FileText,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

interface CaseData {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  priority: string;
  category: string;
  reportedDate: string;
  reportedTime: string;
  assignedTo?: string;
  assignedDepartment?: string;
  updatedAt: string;
}

export default function CasesView() {
  const { addNotification } = useDashboard();
  const [casesData, setCasesData] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterPriority, setFilterPriority] = useState("todos");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);

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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const casesDataForExcel = [
      ['ID', 'Título', 'Descripción', 'Ubicación', 'Estado', 'Prioridad', 'Categoría', 'Fecha Reporte', 'Hora', 'Asignado a', 'Departamento', 'Última Actualización']
    ];
    
    casesData.forEach(caseItem => {
      casesDataForExcel.push([
        caseItem.id,
        caseItem.title,
        caseItem.description,
        caseItem.location,
        caseItem.status,
        caseItem.priority,
        caseItem.category,
        caseItem.reportedDate,
        caseItem.reportedTime,
        caseItem.assignedTo || 'No asignado',
        caseItem.assignedDepartment || 'No asignado',
        caseItem.updatedAt
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(casesDataForExcel);
    XLSX.utils.book_append_sheet(wb, ws, 'Casos');
    XLSX.writeFile(wb, `casos-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Exportación Exitosa',
      message: `Se han exportado ${casesData.length} casos a Excel`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resuelto": return "bg-green-100 text-green-700 border-green-200";
      case "En proceso": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Asignado": return "bg-purple-100 text-purple-700 border-purple-200";
      case "En revisión": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Pendiente": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-700 border-red-200";
      case "Media": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Baja": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Casos</h2>
          <p className="text-slate-500 mt-1">
            Administra todas las incidencias reportadas
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
          <Link href="/gestion/casos/nuevo">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Nuevo Caso
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar casos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
              {showFilters && <X className="w-4 h-4" />}
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Más recientes</option>
              <option value="priority">Prioridad</option>
              <option value="status">Estado</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En revisión">En revisión</option>
                <option value="Asignado">Asignado</option>
                <option value="En proceso">En proceso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prioridad</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Cases List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : casesData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
            <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Caso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Prioridad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {casesData.map((caseItem, index) => (
                  <motion.tr
                    key={caseItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{caseItem.title}</div>
                        <div className="text-sm text-slate-500">{caseItem.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {caseItem.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getPriorityColor(caseItem.priority)}`}>
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {caseItem.reportedDate}
                      </div>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        {caseItem.reportedTime}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/gestion/casos/${caseItem.id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                            <Eye className="w-4 h-4 text-slate-600" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
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
