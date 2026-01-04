import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { eventSchema } from '@/lib/validators';
import { getAuthUser, requireAdminSlug } from '@/lib/auth-utils';
import { UserRole, PublishStatus } from '@prisma/client';

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const auth = await getAuthUser(req);

  const event = await prisma.event.findUnique({
    where: { slug },
    include: { author: true },
  });

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Only show published events to non-admin users
  if (auth?.role !== UserRole.ADMIN && event.status !== PublishStatus.PUBLISHED) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ event });
}

export const PATCH = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (!existingEvent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const event = await prisma.event.update({
      where: { slug },
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
        publishedAt: data.status === PublishStatus.PUBLISHED && existingEvent.status !== PublishStatus.PUBLISHED ? new Date() : existingEvent.publishedAt,
      },
    });

    return NextResponse.json({ event });
  } catch (err) {
    console.error('Event update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const DELETE = requireAdminSlug(async (req: NextRequest, user, params: { slug: string }) => {
  const { slug } = params;
  if (!slug) return NextResponse.json({ error: 'Slug required' }, { status: 400 });

  try {
    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (!existingEvent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.event.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Event delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
