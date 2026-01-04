import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { courseSchema } from '@/lib/validators';
import { getAuthUser, requireAdmin, requireAdminSlug } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params;
  const auth = await getAuthUser(req);
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      modules: { orderBy: { order: 'asc' } },
      author: true
    },
  });
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only show published courses to non-admin users
  if (auth?.role !== UserRole.ADMIN && course.status !== PublishStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ course });
}

export const PATCH = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = courseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const course = await prisma.course.update({
      where: { slug },
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
});

export const DELETE = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    await prisma.course.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Course delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

