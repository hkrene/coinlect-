import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { courseSchema } from '@/lib/validators';
import { getAuthUser, requireAuth, requireAdmin } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  const includeDrafts = auth?.role === UserRole.ADMIN;
  const courses = await prisma.course.findMany({
    where: includeDrafts ? {} : { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  return NextResponse.json({ courses });
}

export const POST = requireAdmin(async (req: NextRequest, user) => {

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
        image: data.image,
        videoLink: data.videoLink,
        authorId: user.id,
      },
    });
    return NextResponse.json({ course }, { status: 201 });
  } catch (err) {
    console.error('Course create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

