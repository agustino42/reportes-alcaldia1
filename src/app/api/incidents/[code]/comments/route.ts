import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const trackerCode = code.toUpperCase();

    const incident = await prisma.incident.findUnique({
      where: { trackerCode },
      select: { id: true },
    });

    if (!incident) {
      return NextResponse.json({ success: false, error: "No encontrado" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { incidentId: incident.id, parentId: null },
      include: {
        user: { select: { name: true, role: true } },
        replies: {
          include: {
            user: { select: { name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = comments.map((c) => ({
      id: c.id,
      content: c.content,
      authorName: c.user?.name ?? c.authorName ?? "Anónimo",
      authorRole: c.user?.role ?? "CITIZEN",
      createdAt: c.createdAt,
      replies: c.replies.map((r) => ({
        id: r.id,
        content: r.content,
        authorName: r.user?.name ?? r.authorName ?? "Anónimo",
        authorRole: r.user?.role ?? "CITIZEN",
        createdAt: r.createdAt,
      })),
    }));

    return NextResponse.json({ success: true, comments: formatted });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const trackerCode = code.toUpperCase();
    const { content, authorName, parentId } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ success: false, error: "El comentario no puede estar vacío" }, { status: 400 });
    }

    const incident = await prisma.incident.findUnique({
      where: { trackerCode },
      select: { id: true },
    });

    if (!incident) {
      return NextResponse.json({ success: false, error: "No encontrado" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        incidentId: incident.id,
        authorName: authorName?.trim() || null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        authorName: comment.authorName ?? "Anónimo",
        authorRole: "CITIZEN",
        createdAt: comment.createdAt,
        replies: [],
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json({ success: false, error: "Error de servidor" }, { status: 500 });
  }
}
