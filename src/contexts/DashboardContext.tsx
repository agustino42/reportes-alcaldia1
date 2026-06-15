"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface DashboardStats {
  totalCases: number;
  resolvedCases: number;
  activeCases: number;
  pendingCases: number;
  inReviewCases: number;
  avgResolutionTime: number;
  satisfactionRate: number;
  efficiencyRate: number;
}

interface RecentCase {
  id: string;
  title: string;
  location: string;
  status: string;
  priority: string;
  reportedDate: string;
  reportedTime: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DashboardContextType {
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  stats: DashboardStats | null;
  recentCases: RecentCase[];
  notifications: Notification[];
  isConnected: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<RecentCase[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Incident' },
        (payload) => {
          const newIncident = payload.new as Record<string, unknown>
          setStats(prev => prev ? {
            ...prev,
            totalCases: prev.totalCases + 1,
            pendingCases: prev.pendingCases + 1,
          } : prev)

          const newCase: RecentCase = {
            id: newIncident.trackerCode as string,
            title: newIncident.title as string,
            location: (newIncident.location as string) || '',
            status: newIncident.status as string,
            priority: newIncident.status === 'RECIBIDO' ? 'Alta' : 'Media',
            reportedDate: new Date(newIncident.createdAt as string).toISOString().split('T')[0],
            reportedTime: new Date(newIncident.createdAt as string).toLocaleTimeString('es-VE', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }

          setRecentCases(prev => [newCase, ...prev.slice(0, 9)])

          addNotification({
            type: 'info',
            title: 'Nuevo Reporte',
            message: `Se ha recibido un nuevo reporte: ${newIncident.title}`,
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Incident' },
        (payload) => {
          const updated = payload.new as Record<string, unknown>
          const old = payload.old as Record<string, unknown>

          if (updated.status !== old.status) {
            setStats(prev => {
              if (!prev) return prev
              const next = { ...prev }

              const statusMap: Record<string, keyof DashboardStats> = {
                RECIBIDO: 'pendingCases',
                EN_REVISION: 'inReviewCases',
                COMPLETADO: 'resolvedCases',
              }

              const oldKey = statusMap[old.status as string]
              const newKey = statusMap[updated.status as string]

              if (oldKey) next[oldKey] = Math.max(0, (next[oldKey] as number) - 1)
              if (newKey) next[newKey] = (next[newKey] as number) + 1

              return next
            })

            setRecentCases(prev =>
              prev.map(c =>
                c.id === updated.trackerCode ? { ...c, status: updated.status as string } : c
              )
            )

            addNotification({
              type: 'success',
              title: 'Caso Actualizado',
              message: `El caso ${updated.trackerCode} cambió a ${updated.status}`,
            })
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [statsResponse, casesResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/recent-cases')
        ]);

        const statsData = await statsResponse.json();
        const casesData = await casesResponse.json();

        if (statsData.success) {
          setStats(statsData.stats);
        }

        if (casesData.success) {
          setRecentCases(casesData.cases);
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value: DashboardContextType = {
    activeView,
    setActiveView,
    sidebarCollapsed,
    setSidebarCollapsed,
    stats,
    recentCases,
    notifications,
    isConnected,
    addNotification,
    markNotificationAsRead,
    clearNotifications,
    loading,
    setLoading
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
