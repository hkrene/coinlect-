import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dealSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const deal = await prisma.deal.findUnique({
    where: { id },
  });

  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ deal });
}

export const PATCH = requireAdmin(async (req: NextRequest, user: any, params: Promise<{ id: string }>) => {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const body = await req.json();
    const parsed = dealSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        details: data.details,
        category: data.category,
        link: data.link,
        image: data.image,
        discount: data.discount,
        code: data.code,
        exclusive: data.exclusive ?? false,
        verified: data.verified ?? false,
        featured: data.featured ?? false,
      },
    });

    return NextResponse.json({ deal });
  } catch (err) {
    console.error('Deal update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (req: NextRequest, user: any, params: Promise<{ id: string }>) => {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

  try {
    const existingDeal = await prisma.deal.findUnique({
      where: { id },
    });

    if (!existingDeal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Deal delete error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});