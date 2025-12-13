import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const body = await req.json();
    const parsed = moduleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.courseModule.update({
      where: { id: moduleId },
      data: parsed.data,
    });
    return NextResponse.json({ module: updated });
  } catch (err) {
    console.error('Module update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    await prisma.courseModule.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Module delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

