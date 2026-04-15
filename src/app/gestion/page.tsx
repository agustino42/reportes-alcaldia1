"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardProvider } from "@/contexts/DashboardContext";
import DashboardLayout from "@/components/DashboardLayout";
import OverviewView from "@/components/dashboard/OverviewView";
import CasesView from "@/components/dashboard/CasesView";
import EmployeesView from "@/components/dashboard/EmployeesView";
import ReportsView from "@/components/dashboard/ReportsView";
import AssignmentView from "@/components/dashboard/AssignmentView";

function DashboardContent() {
  const pathname = usePathname();
  
  // Determinar qué vista mostrar basada en la URL
  const renderView = () => {
    if (pathname.includes('/casos')) {
      return <CasesView />;
    } else if (pathname.includes('/funcionarios')) {
      return <EmployeesView />;
    } else if (pathname.includes('/reportes')) {
      return <ReportsView />;
    } else if (pathname.includes('/asignacion')) {
      return <AssignmentView />;
    } else {
      return <OverviewView />;
    }
  };

  return (
    <DashboardLayout>
      {renderView()}
    </DashboardLayout>
  );
}

export default function GestionPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
