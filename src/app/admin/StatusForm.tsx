"use client";

import { useTransition } from "react";
import { updateIncidentStatus } from "./actions";

export function StatusForm({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex items-center justify-center gap-2">
            <select
                disabled={isPending}
                value={currentStatus}
                onChange={(e) => {
                    const val = e.target.value;
                    startTransition(async () => {
                        await updateIncidentStatus(id, val);
                    });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide outline-none border-2 cursor-pointer transition-all
          ${currentStatus === 'RECIBIDO' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : ''}
          ${currentStatus === 'EN_REVISION' ? 'bg-blue-50 text-blue-800 border-blue-200' : ''}
          ${currentStatus === 'COMPLETADO' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : ''}
          disabled:opacity-50 hover:shadow-sm`}
            >
                <option value="RECIBIDO">Recibido</option>
                <option value="EN_REVISION">En Revisión</option>
                <option value="COMPLETADO">Completado</option>
            </select>
        </div>
    );
}
