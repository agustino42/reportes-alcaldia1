import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, category, location, citizenDni, citizenName, citizenPhone } = body;

        // Generar un código único de seguimiento de 6 caracteres alfanuméricos
        const trackerCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const incident = await prisma.incident.create({
            data: {
                title,
                description,
                category: category || "OTRO",
                location,
                trackerCode,
                citizenDni,
                citizenName,
                citizenPhone
            }
        });

        return NextResponse.json({ success: true, trackerCode: incident.trackerCode });
    } catch (error) {
        console.error("Error creating incident:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
