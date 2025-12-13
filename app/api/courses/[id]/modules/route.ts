import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const courseModule = await prisma.courseModule.create({
      data: {
        courseId: id,
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
}

