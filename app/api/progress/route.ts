import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { progressSchema } from '@/lib/validators';
import { getAuthContext, unauthorized } from '@/lib/api';

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const parsed = progressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { courseId, moduleId, completed, progressPct } = parsed.data;
    const progress = await prisma.progress.upsert({
      where: { userId_moduleId: { userId: auth.userId, moduleId } },
      update: {
        completed,
        progressPct: progressPct ?? (completed ? 100 : 0),
        lastActivity: new Date(),
      },
      create: {
        userId: auth.userId,
        courseId,
        moduleId,
        completed,
        progressPct: progressPct ?? (completed ? 100 : 0),
        lastActivity: new Date(),
      },
    });

    await prisma.user.update({
      where: { id: auth.userId },
      data: { lastActivityAt: new Date() },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error('Progress error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

