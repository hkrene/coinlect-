import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';

export const POST = requireAdmin(async (req: NextRequest, user) => {
  const url = new URL(req.url);
  const courseId = url.pathname.split('/')[3]; // Extract course ID from /api/courses/[id]/modules

  try {
    const body = await req.json();
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const courseModule = await prisma.courseModule.create({
      data: {
        courseId: courseId,
        title: data.title,
        content: data.content,
        order: data.order,
        durationMin: data.durationMin,
      },
    });
    return NextResponse.json({ module: courseModule }, { status: 201 });
  } catch (err) {
    console.error('Module create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

