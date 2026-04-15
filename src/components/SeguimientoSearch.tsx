"use client";

import { FormEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, MapPin, Tag } from "lucide-react";

interface Incident {
  title: string;
  description: string;
  status: string;
  category: string;
  createdAt: string;
  location: string;
}

const getStatusColor = (s: string) => {
  switch (s.toUpperCase()) {
    case "RECIBIDO":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "EN_REVISION":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETADO":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export default function SeguimientoSearch() {
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "not_found">(
    "idle"
  );
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch(`/api/incidents/${code}`);
      const data = await res.json();

      if (res.status === 404) {
        setIncident(null);
        setStatus("not_found");
        return;
      }

      if (data.success) {
        setIncident(data.incident);
        setStatus("success");
      } else {
        setIncident(null);
        setStatus("error");
      }
    } catch {
      setIncident(null);
      setStatus("error");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-100 mb-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Consulta de Trazabilidad</h1>
          <p className="text-slate-500">Ingresa tu código único para conocer el estatus de tu requerimiento.</p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Ej: A8X9B2"
            className="text-black flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-center sm:text-left text-lg font-bold tracking-widest uppercase transition-all"
          />
          <button
            type="submit"
            disabled={status === "loading" || !code}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {status === "loading" ? "Buscando..." : "Consultar Casos"}
          </button>
        </form>

        {status === "not_found" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
            No se encontró ninguna incidencia con ese código. Por favor verifica e intenta de nuevo.
          </motion.div>
        )}

        {status === "error" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-center font-medium border border-red-100">
            Ocurrió un error de conexión al consultar el sistema municipal.
          </motion.div>
        )}
      </motion.div>

      {status === "success" && incident && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{incident.title}</h2>
            <span className={`px-4 py-2 rounded-full border text-sm font-bold tracking-wide whitespace-nowrap ${getStatusColor(incident.status)}`}>
              ESTATUS: {incident.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-slate-600 mb-8 leading-relaxed">{incident.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fecha Reporte</p>
                <span className="text-sm font-medium text-slate-900">{new Date(incident.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ubicación</p>
                <span className="text-sm font-medium text-slate-900 truncate block max-w-[200px]" title={incident.location}>{incident.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500 sm:col-span-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
                <Tag className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</p>
                <span className="text-sm font-medium text-slate-900">{incident.category}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
