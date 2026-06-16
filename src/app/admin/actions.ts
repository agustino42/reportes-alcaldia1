"use server"

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateIncidentStatus(id: string, newStatus: string) {
    try {
        await prisma.incident.update({
            where: { id },
            data: { status: newStatus }
        });

        // Forzar actualización de cache de Next.js para que las métricas se actualicen instantáneamente
        revalidatePath('/admin');
        revalidatePath('/seguimiento');
    } catch (error) {
        console.error("Error updating status: ", error);
    }
}

export async function togglePublishIncident(id: string) {
    try {
        const incident = await prisma.incident.findUnique({ where: { id } });
        if (!incident) return;

        const isPublished = incident.publishedAt !== null;

        await prisma.incident.update({
            where: { id },
            data: { publishedAt: isPublished ? null : new Date() }
        });

        revalidatePath('/admin');
        revalidatePath('/admin/casos');
        revalidatePath('/');
    } catch (error) {
        console.error("Error toggling publish: ", error);
    }
}
