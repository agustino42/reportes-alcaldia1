"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '@/contexts/DashboardContext';
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
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const sidebarItems = [
  {
    id: 'overview',
    label: 'Resumen',
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: '/gestion'
  },
  {
    id: 'cases',
    label: 'Casos',
    icon: <FileText className="w-5 h-5" />,
    href: '/gestion/casos'
  },
  {
    id: 'employees',
    label: 'Funcionarios',
    icon: <Users className="w-5 h-5" />,
    href: '/gestion/funcionarios'
  },
  {
    id: 'reports',
    label: 'Reportes',
    icon: <ClipboardList className="w-5 h-5" />,
    href: '/gestion/reportes'
  },
  {
    id: 'assignment',
    label: 'Asignación',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/gestion/asignacion'
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: <Settings className="w-5 h-5" />,
    href: '/gestion/settings'
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { 
    activeView, 
    setActiveView, 
    sidebarCollapsed, 
    setSidebarCollapsed,
    notifications,
    isConnected,
    markNotificationAsRead,
    clearNotifications
  } = useDashboard();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Detectar la vista actual basada en la URL
    const path = window.location.pathname;
    const currentView = sidebarItems.find(item => path.includes(item.href))?.id || 'overview';
    setActiveView(currentView);
  }, [setActiveView]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex">
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          width: sidebarCollapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className="bg-white border-r border-slate-200 shadow-lg flex flex-col relative"
      >
        {/* Header del Sidebar */}
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
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link key={item.id} href={item.href}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeView === item.id
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
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
          ))}
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                <Users className="w-5 h-5 text-slate-600" />
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
            </div>
            <AnimatePresence mode="wait">
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1"
                >
                  <p className="text-sm font-medium text-slate-900">Administrador</p>
                  <p className="text-xs text-slate-500">
                    {isConnected ? 'Conectado' : 'Desconectado'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors md:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {sidebarItems.find(item => item.id === activeView)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-slate-500">
                  Gestión de incidencias municipales
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Estado de conexión */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100">
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs font-medium text-slate-600">
                  {isConnected ? 'En línea' : 'Desconectado'}
                </span>
              </div>

              {/* Notificaciones */}
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

                {/* Dropdown de notificaciones */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50"
                    >
                      <div className="p-4 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-slate-900">Notificaciones</h3>
                          <button
                            onClick={clearNotifications}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-slate-500">
                            No hay notificaciones
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  notification.type === 'success' ? 'bg-green-500' :
                                  notification.type === 'warning' ? 'bg-amber-500' :
                                  notification.type === 'error' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`} />
                                <div className="flex-1">
                                  <p className="font-medium text-slate-900 text-sm">
                                    {notification.title}
                                  </p>
                                  <p className="text-slate-600 text-sm mt-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-slate-400 mt-2">
                                    {new Date(notification.timestamp).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Perfil */}
              <Link href="/admin" className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
