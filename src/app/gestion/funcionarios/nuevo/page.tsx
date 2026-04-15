"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Users,
  ArrowLeft,
  Save,
  X,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  MapPin,
  Upload,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const academicLevels = [
  "Bachiller",
  "TSU",
  "Universitario",
  "Postgrado",
  "Maestría",
  "Doctorado"
];

const departments = [
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

const positions = [
  "Alcalde",
  "Director General",
  "Director de Departamento",
  "Jefe de División",
  "Supervisor",
  "Técnico Superior",
  "Técnico",
  "Analista",
  "Coordinador",
  "Asistente Administrativo",
  "Operador",
  "Inspector",
  "Consultor",
  "Auxiliar"
];

function NuevoFuncionarioContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    academicLevel: "",
    department: "",
    salary: "",
    address: "",
    supervisorId: "",
    status: "ACTIVE"
  });
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    setMounted(true);
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/admin/employees');
      const data = await response.json();
      if (data.success) {
        setSupervisors(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Funcionario creado exitosamente');
        // Redirigir a la lista de funcionarios
        router.push('/gestion/funcionarios');
      } else {
        alert('Error: ' + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Error al crear el funcionario');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                href="/gestion/funcionarios"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Link>
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Nuevo Funcionario</h1>
                <p className="text-sm text-slate-500">Agregar personal municipal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl border border-slate-200 p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Información Personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: juan.perez@barinas.gob.ve"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: +58-275-1234567"
                  />
                </div>
              </div>

              {/* Información Laboral */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Laboral</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cargo <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar cargo...</option>
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nivel Académico
                  </label>
                  <select
                    name="academicLevel"
                    value={formData.academicLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar nivel...</option>
                    {academicLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Departamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar departamento...</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Supervisor
                  </label>
                  <select
                    name="supervisorId"
                    value={formData.supervisorId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sin supervisor</option>
                    {supervisors.map(supervisor => (
                      <option key={supervisor.id} value={supervisor.id}>
                        {supervisor.name} - {supervisor.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Información Adicional</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Salario Mensual
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ej: Calle Principal #123, Barinas"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Estado</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado del Funcionario
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                    <option value="SUSPENDED">Suspendido</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Foto de Perfil</h3>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 mb-2">Arrastra y suelta una imagen aquí</p>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Seleccionar Archivo
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
              <Link
                href="/gestion/funcionarios"
                className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Guardando...' : 'Guardar Funcionario'}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

// Componente dinámico para evitar hidratación
const DynamicNuevoFuncionarioContent = dynamic(() => Promise.resolve(NuevoFuncionarioContent), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
});

export default function NuevoFuncionarioPage() {
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

  return <DynamicNuevoFuncionarioContent />;
}
