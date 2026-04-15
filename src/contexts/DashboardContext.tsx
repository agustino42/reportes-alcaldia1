"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

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
  // Estado del dashboard
  activeView: string;
  setActiveView: (view: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Datos en tiempo real
  stats: DashboardStats | null;
  recentCases: RecentCase[];
  notifications: Notification[];
  
  // Conexión WebSocket
  isConnected: boolean;
  
  // Acciones
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading states
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
  const [socket, setSocket] = useState<Socket | null>(null);

  // Inicializar conexión WebSocket
  useEffect(() => {
    const newSocket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Conectado al dashboard en tiempo real');
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Desconectado del dashboard');
    });
    
    // Escuchar actualizaciones en tiempo real
    newSocket.on('new_report', (data) => {
      setStats(prev => prev ? {
        ...prev,
        totalCases: prev.totalCases + 1,
        pendingCases: prev.pendingCases + 1
      } : null);
      
      setRecentCases(prev => [data, ...prev.slice(0, 9)]);
      
      addNotification({
        type: 'info',
        title: 'Nuevo Reporte',
        message: `Se ha recibido un nuevo reporte: ${data.title}`
      });
    });
    
    newSocket.on('case_status_update', (data) => {
      setStats(prev => {
        if (!prev) return null;
        
        const updatedStats = { ...prev };
        
        // Actualizar contadores según el cambio de estado
        if (data.oldStatus === 'pending') {
          updatedStats.pendingCases--;
        } else if (data.oldStatus === 'active') {
          updatedStats.activeCases--;
        } else if (data.oldStatus === 'in_review') {
          updatedStats.inReviewCases--;
        }
        
        if (data.newStatus === 'pending') {
          updatedStats.pendingCases++;
        } else if (data.newStatus === 'active') {
          updatedStats.activeCases++;
        } else if (data.newStatus === 'in_review') {
          updatedStats.inReviewCases++;
        } else if (data.newStatus === 'resolved') {
          updatedStats.resolvedCases++;
        }
        
        return updatedStats;
      });
      
      // Actualizar caso en la lista de recientes
      setRecentCases(prev => prev.map(case_ => 
        case_.id === data.caseId 
          ? { ...case_, status: data.newStatus }
          : case_
      ));
      
      addNotification({
        type: 'success',
        title: 'Caso Actualizado',
        message: `El caso ${data.caseId} ha cambiado a ${data.newStatus}`
      });
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

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
