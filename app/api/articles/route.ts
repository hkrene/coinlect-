import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { articleSchema } from '@/lib/validators';
import { getAuthUser, requireAdmin } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  const includeDrafts = auth?.role === UserRole.ADMIN;
  const url = new URL(req.url);
  const featured = url.searchParams.get('featured');

  const where: any = {};
  if (!includeDrafts) {
    where.status = PublishStatus.PUBLISHED;
  }
  if (featured === 'true') {
    where.featured = true;
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  return NextResponse.json({ articles });
}

export const POST = requireAdmin(async (req: NextRequest, user) => {

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
        featured: data.featured ?? false,
        image: data.image,
        authorImage: data.authorImage,
        keyTakeaways: data.keyTakeaways,
        authorName: data.authorName,
        authorId: user.id,
      },
    });
    return NextResponse.json({ article }, { status: 201 });
  } catch (err) {
    console.error('Article create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

