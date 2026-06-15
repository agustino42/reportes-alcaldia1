import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const incident = await prisma.incident.findUnique({
      where: { trackerCode: id },
    });

    if (!incident) {
      return NextResponse.json({ success: false, error: "Incidente no encontrado" }, { status: 404 });
    }

    // Transformar al formato esperado por el frontend
    const transformedIncident = {
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
      reportedEmail: null,
      reportedDate: incident.createdAt.toISOString().split('T')[0],
      reportedTime: incident.createdAt.toLocaleTimeString('es-VE', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      assignedTo: 'No asignado',
      assignedDepartment: 'Por definir',
      estimatedResolution: getEstimatedResolution(incident.status),
      images: [],
      tags: getCategoryTags(incident.category),
      coordinates: null,
      citizenDni: incident.citizenDni,
      citizenName: incident.citizenName,
      citizenPhone: incident.citizenPhone,
      imageUrl: incident.imageUrl,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
    };

    return NextResponse.json({ success: true, incident: transformedIncident });

  } catch (error) {
    console.error("Error fetching incident:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al obtener el incidente" 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, assignedDepartment, assignedTo, notes } = body;

    const updatedIncident = await prisma.incident.update({
      where: { trackerCode: id },
      data: {
        status: status,
        updatedAt: new Date()
      }
    });

    // Aquí podrías guardar el historial de cambios si tuvieras una tabla para eso
    if (notes) {
      console.log(`Notas para incidente ${id}: ${notes}`);
    }

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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await prisma.incident.delete({
      where: { trackerCode: id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Incidente eliminado correctamente" 
    });

  } catch (error) {
    console.error("Error deleting incident:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Error al eliminar el incidente" 
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
