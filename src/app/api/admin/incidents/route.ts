import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (status && status !== 'todos') {
      where.status = status;
    }
    
    if (category && category !== 'todos') {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { citizenName: { contains: search, mode: 'insensitive' } },
        { trackerCode: { contains: search, mode: 'insensitive' } }
      ];
    }

    const incidents = await prisma.incident.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        // Si necesitas incluir relaciones futuras, agrégalas aquí
      }
    });

    // Transformar los datos para que coincidan con el formato esperado
    const transformedIncidents = incidents.map(incident => ({
      id: incident.trackerCode,
      uuid: incident.id,
      title: incident.title,
      description: incident.description,
      location: incident.location || 'No especificada',
      category: incident.category,
      status: incident.status,
      priority: getPriorityFromStatus(incident.status),
      reportedBy: incident.citizenName || 'Anónimo',
      reportedPhone: incident.citizenPhone || 'No proporcionado',
      reportedEmail: null, // No hay campo email en el schema actual
      reportedDate: incident.createdAt.toISOString().split('T')[0],
      reportedTime: incident.createdAt.toLocaleTimeString('es-VE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      assignedTo: 'No asignado',
      assignedDepartment: 'Por definir',
      estimatedResolution: getEstimatedResolution(incident.status),
      images: [], // No hay campo images en el schema actual
      tags: getCategoryTags(incident.category),
      coordinates: null, // No hay campo coordinates en el schema actual
    }));

    return NextResponse.json({ 
      success: true, 
      incidents: transformedIncidents || [],
      total: transformedIncidents?.length || 0
    });

  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener los incidentes" 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, assignedDepartment, assignedTo } = body;

    const updatedIncident = await prisma.incident.update({
      where: { trackerCode: id },
      data: {
        status: status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      incident: updatedIncident 
    });

  } catch (error) {
    console.error("Error updating incident:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al actualizar el incidente" 
    }, { status: 500 });
  }
}

// Funciones auxiliares
function getPriorityFromStatus(status: string): string {
  switch (status) {
    case 'RECIBIDO': return 'Alta';
    case 'EN_REVISION': return 'Media';
    case 'COMPLETADO': return 'Baja';
    default: return 'Media';
  }
}

function getEstimatedResolution(status: string): string {
  const date = new Date();
  switch (status) {
    case 'RECIBIDO':
      date.setDate(date.getDate() + 7);
      break;
    case 'EN_REVISION':
      date.setDate(date.getDate() + 3);
      break;
    case 'COMPLETADO':
      return 'Completado';
    default:
      date.setDate(date.getDate() + 5);
  }
  return date.toISOString().split('T')[0];
}

function getCategoryTags(category: string): string[] {
  const tagMap: { [key: string]: string[] } = {
    'VIALIDAD': ['vialidad', 'infraestructura', 'seguridad'],
    'AGUA': ['servicios', 'agua', 'infraestructura'],
    'LUZ': ['alumbrado', 'seguridad', 'servicios'],
    'ASEO': ['limpieza', 'salud', 'medio ambiente'],
    'OTRO': ['general']
  };
  return tagMap[category] || ['general'];
}
