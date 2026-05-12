"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  FileText,
  Clock,
  CheckCircle,
  Users,
  MapPin,
  Activity,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

const CATEGORY_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500", "bg-red-500", "bg-slate-500", "bg-cyan-500", "bg-pink-500"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Stats {
  totalCases: number;
  resolvedCases: number;
  activeCases: number;
  pendingCases: number;
  inReviewCases: number;
  avgResolutionTime: number;
  satisfactionRate: number;
  efficiencyRate: number;
}

interface Category {
  name: string;
  cases: number;
  percentage: number;
}

interface MonthlyTrend {
  month: string;
  cases: number;
  resolved: number;
  pending: number;
}

export default function ReportesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [locationStats, setLocationStats] = useState<Array<{ location: string; cases: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("mes");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setCategories(data.categories || []);
        setMonthlyTrend(data.monthlyTrend || []);

        // Compute location stats from recent incidents
        if (data.recentIncidents) {
          const locationMap: Record<string, number> = {};
          data.recentIncidents.forEach((inc: { location: string | null }) => {
            const loc = inc.location || "Sin ubicación";
            locationMap[loc] = (locationMap[loc] || 0) + 1;
          });
          setLocationStats(
            Object.entries(locationMap)
              .map(([location, cases]) => ({ location, cases }))
              .sort((a, b) => b.cases - a.cases)
              .slice(0, 5)
          );
        }
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, selectedPeriod]);

  const exportToExcel = () => {
    if (!stats) return;
    const wb = XLSX.utils.book_new();
    const statsData = [
      ["Métrica", "Valor"],
      ["Total de Casos", stats.totalCases],
      ["Casos Resueltos", stats.resolvedCases],
      ["Casos Activos", stats.activeCases],
      ["Casos Pendientes", stats.pendingCases],
      ["En Revisión", stats.inReviewCases],
      ["Tiempo Promedio (días)", stats.avgResolutionTime],
      ["Tasa de Eficiencia (%)", stats.efficiencyRate],
    ];
    const ws = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, ws, "Estadísticas");

    if (categories.length > 0) {
      const catData = [["Categoría", "Casos", "Porcentaje (%)"], ...categories.map((c) => [c.name, c.cases, c.percentage])];
      const wsCat = XLSX.utils.aoa_to_sheet(catData);
      XLSX.utils.book_append_sheet(wb, wsCat, "Categorías");
    }

    XLSX.writeFile(wb, `reportes-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center py-16">
        <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">No se pudieron cargar los reportes</h3>
        <button onClick={fetchData} className="text-blue-600 hover:underline text-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reportes y Estadísticas</h2>
          <p className="text-slate-500 mt-1">Análisis de rendimiento y métricas</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="semana">Última semana</option>
            <option value="mes">Último mes</option>
            <option value="trimestre">Último trimestre</option>
            <option value="año">Último año</option>
          </select>
          <button onClick={exportToExcel} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <div className="flex items-center gap-1 text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4" />
              {stats.totalCases > 0 ? `${stats.efficiencyRate}% resueltos` : "—"}
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalCases}</p>
          <p className="text-sm text-slate-600 mt-1">Total de Casos</p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.resolvedCases}</p>
          <p className="text-sm text-slate-600 mt-1">Casos Resueltos</p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.avgResolutionTime}</p>
          <p className="text-sm text-slate-600 mt-1">Días Promedio Resolución</p>
        </div>

        <div className="rounded-xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.efficiencyRate}%</p>
          <p className="text-sm text-slate-600 mt-1">Tasa de Eficiencia</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Trend */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Tendencia Mensual</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-slate-600">Total</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                  <span className="text-slate-600">Resueltos</span>
                </div>
              </div>
            </div>

            {monthlyTrend.length > 0 ? (
              <div className="space-y-3">
                {monthlyTrend.map((month) => {
                  const maxCases = Math.max(...monthlyTrend.map((m) => m.cases), 1);
                  return (
                    <div key={month.month} className="flex items-center gap-4">
                      <div className="w-10 text-sm font-medium text-slate-600 text-right">{month.month}</div>
                      <div className="flex-1">
                        <div className="flex gap-0.5 h-6">
                          <div className="bg-blue-500 rounded-l text-xs text-white flex items-center justify-end pr-1 font-medium" style={{ width: `${(month.cases / maxCases) * 100}%`, minWidth: "20px" }}>
                            {month.cases}
                          </div>
                          <div className="bg-emerald-500 rounded-r text-xs text-white flex items-center justify-end pr-1 font-medium" style={{ width: `${(month.resolved / maxCases) * 100}%`, minWidth: "20px" }}>
                            {month.resolved}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Sin datos de tendencia aún</p>
            )}
          </motion.div>

          {/* Category Distribution */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Distribución por Categoría</h3>
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category, i) => (
                  <div key={category.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{category.name}</span>
                      <span className="text-sm text-slate-600">{category.cases} casos</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">Sin datos de categorías aún</p>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Locations */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ubicaciones con Más Reportes</h3>
            {locationStats.length > 0 ? (
              <div className="space-y-3">
                {locationStats.map((location) => (
                  <div key={location.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">{location.location}</p>
                        <p className="text-xs text-slate-500">{location.cases} casos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Sin datos de ubicación</p>
            )}
          </motion.div>

          {/* Quick Insights */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Insights Rápidos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Activity className="w-5 h-5 text-blue-200 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Casos pendientes</p>
                  <p className="text-xs text-blue-100">{stats.pendingCases} casos por atender</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-200 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">En revisión</p>
                  <p className="text-xs text-blue-100">{stats.inReviewCases} casos en proceso</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-200 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Resolución promedio</p>
                  <p className="text-xs text-blue-100">{stats.avgResolutionTime} días</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
