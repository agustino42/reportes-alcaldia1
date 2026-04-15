"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  FileText,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  MapPin,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const statsCards = [
  {
    title: "Total de Casos",
    value: "1,247",
    change: "+12.5%",
    trend: "up",
    icon: <FileText className="w-5 h-5 text-blue-600" />,
    color: "bg-blue-50 border-blue-200",
  },
  {
    title: "Casos Resueltos",
    value: "1,089",
    change: "+8.2%",
    trend: "up",
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    color: "bg-green-50 border-green-200",
  },
  {
    title: "Tiempo Promedio",
    value: "3.2 días",
    change: "-15.3%",
    trend: "down",
    icon: <Clock className="w-5 h-5 text-amber-600" />,
    color: "bg-amber-50 border-amber-200",
  },
  {
    title: "Tasa de Satisfacción",
    value: "87.3%",
    change: "+5.1%",
    trend: "up",
    icon: <Users className="w-5 h-5 text-purple-600" />,
    color: "bg-purple-50 border-purple-200",
  },
];

const categoryData = [
  { name: "Infraestructura", cases: 342, percentage: 27.4, color: "bg-blue-500" },
  { name: "Limpieza Urbana", cases: 289, percentage: 23.2, color: "bg-green-500" },
  { name: "Alumbrado", cases: 198, percentage: 15.9, color: "bg-amber-500" },
  { name: "Servicios", cases: 167, percentage: 13.4, color: "bg-purple-500" },
  { name: "Seguridad", cases: 156, percentage: 12.5, color: "bg-red-500" },
  { name: "Otros", cases: 95, percentage: 7.6, color: "bg-slate-500" },
];

const monthlyTrend = [
  { month: "Ene", cases: 89, resolved: 82, pending: 7 },
  { month: "Feb", cases: 102, resolved: 95, pending: 7 },
  { month: "Mar", cases: 98, resolved: 91, pending: 7 },
  { month: "Abr", cases: 112, resolved: 104, pending: 8 },
  { month: "May", cases: 125, resolved: 118, pending: 7 },
  { month: "Jun", cases: 134, resolved: 127, pending: 7 },
];

const departmentPerformance = [
  {
    name: "Servicios Urbanos",
    efficiency: 94,
    avgTime: "2.1 días",
    totalCases: 267,
    satisfaction: 91,
    trend: "up",
  },
  {
    name: "Seguridad Ciudadana",
    efficiency: 92,
    avgTime: "1.8 días",
    totalCases: 234,
    satisfaction: 89,
    trend: "up",
  },
  {
    name: "Obras Públicas",
    efficiency: 87,
    avgTime: "3.2 días",
    totalCases: 198,
    satisfaction: 85,
    trend: "stable",
  },
  {
    name: "Medio Ambiente",
    efficiency: 82,
    avgTime: "5.2 días",
    totalCases: 145,
    satisfaction: 83,
    trend: "down",
  },
  {
    name: "Mantenimiento Vial",
    efficiency: 78,
    avgTime: "4.5 días",
    totalCases: 167,
    satisfaction: 81,
    trend: "up",
  },
];

const topLocations = [
  { location: "Centro", cases: 234, growth: "+12%" },
  { location: "Sector La Paz", cases: 189, growth: "+8%" },
  { location: "Barrio San Juan", cases: 167, growth: "+15%" },
  { location: "El Carmen", cases: 145, growth: "+5%" },
  { location: "Parque Bolívar", cases: 123, growth: "-3%" },
];

export default function ReportesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("mes");
  const [selectedMetric, setSelectedMetric] = useState("todos");

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="w-4 h-4 text-green-600" />;
      case "down": return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4 bg-slate-300 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-slate-600";
    }
  };

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
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Reportes y Estadísticas</h1>
                <p className="text-sm text-slate-500">Análisis de rendimiento y métricas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="semana">Última semana</option>
                <option value="mes">Último mes</option>
                <option value="trimestre">Último trimestre</option>
                <option value="año">Último año</option>
              </select>
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className={`rounded-xl border ${stat.color} p-6 shadow-sm`}
            >
              <div className="flex items-center justify-between mb-4">
                {stat.icon}
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-600 mt-1">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Monthly Trend */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Tendencia Mensual</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Resueltos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-slate-600">Pendientes</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {monthlyTrend.map((month, index) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-slate-600">{month.month}</div>
                    <div className="flex-1">
                      <div className="flex gap-1 h-8">
                        <div
                          className="bg-blue-500 rounded-l-lg flex items-center justify-end pr-2 text-xs text-white font-medium"
                          style={{ width: `${(month.cases / 150) * 100}%` }}
                        >
                          {month.cases}
                        </div>
                        <div
                          className="bg-green-500 flex items-center justify-end pr-2 text-xs text-white font-medium"
                          style={{ width: `${(month.resolved / 150) * 100}%` }}
                        >
                          {month.resolved}
                        </div>
                        <div
                          className="bg-amber-500 rounded-r-lg flex items-center justify-end pr-2 text-xs text-white font-medium"
                          style={{ width: `${(month.pending / 150) * 100}%` }}
                        >
                          {month.pending}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Department Performance */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Rendimiento por Departamento</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 text-sm font-medium text-slate-700">Departamento</th>
                      <th className="text-center py-3 text-sm font-medium text-slate-700">Eficiencia</th>
                      <th className="text-center py-3 text-sm font-medium text-slate-700">Tiempo Promedio</th>
                      <th className="text-center py-3 text-sm font-medium text-slate-700">Casos Totales</th>
                      <th className="text-center py-3 text-sm font-medium text-slate-700">Satisfacción</th>
                      <th className="text-center py-3 text-sm font-medium text-slate-700">Tendencia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {departmentPerformance.map((dept, index) => (
                      <tr key={dept.name} className="hover:bg-slate-50">
                        <td className="py-3 text-sm font-medium text-slate-900">{dept.name}</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-full max-w-16 bg-slate-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  dept.efficiency >= 90 ? 'bg-green-500' : 
                                  dept.efficiency >= 80 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${dept.efficiency}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-slate-900">{dept.efficiency}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-center text-sm text-slate-600">{dept.avgTime}</td>
                        <td className="py-3 text-center text-sm text-slate-600">{dept.totalCases}</td>
                        <td className="py-3 text-center text-sm text-slate-600">{dept.satisfaction}%</td>
                        <td className="py-3 text-center">
                          <div className="flex items-center justify-center">
                            {getTrendIcon(dept.trend)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories Distribution */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribución por Categoría</h3>
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      <span className="text-sm text-slate-600">{category.cases} casos</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${category.color}`}
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Locations */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Ubicaciones con Más Reportes</h3>
              <div className="space-y-3">
                {topLocations.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{location.location}</p>
                        <p className="text-xs text-slate-500">{location.cases} casos</p>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${location.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {location.growth}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.9, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg"
            >
              <h3 className="text-lg font-semibold mb-4">Insights Rápidos</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Mejora en eficiencia</p>
                    <p className="text-xs text-blue-100">+8.3% en el último mes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tiempo de respuesta reducido</p>
                    <p className="text-xs text-blue-100">15% más rápido que el mes anterior</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-200 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Satisfacción ciudadana</p>
                    <p className="text-xs text-blue-100">87.3% - máximo histórico</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
