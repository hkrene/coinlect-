import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { moduleSchema } from '@/lib/validators';
import { requireAdminSlug } from '@/lib/auth-utils';

export const POST = requireAdminSlug(async (req: NextRequest, user: any, params: Promise<{ slug: string }>) => {
  const { slug } = await params;

  try {
    const body = await req.json();
    const parsed = moduleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Find course by slug to get its ID
    const course = await prisma.course.findUnique({
      where: { slug },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const data = parsed.data;
    const courseModule = await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: data.title,
        content: data.content,
        order: data.order,
        durationMin: data.durationMin,
      },
    });
    return NextResponse.json({ module: courseModule }, { status: 201 });
  } catch (err) {
    console.error('Module create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

