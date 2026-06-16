"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";
import Baner1 from "@/components/Baner1";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

interface PublishedIncident {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  status: string;
  trackerCode: string;
  imageUrl: string | null;
  citizenName: string | null;
  publishedAt: string;
  createdAt: string;
}

const faqItems = [
  {
    question: "¿Cómo envío un reporte?",
    answer: "Haz clic en ‘Reportar Incidencia’, completa la información del problema y envía el formulario.",
  },
  {
    question: "¿Cómo consulto el estatus?",
    answer: "Ingresa tu código en la sección ‘Consultar Estatus’ y revisa el progreso en tiempo real.",
  },
  {
    question: "¿Puedo seguir varios reportes?",
    answer: "Sí, cada incidencia tiene su propio código para seguimiento independiente.",
  },
  {
    question: "¿Qué tipo de casos puedo reportar?",
    answer: "Puedes reportar problemas de alumbrado, baches, basura, infraestructura y otros servicios públicos.",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [publishedIncidents, setPublishedIncidents] = useState<PublishedIncident[]>([]);
  const [loadingIncidents, setLoadingIncidents] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchPublished() {
      try {
        const res = await fetch("/api/public/incidents");
        const data = await res.json();
        if (data.success) {
          setPublishedIncidents(data.incidents);
        }
      } catch {
        // silently fail, show empty
      } finally {
        setLoadingIncidents(false);
      }
    }
    fetchPublished();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-white text-slate-900 selection:bg-blue-200">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_28%)]" />
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/30 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/25 to-transparent blur-3xl" />

        <header className="relative z-20 px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/10">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Alcaldía de Barinas</p>
              <h1 className="text-lg font-bold text-slate-900">Incidencias Ciudadanas</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/reportar" className="hover:text-blue-600 transition-colors">Reportar</Link>
              <Link href="/seguimiento" className="hover:text-blue-600 transition-colors">Seguimiento</Link>
              <Link href="/admin" className="hover:text-blue-600 transition-colors">Panel administrativo</Link>
            </nav>
            <Link href="/reportar" className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
              Reportar ahora
            </Link>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-100 via-sky-50 to-white text-slate-900 selection:bg-blue-200">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_28%)]" />
      <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/30 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-24 h-72 w-72 rounded-full bg-gradient-to-br from-emerald-300/25 to-transparent blur-3xl" />

      <header className="relative z-20 px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shadow-sm shadow-blue-600/10">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Alcaldía de Barinas</p>
            <h1 className="text-lg font-bold text-slate-900">Incidencias Ciudadanas</h1>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
            <Link href="/reportar" className="hover:text-blue-600 transition-colors">Reportar</Link>
            <Link href="/seguimiento" className="hover:text-blue-600 transition-colors">Seguimiento</Link>
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Panel administrativo</Link>
          </nav>
          <Link href="/reportar" className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
            Reportar ahora
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 sm:py-14">
        <section className="grid gap-14 xl:grid-cols-[1.25fr_0.9fr] items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="mb-10 grid gap-6 rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-2xl shadow-slate-300/20 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-4 rounded-[1.75rem] bg-slate-100/90 p-4 shadow-sm shadow-slate-200/40">
                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-inner shadow-slate-200/40">
                    <Image src="/alcaldia-logo.webp" alt="Alcaldía de Barinas" width={64} height={64} className="rounded-2xl object-cover" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Alcaldía de Barinas</p>
                    <p className="text-lg font-semibold text-slate-900">Portal ciudadano oficial</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.18),transparent_25%)]" />
                  <div className="relative z-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Atención ciudadana</p>
                    <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight text-white">Reporta, sigue y transforma tu municipio</h1>
                    <p className="mt-5 max-w-xl text-base text-slate-200 leading-7">
                      Un espacio confiable para que cada ciudadano pueda reportar problemas y observar el progreso en tiempo real.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl bg-white/10 p-4 border border-white/10">
                        <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Atención rápida</p>
                        <p className="mt-2 text-lg font-semibold">Flujo directo</p>
                      </div>
                      <div className="rounded-3xl bg-white/10 p-4 border border-white/10">
                        <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Seguimiento</p>
                        <p className="mt-2 text-lg font-semibold">Código único</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-sky-100/85 px-4 py-2 text-sm font-semibold text-sky-700 mb-6">
              <Sparkles className="w-4 h-4" />
              Participa en la mejora de tu ciudad
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Reporta incidencias en Barinas <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">y sigue su resolución</span> con transparencia.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 leading-8">
              Facilita la comunicación entre ciudadanos y la Alcaldía. Envía tu reporte en pocos pasos, recibe un código único y consulta el avance en tiempo real.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/reportar" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                <PlusCircle className="w-5 h-5 mr-2" />
                Reportar Incidencia
              </Link>
              <Link href="/seguimiento" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-800 shadow-sm hover:border-blue-200 hover:bg-blue-50 transition-all">
                <Search className="w-5 h-5 text-blue-500 mr-2" />
                Consultar Estatus
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Respuestas rápidas</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">24/7</p>
              </div>
              <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Códigos únicos</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">Seguimiento fácil</p>
              </div>
              <div className="rounded-3xl bg-white/90 border border-slate-200 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Gestión transparente</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">Auditable</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-2xl shadow-slate-400/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),transparent_35%)]" />
            <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-indigo-200/40 blur-2xl" />
            <div className="relative z-10 space-y-6">
              <div className="rounded-3xl bg-slate-900/95 p-6 text-white shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Reportes recientes</p>
                    <h3 className="mt-4 text-2xl font-semibold">Últimos reportes de la comunidad</h3>
                  </div>
                  <div className="rounded-3xl bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-200">En tiempo real</div>
                </div>
                <p className="mt-3 text-sm text-slate-200 leading-6">
                  Sigue aquí los reportes que llegan desde diferentes sectores de Barinas y revisa cómo avanza cada caso.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Casos destacados</p>
                  <p className="mt-3 text-base text-slate-700 leading-6">
                    Historias reales de vecinos que ya reportaron y están en proceso de atención.
                  </p>
                  <Link href="/seguimiento" className="mt-5 inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                    Ver seguimiento
                  </Link>
                </div>

                {loadingIncidents ? (
                  <div className="text-center py-8 text-sm text-slate-400">Cargando publicaciones...</div>
                ) : publishedIncidents.length === 0 ? (
                  <div className="rounded-3xl bg-slate-50 p-5 border border-slate-200 shadow-sm text-center text-sm text-slate-400">
                    No hay publicaciones destacadas aún
                  </div>
                ) : (
                  publishedIncidents.map((incident) => (
                    <div key={incident.id} className="rounded-3xl bg-slate-50 p-5 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{incident.title}</p>
                          <p className="text-sm text-slate-500">{incident.location || "Sin ubicación"}</p>
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {incident.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-6 mb-4">{incident.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          <Clock3 className="w-3.5 h-3.5 mr-1" />
                          {incident.status === "RECIBIDO" ? "Recibido" : incident.status === "EN_REVISION" ? "En revisión" : incident.status === "COMPLETADO" ? "Completado" : incident.status}
                        </span>
                        <span className="text-xs text-slate-400">· {incident.citizenName || "Anónimo"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Cómo funciona</p>
              <h3 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Tres pasos para reportar y seguir tu incidencia</h3>
            </div>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <PlusCircle className="w-6 h-6 text-blue-600" />,
                title: "1. Reporta rápido",
                description: "Describe el problema, sube una foto y envía el caso en segundos.",
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
                title: "2. Gestión clara",
                description: "Tu solicitud se asigna a la dependencia adecuada con prioridad transparente.",
              },
              {
                icon: <Search className="w-6 h-6 text-emerald-600" />,
                title: "3. Consulta el avance",
                description: "Usa tu código para verificar el estado en tiempo real cuando quieras.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 mb-5">
                  {item.icon}
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 leading-7">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Casos publicados</p>
              <h3 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Reportes destacados de la comunidad</h3>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {publishedIncidents.slice(0, 3).map((incident, i) => {
              const categoryColors: Record<string, string> = {
                VIALIDAD: "bg-amber-100 text-amber-700",
                AGUA: "bg-blue-100 text-blue-700",
                LUZ: "bg-indigo-100 text-indigo-700",
                ASEO: "bg-emerald-100 text-emerald-700",
                SEGURIDAD: "bg-red-100 text-red-700",
                OTRO: "bg-slate-100 text-slate-700",
              };
              const color = categoryColors[incident.category] || categoryColors.OTRO;
              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${color}`}>
                    {incident.category}
                  </span>
                  <h4 className="mt-6 text-xl font-semibold text-slate-900 mb-3">{incident.title}</h4>
                  <p className="text-slate-500 leading-7 line-clamp-3">{incident.description}</p>
                  <p className="mt-4 text-xs text-slate-400">{incident.location || "Sin ubicación"}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <div className="hidden md:block">
          <Baner1 />
        </div>
        <section className="mt-24 rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-8 py-14 text-white shadow-2xl shadow-slate-900/10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Beneficios para la comunidad</p>
              <h3 className="mt-4 text-3xl sm:text-4xl font-bold">Más confianza y mayor participación ciudadana.</h3>
              <p className="mt-5 text-base text-slate-200 max-w-xl leading-7">
                Tu reporte llega directo a la Alcaldía, las dependencias lo gestionan con trazabilidad y tú recibes actualizaciones claras. Es un canal moderno para que la comunidad sea parte del cambio.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "Transparencia", text: "Seguimiento visible desde el primer momento." },
                { title: "Rapidez", text: "Menos pasos para reportar y menos dudas en el proceso." },
                { title: "Accesibilidad", text: "Diseñado para cualquier ciudadano con acceso móvil." },
                { title: "Confianza", text: "Auditoría clara de cada incidencia y su estado." },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl bg-white/10 p-6 border border-white/10">
                  <div className="flex items-center gap-3 text-sky-300 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-semibold">{item.title}</p>
                  </div>
                  <p className="text-slate-200 leading-6">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} transition={{ duration: 0.7 }}>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Preguntas frecuentes</p>
              <h3 className="mt-4 text-3xl sm:text-4xl font-bold text-slate-900">Respuestas rápidas a tus dudas</h3>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {faqItems.map((item) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <h4 className="text-xl font-semibold text-slate-900 mb-3">{item.question}</h4>
                <p className="text-slate-500 leading-7">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </section>

     

        <footer className="mt-24 border-t border-slate-200 pt-10 pb-6 text-sm text-slate-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Alcaldía de Barinas. Todos los derechos reservados.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/reportar" className="hover:text-slate-900">Reportar</Link>
              <Link href="/seguimiento" className="hover:text-slate-900">Seguimiento</Link>
              <Link href="/admin" className="hover:text-slate-900">Panel administrativo</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
