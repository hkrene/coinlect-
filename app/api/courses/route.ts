import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { courseSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  const includeDrafts = auth && (auth.role === UserRole.ADMIN || auth.role === UserRole.EDITOR);
  const courses = await prisma.course.findMany({
    where: includeDrafts ? {} : { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (![UserRole.ADMIN, UserRole.EDITOR].includes(auth.role)) return forbidden();

  try {
    const body = await req.json();
    const parsed = courseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status ?? PublishStatus.DRAFT,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
        authorId: auth.userId,
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('Course create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

