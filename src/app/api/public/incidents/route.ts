import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: 'desc' },
      take: 10,
    });

    const data = incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      description: incident.description,
      location: incident.location,
      category: incident.category,
      status: incident.status,
      trackerCode: incident.trackerCode,
      imageUrl: incident.imageUrl,
      citizenName: incident.citizenName,
      publishedAt: incident.publishedAt?.toISOString(),
      createdAt: incident.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, incidents: data });
  } catch (error) {
    console.error("Error fetching published incidents:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener publicaciones" },
      { status: 500 }
    );
  }
}
