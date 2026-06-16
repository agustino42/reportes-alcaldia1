"use client";

import { useTransition } from "react";
import { Globe, GlobeOff } from "lucide-react";
import { togglePublishIncident } from "./actions";

export function PublishToggle({ id, publishedAt }: { id: string; publishedAt: string | null }) {
    const [isPending, startTransition] = useTransition();
    const isPublished = publishedAt !== null;

    return (
        <button
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    await togglePublishIncident(id);
                });
            }}
            title={isPublished ? "Quitar del frontend" : "Publicar en frontend"}
            className={`p-1.5 rounded-lg transition-colors ${
                isPublished
                    ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            } disabled:opacity-50`}
        >
            {isPublished ? <Globe className="w-4 h-4" /> : <GlobeOff className="w-4 h-4" />}
        </button>
    );
}
