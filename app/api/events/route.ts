import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/validators';
import { getAuthUser, requireAdmin } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  const includeDrafts = auth?.role === UserRole.ADMIN;
  const events = await prisma.event.findMany({
    where: includeDrafts ? {} : { status: PublishStatus.PUBLISHED },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });
  return NextResponse.json({ events });
}

export const POST = requireAdmin(async (req: NextRequest, user) => {

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        date: data.date,
        location: data.location,
        description: data.description,
        banner: data.banner,
        bannerImage: data.bannerImage,
        bannerText: data.bannerText,
        eventTypes: data.eventTypes,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        status: data.status ?? PublishStatus.DRAFT,
        publishedAt: data.status === PublishStatus.PUBLISHED ? new Date() : null,
        authorId: user.id,
      },
    });
    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error('Event create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
