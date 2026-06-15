"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { logoutAction } from "@/app/login/actions";

const sidebarItems = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard, href: "/admin" },
  { id: "cases", label: "Casos", icon: FileText, href: "/admin/casos" },
  { id: "employees", label: "Funcionarios", icon: Users, href: "/admin/funcionarios" },
  { id: "assignment", label: "Asignación", icon: BarChart3, href: "/admin/asignacion" },
  { id: "reports", label: "Reportes", icon: ClipboardList, href: "/admin/reportes" },
  { id: "roles", label: "Roles", icon: Shield, href: "/admin/setup" },
  { id: "settings", label: "Configuración", icon: Settings, href: "/admin/configuracion" },
];

function getActiveView(pathname: string): string {
  if (pathname === "/admin") return "overview";
  if (pathname.startsWith("/admin/casos")) return "cases";
  if (pathname.startsWith("/admin/funcionarios")) return "employees";
  if (pathname.startsWith("/admin/asignacion")) return "assignment";
  if (pathname.startsWith("/admin/reportes")) return "reports";
  if (pathname.startsWith("/admin/setup")) return "roles";
  if (pathname.startsWith("/admin/configuracion")) return "settings";
  return "overview";
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeView = getActiveView(pathname);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Array<{ id: string; type: string; title: string; message: string; timestamp: Date; read: boolean }>>([]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarContent = (
    <>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.24em]">Alcaldía</p>
                  <p className="text-lg font-bold text-slate-900">Dashboard</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors hidden md:block"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <Link key={item.id} href={item.href} onClick={() => setMobileOpen(false)}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatePresence mode="wait">
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-medium"
                >
                  Salir del Sistema
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <motion.div
        initial={false}
        animate={{ x: mobileOpen ? 0 : -280 }}
        className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl z-50 md:hidden flex flex-col"
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        {sidebarContent}
      </motion.div>

      {/* Desktop sidebar */}
      <motion.div
        initial={false}
        animate={{ width: sidebarCollapsed ? 80 : 280, transition: { duration: 0.3, ease: "easeInOut" } }}
        className="bg-white border-r border-slate-200 shadow-lg flex flex-col relative hidden md:flex"
      >
        {sidebarContent}
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {sidebarItems.find((item) => item.id === activeView)?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-slate-500">Gestión de incidencias municipales</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-slate-200">
                        <h3 className="font-semibold text-slate-900">Notificaciones</h3>
                      </div>
                      <div className="p-6 text-center text-slate-500 text-sm">
                        Sin notificaciones nuevas
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
