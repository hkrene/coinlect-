import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  const includeDrafts = auth && (auth.role === UserRole.ADMIN || auth.role === UserRole.EDITOR);
  const articles = await prisma.article.findMany({
    where: includeDrafts ? {} : { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const body = await req.json();
    const parsed = articleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        tags: data.tags,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status ?? PublishStatus.DRAFT,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
        authorId: auth.userId,
      },
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    console.error('Article create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

