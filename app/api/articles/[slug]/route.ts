import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/lib/validators';
import { getAuthUser, requireAdmin, requireAdminSlug } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params;
  const auth = await getAuthUser(req);
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: true
    },
  });
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only show published articles to non-admin users
  if (auth?.role !== UserRole.ADMIN && article.status !== PublishStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ article });
}

export const PATCH = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = articleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const article = await prisma.article.update({
      where: { slug },
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

export const DELETE = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    await prisma.article.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Article delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

