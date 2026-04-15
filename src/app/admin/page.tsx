import { prisma } from '@/lib/db';
import { AlertCircle, RefreshCw, CheckCircle2, Layers } from 'lucide-react';
import { StatusForm } from './StatusForm';

export default async function AdminDashboard() {
    const incidents = await prisma.incident.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const total = incidents.length;
    const pendientes = incidents.filter(i => i.status === 'RECIBIDO').length;
    const enProceso = incidents.filter(i => i.status === 'EN_REVISION').length;
    const resueltos = incidents.filter(i => i.status === 'COMPLETADO').length;

    return (
        <div className="space-y-8">
            {/* Stats Cards - Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Casos</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{total}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                        <Layers className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Por Atender</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{pendientes}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">En Revisión</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{enProceso}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Completados</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-1">{resueltos}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Table Area - Gestión Estratégica */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Listado de Requerimientos ({total})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Trazabilidad</th>
                                <th className="px-6 py-4">Novedad Registrada</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Ciudadano</th>
                                <th className="px-6 py-4 text-center">Acciones / Modificar Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {incidents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                        No hay solicitudes registradas aún. Cuando los ciudadanos reporten, aparecerán aquí.
                                    </td>
                                </tr>
                            ) : incidents.map(incident => (
                                <tr key={incident.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-bold text-slate-700 tracking-wider">
                                            {incident.trackerCode}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{incident.title}</p>
                                        <p className="text-sm text-slate-500 mt-1 truncate max-w-[250px]">{incident.category} • {incident.location}</p>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap font-medium">
                                        {incident.createdAt.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-800">{incident.citizenName || 'Anónimo'}</p>
                                        {incident.citizenDni && <p className="text-xs text-slate-500">{incident.citizenDni}</p>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusForm id={incident.id} currentStatus={incident.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
