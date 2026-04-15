import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { logoutAction } from '@/app/login/actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 font-bold">AB</div>
                    <h2 className="text-lg font-bold tracking-tight">Alcaldía Admin</h2>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20">
                        <LayoutDashboard className="w-5 h-5" /> Panel Principal
                    </Link>
                    <Link href="/gestion" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <FileText className="w-5 h-5" /> Gestión de Casos
                    </Link>
                    <Link href="/gestion/funcionarios" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Users className="w-5 h-5" /> Funcionarios
                    </Link>
                    <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <Settings className="w-5 h-5" /> Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={logoutAction}>
                        <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors text-left">
                            <LogOut className="w-5 h-5" /> Salir del Sistema
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 md:px-12 sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-slate-800">Panel de Gestión de Servicios Públicos</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-600">Alcalde / Despacho</span>
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold border-2 border-white shadow-sm">
                            AD
                        </div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
