"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  FileText,
  PieChart,
  Activity,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReportData {
  period: string;
  totalCases: number;
  resolvedCases: number;
  pendingCases: number;
  avgResolutionTime: number;
  satisfactionRate: number;
}

interface CategoryData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

interface DepartmentData {
  name: string;
  casesHandled: number;
  avgResolutionTime: number;
  efficiency: number;
}

export default function ReportsView() {
  const { stats, addNotification } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [selectedMetric, setSelectedMetric] = useState("todos");
  const [loading, setLoading] = useState(false);

  const periods = [
    { value: "hoy", label: "Hoy" },
    { value: "semana", label: "Esta semana" },
    { value: "mes", label: "Este mes" },
    { value: "trimestre", label: "Trimestre" },
    { value: "año", label: "Año" }
  ];

  const metrics = [
    { value: "todos", label: "Todos los métricos" },
    { value: "casos", label: "Casos" },
    { value: "tiempo", label: "Tiempo de respuesta" },
    { value: "satisfaccion", label: "Satisfacción" }
  ];

  // Mock data - en producción vendría de la API
  const mockReportData: ReportData[] = [
    { period: "Enero", totalCases: 145, resolvedCases: 120, pendingCases: 25, avgResolutionTime: 48, satisfactionRate: 85 },
    { period: "Febrero", totalCases: 162, resolvedCases: 140, pendingCases: 22, avgResolutionTime: 42, satisfactionRate: 88 },
    { period: "Marzo", totalCases: 178, resolvedCases: 155, pendingCases: 23, avgResolutionTime: 45, satisfactionRate: 87 },
    { period: "Abril", totalCases: 195, resolvedCases: 170, pendingCases: 25, avgResolutionTime: 40, satisfactionRate: 90 }
  ];

  const mockCategoryData: CategoryData[] = [
    { name: "Infraestructura", count: 45, percentage: 28, color: "bg-blue-500" },
    { name: "Servicios", count: 38, percentage: 24, color: "bg-green-500" },
    { name: "Limpieza", count: 32, percentage: 20, color: "bg-amber-500" },
    { name: "Seguridad", count: 28, percentage: 18, color: "bg-red-500" },
    { name: "Otros", count: 17, percentage: 10, color: "bg-slate-500" }
  ];

  const mockDepartmentData: DepartmentData[] = [
    { name: "Servicios Urbanos", casesHandled: 67, avgResolutionTime: 38, efficiency: 92 },
    { name: "Obras Públicas", casesHandled: 45, avgResolutionTime: 52, efficiency: 85 },
    { name: "Mantenimiento Vial", casesHandled: 38, avgResolutionTime: 41, efficiency: 88 },
    { name: "Seguridad Ciudadana", casesHandled: 28, avgResolutionTime: 35, efficiency: 95 }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Hoja de resumen general
    if (stats) {
      const summaryData = [
        ['Métrica', 'Valor'],
        ['Total de Casos', stats.totalCases.toString()],
        ['Casos Resueltos', stats.resolvedCases.toString()],
        ['Casos Activos', stats.activeCases.toString()],
        ['Casos Pendientes', stats.pendingCases.toString()],
        ['Casos en Revisión', stats.inReviewCases.toString()],
        ['Tiempo Promedio de Resolución (horas)', stats.avgResolutionTime.toString()],
        ['Tasa de Satisfacción (%)', stats.satisfactionRate.toString()],
        ['Tasa de Eficiencia (%)', stats.efficiencyRate.toString()]
      ];

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen General');
    }

    // Hoja de tendencias por período
    const trendsData = [
      ['Período', 'Total Casos', 'Casos Resueltos', 'Casos Pendientes', 'Tiempo Promedio Resolución (hrs)', 'Tasa Satisfacción (%)']
    ];
    
    mockReportData.forEach(report => {
      trendsData.push([
        report.period,
        report.totalCases.toString(),
        report.resolvedCases.toString(),
        report.pendingCases.toString(),
        report.avgResolutionTime.toString(),
        report.satisfactionRate.toString()
      ]);
    });

    const wsTrends = XLSX.utils.aoa_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(wb, wsTrends, 'Tendencias');

    // Hoja de categorías
    const categoriesData = [
      ['Categoría', 'Cantidad', 'Porcentaje (%)']
    ];
    
    mockCategoryData.forEach(category => {
      categoriesData.push([
        category.name,
        category.count.toString(),
        category.percentage.toString()
      ]);
    });

    const wsCategories = XLSX.utils.aoa_to_sheet(categoriesData);
    XLSX.utils.book_append_sheet(wb, wsCategories, 'Categorías');

    // Hoja de departamentos
    const departmentsData = [
      ['Departamento', 'Casos Atendidos', 'Tiempo Promedio Resolución (hrs)', 'Eficiencia (%)']
    ];
    
    mockDepartmentData.forEach(dept => {
      departmentsData.push([
        dept.name,
        dept.casesHandled.toString(),
        dept.avgResolutionTime.toString(),
        dept.efficiency.toString()
      ]);
    });

    const wsDepartments = XLSX.utils.aoa_to_sheet(departmentsData);
    XLSX.utils.book_append_sheet(wb, wsDepartments, 'Departamentos');

    // Descargar archivo
    XLSX.writeFile(wb, `reporte-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Reporte Exportado',
      message: 'El reporte completo ha sido exportado a Excel exitosamente'
    });
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down": return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
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
          <h2 className="text-2xl font-bold text-slate-900">Reportes y Estadísticas</h2>
          <p className="text-slate-500 mt-1">
            Análisis detallado del rendimiento del sistema
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
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
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Período</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>{period.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Métricas</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>{metric.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats && [
          {
            label: "Total de Casos",
            value: stats.totalCases,
            icon: <FileText className="w-6 h-6 text-blue-600" />,
            color: "bg-blue-50 border-blue-200",
            trend: "up"
          },
          {
            label: "Tasa de Resolución",
            value: `${Math.round((stats.resolvedCases / stats.totalCases) * 100)}%`,
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            color: "bg-green-50 border-green-200",
            trend: "up"
          },
          {
            label: "Tiempo Promedio",
            value: `${stats.avgResolutionTime}h`,
            icon: <Clock className="w-6 h-6 text-amber-600" />,
            color: "bg-amber-50 border-amber-200",
            trend: "down"
          },
          {
            label: "Satisfacción",
            value: `${stats.satisfactionRate}%`,
            icon: <Users className="w-6 h-6 text-purple-600" />,
            color: "bg-purple-50 border-purple-200",
            trend: "up"
          }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl border ${kpi.color}`}>
                {kpi.icon}
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(kpi.trend)}
                <span className="text-sm font-medium text-green-600">
                  {kpi.trend === "up" ? "+12%" : "-5%"}
                </span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
            <p className="text-sm text-slate-500 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Casos por Categoría</h3>
            <PieChart className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {mockCategoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${category.color}`} />
                  <span className="text-sm font-medium text-slate-700">{category.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">{category.count} casos</span>
                  <span className="text-sm font-medium text-slate-900">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Departments Performance */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Rendimiento por Departamento</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          
          <div className="space-y-4">
            {mockDepartmentData.map((dept, index) => (
              <div key={dept.name} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{dept.name}</span>
                  <span className="text-sm font-medium text-slate-900">{dept.efficiency}%</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{dept.casesHandled} casos</span>
                  <span>{dept.avgResolutionTime}h promedio</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trends Table */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Tendencias Mensuales</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Período
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Casos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Resueltos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pendientes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tiempo Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Satisfacción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {mockReportData.map((report, index) => (
                <motion.tr
                  key={report.period}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{report.period}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.totalCases}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.resolvedCases}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.pendingCases}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.avgResolutionTime}h</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.satisfactionRate}%</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
