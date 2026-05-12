"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Filter,
  Download,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";

const DEPARTMENTS = [
  "Todos",
  "Servicios Urbanos",
  "Obras Públicas",
  "Mantenimiento Vial",
  "Seguridad Ciudadana",
  "Tecnología",
  "Medio Ambiente",
  "Recursos Humanos",
  "Hacienda",
  "Contraloría",
  "Asesoría Legal",
];

const STATUSES = [
  { value: "Todos", label: "Todos los estados" },
  { value: "ACTIVE", label: "Activo" },
  { value: "INACTIVE", label: "Inactivo" },
  { value: "SUSPENDED", label: "Suspendido" },
] as const;

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string;
  status: string;
  hireDate: string;
  academicLevel: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getStatusColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "INACTIVE":
      return "bg-slate-100 text-slate-700";
    case "SUSPENDED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "ACTIVE":
      return "Activo";
    case "INACTIVE":
      return "Inactivo";
    case "SUSPENDED":
      return "Suspendido";
    default:
      return status;
  }
}

export default function FuncionariosPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterDepartment !== "Todos" && { department: filterDepartment }),
        ...(filterStatus !== "Todos" && { status: filterStatus }),
      });
      const response = await fetch(`/api/admin/employees?${params}`);
      const data = await response.json();
      setEmployees(data.success ? data.employees : []);
    } catch {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterDepartment, filterStatus]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "Todos" || employee.department === filterDepartment;
    const matchesStatus = filterStatus === "Todos" || employee.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const rows = [["Nombre", "Correo", "Teléfono", "Cargo", "Departamento", "Nivel Académico", "Estado", "Fecha Contratación"]];
    filteredEmployees.forEach((e) => {
      rows.push([
        e.name,
        e.email,
        e.phone || "",
        e.position,
        e.department,
        e.academicLevel || "",
        getStatusLabel(e.status),
        new Date(e.hireDate).toLocaleDateString("es-VE"),
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Funcionarios");
    XLSX.writeFile(wb, `funcionarios-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Funcionarios</h2>
          <p className="text-slate-500 mt-1">Personal municipal registrado</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportToExcel} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
          <Link href="/admin/funcionarios/nuevo">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              Nuevo Funcionario
            </button>
          </Link>
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
                placeholder="Buscar por nombre, correo o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              Filtros
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Departamento</label>
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Employees Grid */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded w-full mb-2" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
            </div>
          ))
        ) : filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{employee.name}</h3>
                    <p className="text-xs text-slate-600">{employee.position}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(employee.status)}`}>
                  {getStatusLabel(employee.status)}
                </span>
              </div>

              <div className="space-y-2 mb-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{employee.department}</span>
                </div>
                {employee.academicLevel && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{employee.academicLevel}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  {new Date(employee.hireDate).toLocaleDateString("es-VE", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="Editar">
                    <Edit className="w-4 h-4 text-slate-600" />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron funcionarios</h3>
            <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
