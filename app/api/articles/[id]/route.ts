import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/lib/validators';
import { getAuthUser, requireAdmin } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await getAuthUser(req);
  const article = await prisma.article.findUnique({
    where: { id },
    include: { author: true }
  });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only show published articles to non-admin users
  if (auth?.role !== UserRole.ADMIN && article.status !== PublishStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export const PATCH = requireAdmin(async (req: NextRequest, user) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

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

export const DELETE = requireAdmin(async (req: NextRequest, user) => {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Article delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

