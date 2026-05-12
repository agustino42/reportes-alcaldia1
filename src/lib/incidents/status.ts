export const INCIDENT_STATUS = {
  RECIBIDO: "RECIBIDO",
  EN_REVISION: "EN_REVISION",
  COMPLETADO: "COMPLETADO",
} as const;

export type IncidentStatus = (typeof INCIDENT_STATUS)[keyof typeof INCIDENT_STATUS];

const STATUS_ALIAS_MAP: Record<string, IncidentStatus> = {
  RECIBIDO: INCIDENT_STATUS.RECIBIDO,
  PENDIENTE: INCIDENT_STATUS.RECIBIDO,
  EN_REVISION: INCIDENT_STATUS.EN_REVISION,
  EN_REVISIÓN: INCIDENT_STATUS.EN_REVISION,
  ASIGNADO: INCIDENT_STATUS.EN_REVISION,
  EN_PROCESO: INCIDENT_STATUS.EN_REVISION,
  COMPLETADO: INCIDENT_STATUS.COMPLETADO,
  RESUELTO: INCIDENT_STATUS.COMPLETADO,
  CERRADO: INCIDENT_STATUS.COMPLETADO,
};

const STORAGE_STATUS_ALIASES: Record<IncidentStatus, string[]> = {
  [INCIDENT_STATUS.RECIBIDO]: ["RECIBIDO", "PENDIENTE"],
  [INCIDENT_STATUS.EN_REVISION]: ["EN_REVISION", "ASIGNADO", "EN_PROCESO"],
  [INCIDENT_STATUS.COMPLETADO]: ["COMPLETADO", "RESUELTO", "CERRADO"],
};

export const INCIDENT_ACTIVE_STATUSES = [
  ...STORAGE_STATUS_ALIASES[INCIDENT_STATUS.RECIBIDO],
  ...STORAGE_STATUS_ALIASES[INCIDENT_STATUS.EN_REVISION],
] as const;

export const INCIDENT_COMPLETED_STATUSES = STORAGE_STATUS_ALIASES[INCIDENT_STATUS.COMPLETADO];
export const INCIDENT_RECEIVED_STATUSES = STORAGE_STATUS_ALIASES[INCIDENT_STATUS.RECIBIDO];
export const INCIDENT_IN_REVIEW_STATUSES = STORAGE_STATUS_ALIASES[INCIDENT_STATUS.EN_REVISION];

function normalizeStatusKey(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "_");
}

export function normalizeIncidentStatus(value: string | null | undefined): IncidentStatus | null {
  if (!value) {
    return null;
  }

  const normalized = normalizeStatusKey(value);
  return STATUS_ALIAS_MAP[normalized] ?? null;
}

export function getStorageStatusesForFilter(value: string | null | undefined): string[] | null {
  const normalized = normalizeIncidentStatus(value);
  if (!normalized) {
    return null;
  }

  return STORAGE_STATUS_ALIASES[normalized];
}

export function getIncidentStatusLabel(value: string | null | undefined): string {
  const normalized = normalizeIncidentStatus(value);
  switch (normalized) {
    case INCIDENT_STATUS.RECIBIDO:
      return "Recibido";
    case INCIDENT_STATUS.EN_REVISION:
      return "En revisión";
    case INCIDENT_STATUS.COMPLETADO:
      return "Completado";
    default:
      return "Sin estado";
  }
}

export function getIncidentStatusBadgeClasses(value: string | null | undefined): string {
  const normalized = normalizeIncidentStatus(value);
  switch (normalized) {
    case INCIDENT_STATUS.RECIBIDO:
      return "bg-amber-100 text-amber-700 border-amber-200";
    case INCIDENT_STATUS.EN_REVISION:
      return "bg-blue-100 text-blue-700 border-blue-200";
    case INCIDENT_STATUS.COMPLETADO:
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
}

export function getIncidentPriorityFromStatus(value: string | null | undefined): "Alta" | "Media" | "Baja" {
  const normalized = normalizeIncidentStatus(value);
  switch (normalized) {
    case INCIDENT_STATUS.RECIBIDO:
      return "Alta";
    case INCIDENT_STATUS.EN_REVISION:
      return "Media";
    case INCIDENT_STATUS.COMPLETADO:
      return "Baja";
    default:
      return "Media";
  }
}

export function getEstimatedResolutionForStatus(value: string | null | undefined): string {
  const normalized = normalizeIncidentStatus(value);
  const date = new Date();

  switch (normalized) {
    case INCIDENT_STATUS.RECIBIDO:
      date.setDate(date.getDate() + 7);
      return date.toISOString().split("T")[0];
    case INCIDENT_STATUS.EN_REVISION:
      date.setDate(date.getDate() + 3);
      return date.toISOString().split("T")[0];
    case INCIDENT_STATUS.COMPLETADO:
      return "Completado";
    default:
      date.setDate(date.getDate() + 5);
      return date.toISOString().split("T")[0];
  }
}
