"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  ArrowLeft,
  Save,
  X,
  Phone,
  Briefcase,
  GraduationCap,
  DollarSign,
  MapPin,
  Upload,
} from "lucide-react";

const ACADEMIC_LEVELS = ["Bachiller", "TSU", "Universitario", "Postgrado", "Maestría", "Doctorado"];
const DEPARTMENTS = ["Servicios Urbanos", "Obras Públicas", "Mantenimiento Vial", "Seguridad Ciudadana", "Tecnología", "Medio Ambiente", "Recursos Humanos", "Hacienda", "Contraloría", "Asesoría Legal"];
const POSITIONS = ["Alcalde", "Director General", "Director de Departamento", "Jefe de División", "Supervisor", "Técnico Superior", "Técnico", "Analista", "Coordinador", "Asistente Administrativo", "Operador", "Inspector", "Consultor", "Auxiliar"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface Employee {
  id: string;
  name: string;
  position: string;
}

export default function NuevoFuncionarioPage() {
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
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [supervisors, setSupervisors] = useState<Employee[]>([]);
  const [error, setError] = useState("");

  const fetchSupervisors = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/employees");
      const data = await response.json();
      if (data.success) setSupervisors(data.employees || []);
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchSupervisors();
  }, [fetchSupervisors]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        router.push("/admin/funcionarios");
      } else {
        setError(data.error || "Error al crear el funcionario");
      }
    } catch {
      setError("Error de conexión. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3 mb-8">
        <Link href="/admin/funcionarios" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Nuevo Funcionario</h2>
          <p className="text-slate-500">Agregar personal municipal</p>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-200 p-8 shadow-lg">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Información Personal
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo <span className="text-red-500">*</span></label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico <span className="text-red-500">*</span></label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="correo@ejemplo.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="+58-275-1234567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Calle Principal #123, Barinas" />
                </div>
              </div>
            </div>

            {/* Work Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Información Laboral
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo <span className="text-red-500">*</span></label>
                <select name="position" value={formData.position} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar cargo...</option>
                  {POSITIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Departamento <span className="text-red-500">*</span></label>
                <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Seleccionar departamento...</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nivel Académico</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select name="academicLevel" value={formData.academicLevel} onChange={handleChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Seleccionar nivel...</option>
                    {ACADEMIC_LEVELS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supervisor</label>
                <select name="supervisorId" value={formData.supervisorId} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sin supervisor</option>
                  {supervisors.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} - {s.position}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Salario</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} step="0.01" min="0" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="ACTIVE">Activo</option>
                    <option value="INACTIVE">Inactivo</option>
                    <option value="SUSPENDED">Suspendido</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Upload placeholder */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-2">Foto de perfil (opcional)</p>
            <p className="text-xs text-slate-400">Funcionalidad de carga pendiente de implementación</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
            <Link href="/admin/funcionarios" className="inline-flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
              <X className="w-4 h-4" />
              Cancelar
            </Link>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : "Guardar Funcionario"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
