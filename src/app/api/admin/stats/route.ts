import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    // Estadísticas generales
    const [
      totalIncidents,
      resolvedIncidents,
      activeIncidents,
      receivedIncidents,
      inReviewIncidents
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: 'COMPLETADO' } }),
      prisma.incident.count({ 
        where: { 
          status: { 
            in: ['RECIBIDO', 'EN_REVISION'] 
          } 
        } 
      }),
      prisma.incident.count({ where: { status: 'RECIBIDO' } }),
      prisma.incident.count({ where: { status: 'EN_REVISION' } })
    ]);

    // Incidentes por categoría
    const incidentsByCategory = await prisma.incident.groupBy({
      by: ['category'],
      _count: {
        category: true
      }
    });

    // Incidentes de los últimos 30 días
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentIncidents = await prisma.incident.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calcular tiempo promedio de resolución
    const resolvedIncidentsWithTime = await prisma.incident.findMany({
      where: { status: 'COMPLETADO' },
      select: {
        createdAt: true,
        updatedAt: true
      }
    });

    const avgResolutionTime = resolvedIncidentsWithTime.length > 0 
      ? resolvedIncidentsWithTime.reduce((acc, incident) => {
          const days = Math.ceil(
            (incident.updatedAt.getTime() - incident.createdAt.getTime()) / (1000 * 60 * 60 * 24)
          );
          return acc + days;
        }, 0) / resolvedIncidentsWithTime.length
      : 0;

    // Tendencia mensual (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await prisma.incident.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      },
      _count: {
        id: true
      }
    });

    // Procesar datos para el frontend
    const stats = {
      totalCases: totalIncidents,
      resolvedCases: resolvedIncidents,
      activeCases: activeIncidents,
      pendingCases: receivedIncidents,
      inReviewCases: inReviewIncidents,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
      satisfactionRate: 87.3, // Placeholder - necesitarías encuestas reales
      efficiencyRate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0
    };

    const categories = incidentsByCategory.map(item => ({
      name: item.category,
      cases: item._count.category,
      percentage: Math.round((item._count.category / totalIncidents) * 100)
    }));

    // Transformar tendencia mensual
    const monthlyData = processMonthlyTrend(monthlyTrend);

    return NextResponse.json({
      success: true,
      stats,
      categories: categories || [],
      monthlyTrend: monthlyData || [],
      recentIncidents: (recentIncidents || []).slice(0, 10) // Últimos 10 incidentes
    });

  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener las estadísticas" 
    }, { status: 500 });
  }
}

function processMonthlyTrend(trendData: any[]): any[] {
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const monthlyCount: { [key: string]: number } = {};
  
  // Inicializar los últimos 6 meses
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyCount[key] = 0;
  }
  
  // Contar incidentes por mes
  trendData.forEach(item => {
    const date = new Date(item.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyCount.hasOwnProperty(key)) {
      monthlyCount[key] += item._count.id;
    }
  });
  
  // Convertir al formato esperado
  return Object.entries(monthlyCount).map(([key, count]) => {
    const [year, month] = key.split('-');
    return {
      month: monthNames[parseInt(month) - 1],
      cases: count,
      resolved: Math.round(count * 0.85), // Estimación - necesitarías datos reales
      pending: Math.round(count * 0.15)
    };
  });
}
