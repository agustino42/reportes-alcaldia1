"use client"

import { useActionState } from 'react'
import { setUserRole } from './actions'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const initialState: { success?: boolean; message?: string; error?: string } = {}

export default function SetupPage() {
  const [state, formAction, isPending] = useActionState(setUserRole, initialState)

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver al dashboard
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Configuración de Roles</h2>
            <p className="text-sm text-slate-500">Asigna roles a los usuarios de Supabase Auth</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-amber-800 font-medium">Importante:</p>
          <p className="text-sm text-amber-700 mt-1">
            Primero debes crear los usuarios en Supabase Dashboard (Authentication → Users).
            Luego asigna su rol aquí.
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email del usuario</label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@barinas.gob.ve"
              className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
            <select
              name="role"
              required
              className="text-black w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 bg-white"
            >
              <option value="citizen">Ciudadano</option>
              <option value="technician">Técnico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {state?.error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{state.error}</p>
          )}

          {state?.success && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-70"
          >
            {isPending ? 'Asignando...' : 'Asignar Rol'}
          </button>
        </form>
      </div>
    </div>
  )
}
