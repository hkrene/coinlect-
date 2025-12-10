import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enrollmentSchema } from '@/lib/validators';
import { getAuthContext, unauthorized } from '@/lib/api';

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();

  try {
    const body = await req.json();
    const parsed = enrollmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: auth.userId, courseId: parsed.data.courseId } },
      update: {},
      create: {
        userId: auth.userId,
        courseId: parsed.data.courseId,
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (err) {
    console.error('Enrollment error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

