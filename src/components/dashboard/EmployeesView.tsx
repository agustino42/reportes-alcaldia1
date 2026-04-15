"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  Users,
  Search,
  Plus,
  Download,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Calendar,
  Filter,
  X,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import * as XLSX from 'xlsx';

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

export default function EmployeesView() {
  const { addNotification } = useDashboard();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("Todos");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  const departments = [
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
    "Asesoría Legal"
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchEmployees();
    }
  }, [mounted, searchTerm, filterDepartment, filterStatus]);

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

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    const employeesDataForExcel = [
      ['ID', 'Nombre', 'Email', 'Teléfono', 'Posición', 'Departamento', 'Estado', 'Fecha Contratación', 'Salario', 'Dirección', 'Fecha Creación']
    ];
    
    employees.forEach(employee => {
      employeesDataForExcel.push([
        employee.id,
        employee.name,
        employee.email,
        employee.phone || 'N/A',
        employee.position,
        employee.department || 'N/A',
        employee.status,
        employee.hireDate,
        employee.salary.toString(),
        employee.address || 'N/A',
        employee.createdAt
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(employeesDataForExcel);
    XLSX.utils.book_append_sheet(wb, ws, 'Funcionarios');
    XLSX.writeFile(wb, `funcionarios-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Exportación Exitosa',
      message: `Se han exportado ${employees.length} funcionarios a Excel`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-100 text-green-700 border-green-200";
      case "INACTIVE": return "bg-red-100 text-red-700 border-red-200";
      case "ON_LEAVE": return "bg-amber-100 text-amber-700 border-amber-200";
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
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Funcionarios</h2>
          <p className="text-slate-500 mt-1">
            Administra el personal municipal y sus departamentos
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
          <Link href="/gestion/funcionarios/nuevo">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Nuevo Funcionario
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
                placeholder="Buscar funcionarios..."
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Departamento</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Todos">Todos los estados</option>
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="ON_LEAVE">En permiso</option>
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Employees Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm text-center py-12">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron funcionarios</h3>
            <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map((employee, index) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{employee.name}</h3>
                        <p className="text-sm text-slate-500">{employee.position}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(employee.status)}`}>
                      {employee.status === 'ACTIVE' ? 'Activo' : 
                       employee.status === 'INACTIVE' ? 'Inactivo' : 'En permiso'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {employee.email}
                    </div>
                    {employee.phone && (
                      <div className="flex items-center text-sm text-slate-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {employee.phone}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-slate-500">
                      <Building className="w-4 h-4 mr-2" />
                      {employee.department || 'Sin departamento'}
                    </div>
                    <div className="flex items-center text-sm text-slate-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {employee.hireDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-sm">
                      <span className="text-slate-500">Salario: </span>
                      <span className="font-medium text-slate-900">${employee.salary.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Edit className="w-4 h-4 text-slate-600" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
