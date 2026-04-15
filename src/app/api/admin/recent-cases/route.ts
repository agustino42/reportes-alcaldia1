import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recentCases = await prisma.incident.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        location: true,
        status: true,
        category: true,
        createdAt: true,
        description: true
      }
    });

    const formattedCases = recentCases.map(case_ => ({
      id: case_.id,
      title: case_.title,
      location: case_.location || 'No especificada',
      status: case_.status === 'RECIBIDO' ? 'Pendiente' :
             case_.status === 'EN_REVISION' ? 'En revisión' :
             case_.status === 'COMPLETADO' ? 'Resuelto' : case_.status,
      priority: 'Media', // Valor por defecto ya que no existe en el esquema
      category: case_.category,
      reportedDate: case_.createdAt.toLocaleDateString('es-VE'),
      reportedTime: case_.createdAt.toLocaleTimeString('es-VE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      description: case_.description
    }));

    return NextResponse.json({
      success: true,
      cases: formattedCases
    });

  } catch (error) {
    console.error("Error fetching recent cases:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener casos recientes" 
    }, { status: 500 });
  }
}
