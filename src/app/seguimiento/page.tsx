"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SeguimientoSearch from "../../components/SeguimientoSearch";

export default function SeguimientoPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 font-sans">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Volver al Inicio
                </Link>

                <SeguimientoSearch />
            </div>
        </div>
    );
}
