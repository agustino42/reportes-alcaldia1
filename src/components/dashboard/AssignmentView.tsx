"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
import {
  Users,
  FileText,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Building,
  User,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface Case {
  id: string;
  title: string;
  location: string;
  status: string;
  priority: string;
  category: string;
  reportedDate: string;
  description: string;
}

interface Department {
  id: number;
  name: string;
  casesHandled: number;
  avgResolutionTime: string;
  efficiency: number;
  availableStaff: number;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  currentCases: number;
  maxCases: number;
  efficiency: number;
}

export default function AssignmentView() {
  const { addNotification } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Mock data - en producción vendría de la API
  const mockCases: Case[] = [
    {
      id: "INC-001",
      title: "Bache en calle principal",
      location: "Barrio San Juan",
      status: "Pendiente",
      priority: "Alta",
      category: "Infraestructura",
      reportedDate: "2024-01-15",
      description: "Hundimiento grave en avenida principal"
    },
    {
      id: "INC-002",
      title: "Luminaria apagada",
      location: "Sector La Paz",
      status: "Pendiente",
      priority: "Media",
      category: "Alumbrado",
      reportedDate: "2024-01-15",
      description: "Varias columnas sin funcionamiento"
    },
    {
      id: "INC-003",
      title: "Acumulación de basura",
      location: "El Carmen",
      status: "Pendiente",
      priority: "Media",
      category: "Limpieza",
      reportedDate: "2024-01-14",
      description: "Residuos en esquina escolar"
    }
  ];

  const departments: Department[] = [
    {
      id: 1,
      name: "Servicios Urbanos",
      casesHandled: 67,
      avgResolutionTime: "38h",
      efficiency: 92,
      availableStaff: 8
    },
    {
      id: 2,
      name: "Obras Públicas",
      casesHandled: 45,
      avgResolutionTime: "52h",
      efficiency: 85,
      availableStaff: 5
    },
    {
      id: 3,
      name: "Mantenimiento Vial",
      casesHandled: 38,
      avgResolutionTime: "41h",
      efficiency: 88,
      availableStaff: 6
    },
    {
      id: 4,
      name: "Seguridad Ciudadana",
      casesHandled: 28,
      avgResolutionTime: "35h",
      efficiency: 95,
      availableStaff: 4
    }
  ];

  const employees: Employee[] = [
    {
      id: "1",
      name: "Carlos Rodríguez",
      position: "Inspector de Obras",
      department: "Obras Públicas",
      currentCases: 3,
      maxCases: 5,
      efficiency: 88
    },
    {
      id: "2",
      name: "María González",
      position: "Técnica Municipal",
      department: "Servicios Urbanos",
      currentCases: 4,
      maxCases: 6,
      efficiency: 92
    },
    {
      id: "3",
      name: "Luis Martínez",
      position: "Operador de Mantenimiento",
      department: "Mantenimiento Vial",
      currentCases: 2,
      maxCases: 4,
      efficiency: 85
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.casesHandled.toString().includes(searchTerm)
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-100 text-red-700 border-red-200";
      case "Media": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Baja": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Asignado": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pendiente": return "bg-amber-100 text-amber-700 border-amber-200";
      case "En proceso": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const handleAssignCase = (caseItem: Case, employee: Employee) => {
    setSelectedCase(caseItem);
    setSelectedEmployee(employee);
    setShowAssignModal(true);
  };

  const confirmAssignment = () => {
    if (selectedCase && selectedEmployee) {
      // Aquí iría la lógica para asignar el caso
      addNotification({
        type: 'success',
        title: 'Caso Asignado',
        message: `El caso ${selectedCase.id} ha sido asignado a ${selectedEmployee.name}`
      });
      setShowAssignModal(false);
      setSelectedCase(null);
      setSelectedEmployee(null);
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Hoja de departamentos
    const departmentsData = [
      ['Departamento', 'Casos Atendidos', 'Tiempo Promedio Resolución', 'Eficiencia (%)', 'Personal Disponible']
    ];
    
    departments.forEach(dept => {
      departmentsData.push([
        dept.name,
        dept.casesHandled.toString(),
        dept.avgResolutionTime,
        dept.efficiency.toString(),
        dept.availableStaff.toString()
      ]);
    });

    const wsDepartments = XLSX.utils.aoa_to_sheet(departmentsData);
    XLSX.utils.book_append_sheet(wb, wsDepartments, 'Departamentos');

    // Hoja de empleados
    const employeesData = [
      ['Nombre', 'Posición', 'Departamento', 'Casos Actuales', 'Casos Máximos', 'Eficiencia (%)']
    ];
    
    employees.forEach(emp => {
      employeesData.push([
        emp.name,
        emp.position,
        emp.department,
        emp.currentCases.toString(),
        emp.maxCases.toString(),
        emp.efficiency.toString()
      ]);
    });

    const wsEmployees = XLSX.utils.aoa_to_sheet(employeesData);
    XLSX.utils.book_append_sheet(wb, wsEmployees, 'Empleados');

    // Hoja de casos pendientes
    const casesData = [
      ['ID', 'Título', 'Ubicación', 'Categoría', 'Prioridad', 'Fecha', 'Descripción']
    ];
    
    mockCases.forEach(case_ => {
      casesData.push([
        case_.id,
        case_.title,
        case_.location,
        case_.category,
        case_.priority,
        case_.reportedDate,
        case_.description
      ]);
    });

    const wsCases = XLSX.utils.aoa_to_sheet(casesData);
    XLSX.utils.book_append_sheet(wb, wsCases, 'Casos Pendientes');

    XLSX.writeFile(wb, `asignacion-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Reporte de Asignación Exportado',
      message: 'Se ha exportado el reporte de asignación a Excel'
    });
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
          <h2 className="text-2xl font-bold text-slate-900">Asignación de Casos</h2>
          <p className="text-slate-500 mt-1">
            Distribuye las incidencias entre los departamentos y funcionarios
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
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar departamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      {/* Departments Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {filteredDepartments.map((dept, index) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Building className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                    <p className="text-sm text-slate-500">{dept.availableStaff} funcionarios disponibles</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{dept.efficiency}%</div>
                  <div className="text-xs text-slate-500">Eficiencia</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-semibold text-slate-900">{dept.casesHandled}</div>
                  <div className="text-xs text-slate-500">Casos atendidos</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-lg font-semibold text-slate-900">{dept.avgResolutionTime}</div>
                  <div className="text-xs text-slate-500">Tiempo promedio</div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700">Personal Disponible</h4>
                {employees
                  .filter(emp => emp.department === dept.name)
                  .map((employee, empIndex) => (
                    <div key={employee.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{employee.name}</div>
                          <div className="text-xs text-slate-500">{employee.position}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">
                          {employee.currentCases}/{employee.maxCases} casos
                        </div>
                        <div className="text-xs font-medium text-green-600">
                          {employee.efficiency}% eficiente
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending Cases */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Casos Pendientes de Asignación</h3>
        </div>
        
        <div className="divide-y divide-slate-200">
          {mockCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-slate-900">{caseItem.title}</h4>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getPriorityColor(caseItem.priority)}`}>
                      {caseItem.priority}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(caseItem.status)}`}>
                      {caseItem.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{caseItem.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {caseItem.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {caseItem.reportedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {caseItem.category}
                    </span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <button
                    onClick={() => {
                      // Encontrar el mejor empleado disponible para este caso
                      const bestEmployee = employees.find(emp => 
                        emp.currentCases < emp.maxCases && 
                        emp.department === "Servicios Urbanos" // Lógica simplificada
                      );
                      if (bestEmployee) {
                        handleAssignCase(caseItem, bestEmployee);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Asignar Caso
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Assignment Modal */}
      {showAssignModal && selectedCase && selectedEmployee && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Confirmar Asignación</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 mb-1">Caso</p>
                <p className="font-medium text-slate-900">{selectedCase.title}</p>
                <p className="text-sm text-slate-600">{selectedCase.location}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Funcionario</p>
                <p className="font-medium text-slate-900">{selectedEmployee.name}</p>
                <p className="text-sm text-slate-600">{selectedEmployee.position} - {selectedEmployee.department}</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAssignment}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirmar Asignación
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
