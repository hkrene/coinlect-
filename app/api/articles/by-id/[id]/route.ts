import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';
import { PublishStatus } from '@prisma/client';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const PATCH = requireAdmin(async (req: NextRequest, _user: any, params: Promise<{ id: string }>) => {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = articleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : undefined,
      },
    });
    return NextResponse.json({ article });
  } catch (err) {
    console.error('Article update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (req: NextRequest, _user: any, params: Promise<{ id: string }>) => {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Article delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});