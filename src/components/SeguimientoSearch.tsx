"use client";

import { FormEvent, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Clock, MapPin, Tag, MessageSquare, Send, User } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  replies: Comment[];
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [citizenComment, setCitizenComment] = useState("");
  const [citizenName, setCitizenName] = useState("");
  const [posting, setPosting] = useState(false);

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
      const [incidentRes, commentsRes] = await Promise.all([
        fetch(`/api/incidents/${code}`),
        fetch(`/api/incidents/${code}/comments`),
      ]);
      const incidentData = await incidentRes.json();
      const commentsData = await commentsRes.json();

      if (incidentRes.status === 404) {
        setIncident(null);
        setComments([]);
        setStatus("not_found");
        return;
      }

      if (incidentData.success) {
        setIncident(incidentData.incident);
        setStatus("success");
      } else {
        setIncident(null);
        setComments([]);
        setStatus("error");
      }
      if (commentsData.success) {
        setComments(commentsData.comments);
      }
    } catch {
      setIncident(null);
      setComments([]);
      setStatus("error");
    }
  };

  const handlePostComment = async () => {
    if (!citizenComment.trim() || !code.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/incidents/${code}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: citizenComment.trim(),
          authorName: citizenName.trim() || "Ciudadano",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setCitizenComment("");
      }
    } catch {
      console.error("Error posting comment");
    } finally {
      setPosting(false);
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
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-100 mb-8"
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

          {/* Comments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] shadow-xl p-8 sm:p-12 border border-slate-100"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              Comentarios ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Agregar un comentario</h4>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm mb-3 transition-all"
              />
              <textarea
                value={citizenComment}
                onChange={(e) => setCitizenComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-sm resize-none transition-all"
                rows={3}
              />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={handlePostComment}
                  disabled={!citizenComment.trim() || posting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  {posting ? "Enviando..." : "Enviar comentario"}
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 && (
                <p className="text-slate-400 text-center py-8">No hay comentarios aún. ¡Sé el primero en comentar!</p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${comment.authorRole === "ADMIN" ? "bg-blue-100" : "bg-slate-100"}`}>
                    {comment.authorRole === "ADMIN" ? (
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <User className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{comment.authorName}</span>
                      {comment.authorRole === "ADMIN" && (
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">ADMIN</span>
                      )}
                      <span className="text-xs text-slate-400">• {new Date(comment.createdAt).toLocaleString("es-VE")}</span>
                    </div>
                    <p className="text-slate-600 whitespace-pre-wrap">{comment.content}</p>
                    {comment.replies.length > 0 && (
                      <div className="mt-4 ml-4 space-y-4 border-l-2 border-slate-100 pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${reply.authorRole === "ADMIN" ? "bg-blue-100" : "bg-slate-100"}`}>
                              {reply.authorRole === "ADMIN" ? (
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <User className="w-4 h-4 text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900 text-sm">{reply.authorName}</span>
                                {reply.authorRole === "ADMIN" && (
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">ADMIN</span>
                                )}
                                <span className="text-xs text-slate-400">• {new Date(reply.createdAt).toLocaleString("es-VE")}</span>
                              </div>
                              <p className="text-slate-600 text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
