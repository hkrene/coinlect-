import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { courseSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { modules: { orderBy: { order: 'asc' } } },
  });
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const body = await req.json();
    const parsed = courseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const course = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : undefined,
      },
    });
    return NextResponse.json({ course });
  } catch (err) {
    console.error('Course update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Course delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

