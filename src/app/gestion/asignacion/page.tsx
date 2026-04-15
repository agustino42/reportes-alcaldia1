"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useDashboard, DashboardProvider } from "@/contexts/DashboardContext";
import {
  Users,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  User,
  MapPin,
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  Wrench,
  Truck,
  FileText
} from "lucide-react";
import * as XLSX from 'xlsx';

interface Case {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  category: string;
  trackerCode: string;
  createdAt: string;
  assignedTo?: string;
  assignedDepartment?: string;
}

interface Crew {
  id: string;
  name: string;
  department: string;
  leader: string;
  members: number;
  activeCases: number;
  maxCases: number;
  specialties: string[];
  phone: string;
  efficiency: number;
}

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const mockCrews: Crew[] = [
  {
    id: "crew-1",
    name: "Cuadrilla de Bacheo",
    department: "Obras Públicas",
    leader: "Ing. Carlos Rodríguez",
    members: 4,
    activeCases: 3,
    maxCases: 6,
    specialties: ["Baches", "Asfalto", "Vialidad"],
    phone: "+58-275-1234567",
    efficiency: 92
  },
  {
    id: "crew-2", 
    name: "Cuadrilla de Alumbrado",
    department: "Servicios Urbanos",
    leader: "Téc. María González",
    members: 3,
    activeCases: 2,
    maxCases: 5,
    specialties: ["Luminarias", "Postes", "Electricidad"],
    phone: "+58-275-1234568",
    efficiency: 88
  },
  {
    id: "crew-3",
    name: "Cuadrilla de Limpieza",
    department: "Servicios Urbanos",
    leader: "Sr. Luis Torres",
    members: 5,
    activeCases: 4,
    maxCases: 8,
    specialties: ["Basura", "Aseo", "Reciclaje"],
    phone: "+58-275-1234569",
    efficiency: 95
  },
  {
    id: "crew-4",
    name: "Cuadrilla de Mantenimiento",
    department: "Mantenimiento Vial",
    leader: "Ing. Ana Martínez",
    members: 3,
    activeCases: 1,
    maxCases: 4,
    specialties: ["Señalización", "Brocales", "Drenaje"],
    phone: "+58-275-1234570",
    efficiency: 85
  }
];

function AssignmentPageContent() {
  const { addNotification } = useDashboard();
  const [mounted, setMounted] = useState(false);
  const [cases, setCases] = useState<Case[]>([]);
  const [crews, setCrews] = useState<Crew[]>(mockCrews);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("todos");
  const [filterStatus, setFilterStatus] = useState("pendientes");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedCrew, setSelectedCrew] = useState<Crew | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/admin/incidents');
      const data = await response.json();
      
      if (data.success) {
        const formattedCases = data.incidents.map((incident: any) => ({
          id: incident.id,
          title: incident.title,
          description: incident.description,
          location: incident.location || 'No especificada',
          status: incident.status === 'RECIBIDO' ? 'Pendiente' :
                 incident.status === 'EN_REVISION' ? 'En revisión' :
                 incident.status === 'ASIGNADO' ? 'Asignado' :
                 incident.status === 'COMPLETADO' ? 'Completado' : incident.status,
          category: incident.category,
          trackerCode: incident.trackerCode,
          createdAt: incident.createdAt
        }));
        setCases(formattedCases);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowAssignModal(true);
  };

  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setShowDetailsModal(true);
  };

  const handleStatsClick = (status: string) => {
    setFilterStatus(status);
    // Scroll to the cases list
    const casesListElement = document.getElementById('cases-list');
    if (casesListElement) {
      casesListElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAssignCrewsToReview = () => {
    setFilterStatus('pendientes');
    // Scroll to the cases list
    const casesListElement = document.getElementById('cases-list');
    if (casesListElement) {
      casesListElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCrewSelection = (crew: Crew) => {
    setSelectedCrew(crew);
  };

  const confirmAssignment = async () => {
    if (!selectedCase || !selectedCrew) return;

    try {
      // Actualizar estado del caso
      const response = await fetch(`/api/admin/incidents/${selectedCase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'ASIGNADO',
          assignedTo: selectedCrew.name,
          assignedDepartment: selectedCrew.department
        }),
      });

      if (response.ok) {
        // Actualizar estado local
        setCases(prev => prev.map(c => 
          c.id === selectedCase.id 
            ? { ...c, status: 'Asignado', assignedTo: selectedCrew.name, assignedDepartment: selectedCrew.department }
            : c
        ));

        // Actualizar cuadrilla
        setCrews(prev => prev.map(crew =>
          crew.id === selectedCrew.id
            ? { ...crew, activeCases: crew.activeCases + 1 }
            : crew
        ));

        addNotification({
          type: 'success',
          title: 'Caso Asignado Exitosamente',
          message: `El caso ${selectedCase.trackerCode} ha sido asignado a ${selectedCrew.name}`
        });

        setShowAssignModal(false);
        setSelectedCase(null);
        setSelectedCrew(null);
      }
    } catch (error) {
      console.error('Error assigning case:', error);
      addNotification({
        type: 'error',
        title: 'Error de Asignación',
        message: 'No se pudo asignar el caso. Intente nuevamente.'
      });
    }
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Hoja de casos
    const casesData = [
      ['ID', 'Código', 'Título', 'Ubicación', 'Categoría', 'Estado', 'Fecha', 'Asignado a', 'Departamento']
    ];
    
    cases.forEach(case_ => {
      casesData.push([
        case_.id,
        case_.trackerCode,
        case_.title,
        case_.location,
        case_.category,
        case_.status,
        new Date(case_.createdAt).toLocaleDateString(),
        case_.assignedTo || 'No asignado',
        case_.assignedDepartment || 'N/A'
      ]);
    });

    const wsCases = XLSX.utils.aoa_to_sheet(casesData);
    XLSX.utils.book_append_sheet(wb, wsCases, 'Casos');

    // Hoja de cuadrillas
    const crewsData = [
      ['Nombre', 'Departamento', 'Líder', 'Miembros', 'Casos Activos', 'Máximo Casos', 'Eficiencia', 'Teléfono']
    ];
    
    crews.forEach(crew => {
      crewsData.push([
        crew.name,
        crew.department,
        crew.leader,
        crew.members.toString(),
        crew.activeCases.toString(),
        crew.maxCases.toString(),
        `${crew.efficiency}%`,
        crew.phone
      ]);
    });

    const wsCrews = XLSX.utils.aoa_to_sheet(crewsData);
    XLSX.utils.book_append_sheet(wb, wsCrews, 'Cuadrillas');

    XLSX.writeFile(wb, `asignacion-cuadrillas-${new Date().toISOString().split('T')[0]}.xlsx`);
    
    addNotification({
      type: 'success',
      title: 'Exportación Exitosa',
      message: 'Se han exportado los datos de asignación a Excel'
    });
  };

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = (case_.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (case_.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (case_.trackerCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || 
                         (filterStatus === "pendientes" && case_.status === 'Pendiente') ||
                         (filterStatus === "asignados" && case_.status === 'Asignado') ||
                         (filterStatus === "completados" && case_.status === 'Completado');

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendiente": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Asignado": return "bg-blue-100 text-blue-700 border-blue-200";
      case "En revisión": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Completado": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch ((category || '').toLowerCase()) {
      case "vialidad": return <Truck className="w-4 h-4" />;
      case "alumbrado": return <Wrench className="w-4 h-4" />;
      case "aseo": return <Users className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Link href="/gestion">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Asignación de Cuadrillas</h2>
            <p className="text-slate-500 mt-1">
              Asigna casos pendientes a las cuadrillas de trabajo disponibles
            </p>
          </div>
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

      {/* Stats Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <button
          onClick={() => handleStatsClick('pendientes')}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Pendientes
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {cases.filter(c => c.status === 'Pendiente').length}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Casos por asignar</p>
        </button>

        <button
          onClick={() => handleStatsClick('asignados')}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              Activos
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {cases.filter(c => c.status === 'Asignado').length}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Casos en progreso</p>
        </button>

        <button
          onClick={() => handleStatsClick('completados')}
          className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all cursor-pointer text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-50 border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Completados
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {cases.filter(c => c.status === 'Completado').length}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Casos resueltos</p>
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Cuadrillas
            </span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{crews.length}</h3>
          <p className="text-sm text-slate-500 mt-1">Equipos disponibles</p>
          
          <div className="mt-4 space-y-2">
            <button
              onClick={handleAssignCrewsToReview}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              <Users className="w-4 h-4 mr-2 inline" />
              Asignar Cuadrilla
            </button>
            <p className="text-xs text-slate-500 text-center">
              Para casos pendientes de asignación
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar casos por código, título o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendientes">Pendientes</option>
              <option value="asignados">Asignados</option>
              <option value="completados">Completados</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Cases List */}
      <motion.div
        id="cases-list"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-200 shadow-sm"
      >
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Lista de Casos</h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No se encontraron casos</h3>
            <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredCases.map((case_, index) => (
              <motion.div
                key={case_.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-mono text-slate-700">
                        {case_.trackerCode}
                      </span>
                      <h4 className="font-medium text-slate-900">{case_.title}</h4>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(case_.status)}`}>
                        {case_.status}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {case_.description}
                      </p>
                      {case_.description && case_.description.length > 100 && (
                        <button
                          onClick={() => handleViewDetails(case_)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1"
                        >
                          Ver descripción completa...
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {case_.location}
                      </span>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(case_.category)}
                        {case_.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {case_.assignedTo && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-900">Asignado a: {case_.assignedTo}</span>
                          <span className="text-blue-600">({case_.assignedDepartment})</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(case_)}
                        className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </button>
                      {case_.status === 'Pendiente' && (
                        <button
                          onClick={() => handleAssignCase(case_)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Users className="w-4 h-4 mr-1" />
                          Asignar
                        </button>
                      )}
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors self-end">
                      <MoreVertical className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Assignment Modal */}
      {showAssignModal && selectedCase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Asignar Cuadrilla</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Case Details */}
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-mono text-slate-700">
                  {selectedCase.trackerCode}
                </span>
                <h4 className="font-medium text-slate-900">{selectedCase.title}</h4>
              </div>
              <p className="text-sm text-slate-600 mb-2">{selectedCase.description}</p>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedCase.location}
                </span>
                <span className="flex items-center gap-1">
                  {getCategoryIcon(selectedCase.category)}
                  {selectedCase.category}
                </span>
              </div>
            </div>

            {/* Available Crews */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Cuadrillas Disponibles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crews
                  .filter(crew => crew.activeCases < crew.maxCases)
                  .map((crew) => (
                    <div
                      key={crew.id}
                      onClick={() => handleCrewSelection(crew)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCrew?.id === crew.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                            <Users className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <h5 className="font-medium text-slate-900">{crew.name}</h5>
                            <p className="text-sm text-slate-500">{crew.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{crew.efficiency}%</div>
                          <div className="text-xs text-slate-500">eficiencia</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Líder:</span>
                          <span className="font-medium">{crew.leader}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Capacidad:</span>
                          <span className="font-medium">{crew.activeCases}/{crew.maxCases} casos</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Especialidades:</span>
                          <span className="text-right">{crew.specialties.join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Contacto:</span>
                          <span className="font-medium">{crew.phone}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmAssignment}
                disabled={!selectedCrew}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Asignación
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedCase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Detalles del Reporte</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Case Header */}
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-mono text-slate-700">
                  {selectedCase.trackerCode}
                </span>
                <h4 className="font-medium text-slate-900">{selectedCase.title}</h4>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusColor(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Ubicación:</span>
                  <span className="font-medium text-slate-900">{selectedCase.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryIcon(selectedCase.category)}
                  <span className="text-slate-600">Categoría:</span>
                  <span className="font-medium text-slate-900">{selectedCase.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Fecha:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(selectedCase.createdAt).toLocaleDateString('es-VE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">Hora:</span>
                  <span className="font-medium text-slate-900">
                    {new Date(selectedCase.createdAt).toLocaleTimeString('es-VE', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="mb-6">
              <h4 className="font-medium text-slate-900 mb-3">Descripción Completa</h4>
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-slate-700 leading-relaxed">
                  {selectedCase.description}
                </p>
              </div>
            </div>

            {/* Assignment Info */}
            {selectedCase.assignedTo && (
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Información de Asignación</h4>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Asignado a: {selectedCase.assignedTo}</p>
                      <p className="text-sm text-blue-600">Departamento: {selectedCase.assignedDepartment}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              {selectedCase.status === 'Pendiente' && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleAssignCase(selectedCase);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Users className="w-4 h-4 mr-2 inline" />
                  Asignar Cuadrilla
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function AssignmentPage() {
  return (
    <DashboardProvider>
      <AssignmentPageContent />
    </DashboardProvider>
  );
}
