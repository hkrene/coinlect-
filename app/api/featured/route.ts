import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { featuredSchema } from '@/lib/validators';
import { getAuthContext, unauthorized, forbidden } from '@/lib/api';
import { UserRole } from '@prisma/client';

export async function GET() {
  const items = await prisma.featuredItem.findMany({
    orderBy: { order: 'asc' },
    include: { course: true, article: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const body = await req.json();
    const parsed = featuredSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { type, refId, order, spotlight } = parsed.data;

    const item = await prisma.featuredItem.create({
      data: {
        type,
        courseId: type === 'COURSE' ? refId : null,
        articleId: type === 'ARTICLE' ? refId : null,
        order,
        spotlight,
      },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error('Featured create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();
  if (auth.role !== UserRole.ADMIN && auth.role !== UserRole.EDITOR) return forbidden();

  try {
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
    }

    const updates = items.map((item: any) =>
      prisma.featuredItem.update({
        where: { id: item.id },
        data: { order: item.order ?? 0, spotlight: !!item.spotlight },
      })
    );
    await prisma.$transaction(updates);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Featured bulk update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

