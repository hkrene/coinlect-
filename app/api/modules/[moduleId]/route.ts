import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';

export const PATCH = requireAdmin(async (req: NextRequest, user, moduleId?: string) => {
  if (!moduleId) return NextResponse.json({ error: 'Module ID required' }, { status: 400 });

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
});

export const DELETE = requireAdmin(async (req: NextRequest, user, moduleId?: string) => {
  if (!moduleId) return NextResponse.json({ error: 'Module ID required' }, { status: 400 });

  try {
    await prisma.courseModule.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Module delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

