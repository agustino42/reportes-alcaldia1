import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
    try {
        const { code } = await params;
        const trackerCode = code.toUpperCase();

        const incident = await prisma.incident.findUnique({
            where: { trackerCode },
            select: {
                title: true,
                description: true,
                status: true,
                category: true,
                createdAt: true,
                location: true
            }
        });

        if (!incident) {
            return NextResponse.json({ success: false, error: "No encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, incident });
    } catch (error) {
        console.error("Error fetching incident:", error);
        return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 });
    }
}
