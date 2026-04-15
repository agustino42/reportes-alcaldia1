"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Clock,
  MapPin,
  User,
  Calendar,
  FileText,
  Camera,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Users,
  Save,
  X,
  Plus,
  Paperclip,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

// Mock data - en producción esto vendría de la base de datos
const mockCaseData = {
  "INC-001": {
    id: "INC-001",
    title: "Bache en calle principal",
    description: "Hundimiento grande en la avenida principal que afecta el tránsito vehicular. El bache tiene aproximadamente 1 metro de diámetro y 30 cm de profundidad, representando un riesgo para los vehículos y peatones.",
    location: "Barrio San Juan, Av. Principal entre calles 5 y 6",
    category: "Infraestructura",
    status: "En revisión",
    priority: "Alta",
    reportedBy: "Juan Pérez",
    reportedPhone: "+58-412-1234567",
    reportedEmail: "juan.perez@email.com",
    reportedDate: "2024-04-14",
    reportedTime: "10:30 AM",
    assignedTo: "No asignado",
    assignedDepartment: "Por definir",
    estimatedResolution: "2024-04-18",
    images: ["/placeholder-image.jpg", "/placeholder-image.jpg"],
    updates: [
      {
        id: 1,
        author: "Sistema",
        role: "Automático",
        timestamp: "2024-04-14 10:30 AM",
        message: "Caso creado y registrado en el sistema."
      },
      {
        id: 2,
        author: "María González",
        role: "Operador",
        timestamp: "2024-04-14 11:15 AM",
        message: "Caso revisado. Se requiere inspección técnica antes de asignar."
      }
    ],
    tags: ["vialidad", "seguridad", "urgente"],
    coordinates: { lat: 8.6236, lng: -70.2184 }
  }
};

const departments = [
  "Obras Públicas",
  "Mantenimiento Vial",
  "Servicios Urbanos",
  "Seguridad Ciudadana",
  "Medio Ambiente"
];

const statusOptions = [
  "Pendiente",
  "En revisión",
  "Asignado",
  "En proceso",
  "Resuelto",
  "Cerrado"
];

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const [caseData, setCaseData] = useState(mockCaseData[caseId as keyof typeof mockCaseData] || mockCaseData["INC-001"]);
  const [isEditing, setIsEditing] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const [editedCase, setEditedCase] = useState(caseData);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchCaseData();
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`/api/admin/incidents/${caseId}`);
      const data = await response.json();
      
      if (data.success) {
        setCaseData(data.incident);
        setEditedCase(data.incident);
      }
    } catch (error) {
      console.error('Error fetching case data:', error);
    } finally {
      setLoading(false);
    }
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

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/admin/incidents/${caseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editedCase.status,
          assignedDepartment: editedCase.assignedDepartment,
          assignedTo: editedCase.assignedTo,
          notes: 'Actualizado desde el panel de gestión'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCaseData(editedCase);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving case:', error);
    }
  };

  const handleAddUpdate = async () => {
    if (newUpdate.trim()) {
      try {
        // Aquí iría la lógica para agregar actualización a la base de datos
        console.log("Nueva actualización:", newUpdate);
        setNewUpdate("");
      } catch (error) {
        console.error('Error adding update:', error);
      }
    }
  };

  if (!mounted || loading) {
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
                href="/gestion/casos"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Caso {caseData.id}</h1>
                <p className="text-sm text-slate-500">{caseData.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Guardar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{caseData.title}</h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getPriorityColor(caseData.priority)}`}>
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Prioridad: {caseData.priority}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(caseData.status)}`}>
                      {caseData.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Descripción</h3>
                  <p className="text-slate-600 leading-relaxed">{caseData.description}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Ubicación</h3>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{caseData.location}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Categoría</h3>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                      {caseData.category}
                    </span>
                  </div>
                </div>

                {/* Editable Fields */}
                {isEditing && (
                  <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Departamento Asignado
                      </label>
                      <select
                        value={editedCase.assignedDepartment}
                        onChange={(e) => setEditedCase({...editedCase, assignedDepartment: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Sin asignar</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Estado
                      </label>
                      <select
                        value={editedCase.status}
                        onChange={(e) => setEditedCase({...editedCase, status: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Images */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Evidencia Fotográfica</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {caseData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 bg-white rounded-lg px-3 py-1 text-sm font-medium text-slate-700 shadow-sm">
                        Ver imagen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Updates */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Historial de Actualizaciones</h3>
              
              <div className="space-y-4 mb-6">
                {caseData.updates.map((update) => (
                  <div key={update.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{update.author}</span>
                        <span className="text-xs text-slate-500">• {update.role}</span>
                        <span className="text-xs text-slate-400">{update.timestamp}</span>
                      </div>
                      <p className="text-slate-600 text-sm">{update.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Update */}
              <div className="border-t border-slate-200 pt-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      placeholder="Agregar una actualización..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={handleAddUpdate}
                        disabled={!newUpdate.trim()}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Agregar Actualización
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Información del Reportante</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{caseData.reportedBy}</p>
                    <p className="text-xs text-slate-500">Ciudadano</p>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  <p>{caseData.reportedPhone}</p>
                  <p>{caseData.reportedEmail}</p>
                </div>
              </div>
            </motion.div>

            {/* Assignment Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Asignación</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Departamento</p>
                  <p className="text-sm text-slate-600">{caseData.assignedDepartment}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Asignado a</p>
                  <p className="text-sm text-slate-600">{caseData.assignedTo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-1">Fecha estimada de resolución</p>
                  <p className="text-sm text-slate-600">{caseData.estimatedResolution}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Línea de Tiempo</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Reporte recibido</p>
                    <p className="text-xs text-slate-500">{caseData.reportedDate} • {caseData.reportedTime}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">En revisión</p>
                    <p className="text-xs text-slate-500">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Asignación pendiente</p>
                    <p className="text-xs text-slate-400">Próximo paso</p>
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
