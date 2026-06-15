"use client";

import { useActionState } from 'react';
import { loginAction } from './actions';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const initialState = { error: '' };

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(loginAction, initialState);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white p-8 sm:p-12 rounded-[2rem] shadow-xl border border-slate-100"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Acceso Administrativo</h1>
                <p className="text-center text-slate-500 mb-8">Gestión Pública de la Alcaldía de Barinas</p>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Usuario</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="Email o admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <p className="text-sm font-medium text-red-500 text-center bg-red-50 p-3 rounded-lg">
                            {state.error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isPending ? "Verificando..." : "Ingresar al Panel"} <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 text-center border-t pt-6">
                    <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        &larr; Volver al Portal Ciudadano
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
