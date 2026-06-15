"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
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
  AlertTriangle,
  Save,
  X,
  Plus,
  Send,
  Shield,
} from "lucide-react";

const VALID_STATUSES = ["RECIBIDO", "EN_REVISION", "COMPLETADO"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

const STATUS_LABELS: Record<ValidStatus, string> = {
  RECIBIDO: "Recibido",
  EN_REVISION: "En revisión",
  COMPLETADO: "Completado",
};

const STATUS_COLORS: Record<ValidStatus, string> = {
  RECIBIDO: "bg-amber-100 text-amber-700 border-amber-200",
  EN_REVISION: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETADO: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const DEPARTMENTS = [
  "Obras Públicas",
  "Mantenimiento Vial",
  "Servicios Urbanos",
  "Seguridad Ciudadana",
  "Medio Ambiente",
  "Tecnología",
];

interface Comment {
  id: string;
  content: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  replies: Comment[];
}

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string | null;
  category: string;
  status: string;
  trackerCode: string;
  citizenName: string | null;
  citizenDni: string | null;
  citizenPhone: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function getPriorityFromStatus(status: string) {
  switch (status) {
    case "RECIBIDO":
      return "Alta";
    case "EN_REVISION":
      return "Media";
    case "COMPLETADO":
      return "Baja";
    default:
      return "N/A";
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "Alta":
      return "bg-red-100 text-red-700 border-red-200";
    case "Media":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Baja":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export default function CaseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const caseId = params.id as string;
  const isEditMode = searchParams.get("edit") === "true";

  const [caseData, setCaseData] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedStatus, setEditedStatus] = useState("");
  const [editedDepartment, setEditedDepartment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const fetchCase = useCallback(async () => {
    setIsLoading(true);
    try {
      const [incidentRes, commentsRes] = await Promise.all([
        fetch(`/api/admin/incidents/${caseId}`),
        fetch(`/api/incidents/${caseId}/comments`),
      ]);
      const incidentData = await incidentRes.json();
      const commentsData = await commentsRes.json();
      if (incidentData.success) {
        setCaseData(incidentData.incident);
        setEditedStatus(incidentData.incident.status);
        setEditedDepartment(incidentData.incident.assignedDepartment || "");
      }
      if (commentsData.success) {
        setComments(commentsData.comments);
      }
    } catch {
      console.error("Error fetching case data");
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  const handleSave = async () => {
    if (!caseData) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/incidents/${caseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: editedStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setCaseData(data.incident);
        setEditedStatus(data.incident.status);
        await postComment(`Estado cambiado a ${STATUS_LABELS[data.incident.status as ValidStatus] || data.incident.status}.`);
        setIsEditing(false);
      }
    } catch {
      console.error("Error saving case");
    } finally {
      setSaving(false);
    }
  };

  const postComment = async (content?: string) => {
    const text = content ?? newComment.trim();
    if (!text) return;
    setPostingComment(true);
    try {
      const res = await fetch(`/api/incidents/${caseId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text, authorName: "Administrador" }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [data.comment, ...prev]);
        setNewComment("");
      }
    } catch {
      console.error("Error posting comment");
    } finally {
      setPostingComment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="p-6 text-center py-16">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">Caso no encontrado</h3>
        <Link href="/admin/casos" className="text-blue-600 hover:underline text-sm">
          ← Volver a Casos
        </Link>
      </div>
    );
  }

  const isValidStatus = VALID_STATUSES.includes(caseData.status as ValidStatus);
  const statusLabel = isValidStatus ? STATUS_LABELS[caseData.status as ValidStatus] : caseData.status;
  const statusColor = isValidStatus ? STATUS_COLORS[caseData.status as ValidStatus] : "bg-slate-100 text-slate-700 border-slate-200";
  const priority = getPriorityFromStatus(caseData.status);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/casos" className="text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{caseData.trackerCode}</h2>
            <p className="text-slate-500">{caseData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
              <Edit className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <>
              <button onClick={() => { setIsEditing(false); setEditedStatus(caseData.status); }} className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm font-medium">
                <X className="w-4 h-4" />
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
                <Save className="w-4 h-4" />
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Info */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getPriorityColor(priority)}`}>
                <AlertTriangle className="w-4 h-4 mr-1" />
                Prioridad: {priority}
              </span>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${statusColor}`}>
                {statusLabel}
              </span>
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
                    <span>{caseData.location || "No especificada"}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Categoría</h3>
                  <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {caseData.category}
                  </span>
                </div>
              </div>

              {isEditing && (
                <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {VALID_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                    <select
                      value={editedDepartment}
                      onChange={(e) => setEditedDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Sin asignar</option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Evidence */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Evidencia Fotográfica</h3>
            {caseData.imageUrl ? (
              <div className="rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={caseData.imageUrl}
                  alt="Evidencia del incidente"
                  className="w-full h-auto max-h-96 object-contain bg-slate-50"
                />
              </div>
            ) : (
              <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center">
                <Camera className="w-8 h-8 text-slate-400" />
                <p className="text-sm text-slate-500 ml-2">Sin imágenes cargadas</p>
              </div>
            )}
          </motion.div>

          {/* Comments Section */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Comentarios ({comments.length})
            </h3>

            <div className="space-y-4 mb-6">
              {comments.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-4">No hay comentarios aún.</p>
              )}
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${comment.authorRole === "ADMIN" ? "bg-blue-100" : "bg-slate-100"}`}>
                      {comment.authorRole === "ADMIN" ? (
                        <Shield className="w-4 h-4 text-blue-600" />
                      ) : (
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900">{comment.authorName}</span>
                        <span className="text-xs text-slate-400">• {new Date(comment.createdAt).toLocaleString("es-VE")}</span>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{comment.content}</p>
                      {comment.replies.length > 0 && (
                        <div className="mt-3 ml-4 space-y-3 border-l-2 border-slate-100 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${reply.authorRole === "ADMIN" ? "bg-blue-100" : "bg-slate-100"}`}>
                                {reply.authorRole === "ADMIN" ? (
                                  <Shield className="w-3 h-3 text-blue-600" />
                                ) : (
                                  <MessageSquare className="w-3 h-3 text-slate-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-slate-900 text-sm">{reply.authorName}</span>
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
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => postComment()}
                      disabled={!newComment.trim() || postingComment}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      {postingComment ? "Enviando..." : "Enviar"}
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
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Reportante</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{caseData.citizenName || "Anónimo"}</p>
                  <p className="text-xs text-slate-500">Ciudadano</p>
                </div>
              </div>
              {caseData.citizenDni && <p className="text-sm text-slate-600">C.I.: {caseData.citizenDni}</p>}
              {caseData.citizenPhone && <p className="text-sm text-slate-600">{caseData.citizenPhone}</p>}
            </div>
          </motion.div>

          {/* Assignment Info */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Asignación</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Departamento</p>
                <p className="text-sm text-slate-600">{editedDepartment || "Sin asignar"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Fecha de reporte</p>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(caseData.createdAt).toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Última actualización</p>
                <div className="flex items-center gap-1 text-sm text-slate-600">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(caseData.updatedAt).toLocaleDateString("es-VE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Progreso</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${caseData.status === "RECIBIDO" ? "bg-amber-600" : "bg-blue-600"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">Reporte recibido</p>
                  <p className="text-xs text-slate-500">
                    {new Date(caseData.createdAt).toLocaleDateString("es-VE")}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${caseData.status === "EN_REVISION" ? "bg-blue-600" : caseData.status === "COMPLETADO" ? "bg-emerald-600" : "bg-slate-300"}`} />
                <div>
                  <p className={`text-sm font-medium ${caseData.status === "RECIBIDO" ? "text-slate-400" : "text-slate-900"}`}>En revisión</p>
                  <p className="text-xs text-slate-400">{caseData.status === "RECIBIDO" ? "Pendiente" : "En proceso"}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${caseData.status === "COMPLETADO" ? "bg-emerald-600" : "bg-slate-300"}`} />
                <div>
                  <p className={`text-sm font-medium ${caseData.status !== "COMPLETADO" ? "text-slate-400" : "text-slate-900"}`}>Completado</p>
                  <p className="text-xs text-slate-400">{caseData.status === "COMPLETADO" ? "Resuelto" : "Próximo paso"}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
