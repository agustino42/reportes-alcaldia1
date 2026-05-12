"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Bell, Palette, Database, Globe } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const settingsSections = [
  {
    icon: Shield,
    title: "Seguridad",
    description: "Gestión de accesos, roles y permisos del sistema",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Configura alertas y canales de comunicación",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Palette,
    title: "Apariencia",
    description: "Personaliza colores, logos y estilo del panel",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Database,
    title: "Datos",
    description: "Exporta, importa y gestiona la base de datos",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Globe,
    title: "Integraciones",
    description: "Conecta con servicios externos y APIs",
    color: "bg-cyan-100 text-cyan-600",
  },
];

export default function ConfiguracionPage() {
  return (
    <div className="p-6 space-y-6">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500 mt-1">Ajustes generales del sistema</p>
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className={`w-12 h-12 rounded-xl ${section.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{section.title}</h3>
              <p className="text-sm text-slate-500">{section.description}</p>
            </div>
          );
        })}
      </motion.div>

      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm text-center">
        <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Módulo en desarrollo</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          La configuración avanzada estará disponible próximamente. Por ahora, el sistema opera con los valores predeterminados.
        </p>
      </motion.div>
    </div>
  );
}
