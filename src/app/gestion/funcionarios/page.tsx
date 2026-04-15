"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
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
  ArrowUpDown,
  Download,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department: string | null;
  status: string;
  hireDate: string;
  salary: number;
  address: string | null;
  avatar: string | null;
  supervisor: any;
  createdAt: string;
  updatedAt: string;
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@barinas.gob.ve",
    phone: "+58-275-1234567",
    position: "Jefa de Departamento",
    department: "Servicios Urbanos",
    status: "ACTIVE",
    hireDate: "2023-01-15",
    salary: 3500,
    address: "Calle Principal #123, Barinas",
    avatar: null,
    supervisor: null,
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2024-04-14T15:30:00Z"
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos.rodriguez@barinas.gob.ve",
    phone: "+58-275-2345678",
    position: "Técnico de Mantenimiento",
    department: "Obras Públicas",
    status: "ACTIVE",
    hireDate: "2023-03-20",
    salary: 2800,
    address: "Av. Bolívar #456, Barinas",
    avatar: null,
    supervisor: { name: "María González", email: "maria.gonzalez@barinas.gob.ve" },
    createdAt: "2023-03-20T09:00:00Z",
    updatedAt: "2024-04-13T11:20:00Z"
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@barinas.gob.ve",
    phone: "+58-275-3456789",
    position: "Operadora de Sistema",
    department: "Tecnología",
    status: "ACTIVE",
    hireDate: "2022-11-10",
    salary: 3200,
    address: "Urbanización La Paz, Barinas",
    avatar: null,
    supervisor: { name: "María González", email: "maria.gonzalez@barinas.gob.ve" },
    createdAt: "2022-11-10T14:00:00Z",
    updatedAt: "2024-04-12T16:45:00Z"
  },
  {
    id: "4",
    name: "Luis Torres",
    email: "luis.torres@barinas.gob.ve",
    phone: "+58-275-4567890",
    position: "Inspector de Seguridad",
    department: "Seguridad Ciudadana",
    status: "SUSPENDED",
    hireDate: "2023-06-01",
    salary: 2500,
    address: "Centro, Barinas",
    avatar: null,
    supervisor: { name: "Carlos Rodríguez", email: "carlos.rodriguez@barinas.gob.ve" },
    createdAt: "2023-06-01T11:00:00Z",
    updatedAt: "2024-02-15T09:30:00Z"
  },
];

const departments = [
  "Todos",
  "Servicios Urbanos",
  "Obras Públicas",
  "Mantenimiento Vial",
  "Seguridad Ciudadana",
  "Tecnología",
  "Medio Ambiente",
  "Recursos Humanos"
];

const statuses = [
  "Todos",
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED"
];

function FuncionariosContent() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchEmployees();
  }, [searchTerm, filterDepartment, filterStatus]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(filterDepartment !== "Todos" && { department: filterDepartment }),
        ...(filterStatus !== "Todos" && { status: filterStatus }),
      });

      const response = await fetch(`/api/admin/employees?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEmployees(data.employees || []);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = (employees || []).filter((employee) => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "Todos" || employee.department === filterDepartment;
    const matchesStatus = filterStatus === "Todos" || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700";
      case "INACTIVE": return "bg-slate-100 text-slate-700";
      case "SUSPENDED": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Activo";
      case "INACTIVE": return "Inactivo";
      case "SUSPENDED": return "Suspendido";
      default: return status;
    }
  };

  if (loading) {
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
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gestión de Funcionarios</h1>
                <p className="text-sm text-slate-500">Personal municipal - Barinas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <Link
                href="/gestion/funcionarios/nuevo"
                className="inline-flex items-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Funcionario
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
          <div className="grid gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar funcionarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Department Filter */}
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            {/* Sort */}
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="name">Nombre</option>
              <option value="department">Departamento</option>
              <option value="status">Estado</option>
              <option value="hireDate">Fecha de Contratación</option>
            </select>
          </div>
        </motion.div>

        {/* Employees Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      {employee.avatar ? (
                        <img src={employee.avatar} alt={employee.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <Users className="w-6 h-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
                      <p className="text-sm text-slate-600">{employee.position}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {getStatusText(employee.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.department && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building className="w-4 h-4" />
                      <span>{employee.department}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    <span className="font-medium">Contratado:</span> {employee.hireDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button className="inline-flex items-center rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
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
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron funcionarios</h3>
              <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// Componente dinámico para evitar hidratación
const DynamicFuncionariosContent = dynamic(() => Promise.resolve(FuncionariosContent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
});

export default function FuncionariosPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <DynamicFuncionariosContent />;
}
