import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (![UserRole.ADMIN, UserRole.EDITOR].includes(auth.role)) return forbidden();

  try {
    const body = await req.json();
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const module = await prisma.courseModule.create({
      data: {
        courseId: params.id,
        title: data.title,
        content: data.content,
        order: data.order,
        durationMin: data.durationMin,
      },
    });
    return NextResponse.json({ module }, { status: 201 });
  } catch (err) {
    console.error('Module create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

