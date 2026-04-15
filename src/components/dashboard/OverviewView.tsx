"use client";

import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  FileText,
  Users,
  BarChart3,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Download,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

const quickActions = [
  {
    title: "Ver Todos los Casos",
    description: "Lista completa de incidencias reportadas",
    href: "/gestion/casos",
    icon: <ClipboardList className="w-6 h-6 text-indigo-600" />,
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
  },
  {
    title: "Gestionar Funcionarios",
    description: "Administrar personal y departamentos",
    href: "/gestion/funcionarios",
    icon: <Users className="w-6 h-6 text-emerald-600" />,
    color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
  },
  {
    title: "Ver Reportes",
    description: "Estadísticas y análisis de datos",
    href: "/gestion/reportes",
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  {
    title: "Asignar Casos",
    description: "Asignar incidencias a funcionarios",
    href: "/gestion/asignacion",
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
  }
];

export default function OverviewView() {
  const { stats, recentCases, loading, isConnected } = useDashboard();

  const exportToExcel = () => {
    if (!stats || !recentCases) return;

    const wb = XLSX.utils.book_new();

    // Hoja de estadísticas
    const statsData = [
      ['Métrica', 'Valor'],
      ['Total de Casos', stats.totalCases],
      ['Casos Resueltos', stats.resolvedCases],
      ['Casos Activos', stats.activeCases],
      ['Casos Pendientes', stats.pendingCases],
      ['Casos en Revisión', stats.inReviewCases],
      ['Tiempo Promedio de Resolución (hrs)', stats.avgResolutionTime],
      ['Tasa de Satisfacción (%)', stats.satisfactionRate],
      ['Tasa de Eficiencia (%)', stats.efficiencyRate]
    ];

    const wsStats = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');

    // Hoja de casos recientes
    const casesData = [
      ['ID', 'Título', 'Ubicación', 'Estado', 'Prioridad', 'Fecha', 'Hora']
    ];
    
    recentCases.forEach(case_ => {
      casesData.push([
        case_.id,
        case_.title,
        case_.location,
        case_.status,
        case_.priority,
        case_.reportedDate,
        case_.reportedTime
      ]);
    });

    const wsCases = XLSX.utils.aoa_to_sheet(casesData);
    XLSX.utils.book_append_sheet(wb, wsCases, 'Casos Recientes');

    // Descargar archivo
    XLSX.writeFile(wb, `dashboard-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-slate-500 mt-1">
            Resumen general del sistema de incidencias
            {isConnected && (
              <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                En tiempo real
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar a Excel
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats && [
          {
            label: "Total de Casos",
            value: stats.totalCases,
            icon: <FileText className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-50 border-blue-200",
            trend: "+12%"
          },
          {
            label: "Casos Resueltos",
            value: stats.resolvedCases,
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            color: "bg-green-50 border-green-200",
            trend: "+8%"
          },
          {
            label: "Casos Activos",
            value: stats.activeCases,
            icon: <Clock className="w-6 h-6 text-amber-600" />,
            color: "bg-amber-50 border-amber-200",
            trend: "-3%"
          },
          {
            label: "Eficiencia",
            value: `${stats.efficiencyRate}%`,
            icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
            color: "bg-purple-50 border-purple-200",
            trend: "+5%"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${stat.color}`}>
                {stat.icon}
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                className={`p-6 rounded-xl border ${action.color} cursor-pointer transition-all`}
              >
                <div className="mb-4">{action.icon}</div>
                <h4 className="font-semibold text-slate-900 mb-2">{action.title}</h4>
                <p className="text-sm text-slate-600">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent Cases */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Casos Recientes</h3>
            <Link href="/gestion/casos">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todos
              </button>
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-slate-100">
          {recentCases.length === 0 ? (
            <div className="p-6 text-center text-slate-500">
              No hay casos recientes
            </div>
          ) : (
            recentCases.slice(0, 5).map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-slate-900">{case_.title}</h4>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        case_.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                        case_.priority === 'Media' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {case_.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        {case_.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {case_.reportedDate} {case_.reportedTime}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      case_.status === 'Resuelto' ? 'bg-green-100 text-green-700' :
                      case_.status === 'En proceso' ? 'bg-blue-100 text-blue-700' :
                      case_.status === 'Asignado' ? 'bg-purple-100 text-purple-700' :
                      case_.status === 'En revisión' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {case_.status}
                    </span>
                    <Link href={`/gestion/casos/${case_.id}`}>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                        <Eye className="w-4 h-4 text-slate-600" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
