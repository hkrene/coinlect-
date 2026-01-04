import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dealSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  const deal = await prisma.deal.findUnique({
    where: { id },
  });

  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ deal });
}

export const PATCH = requireAdmin(async (req: NextRequest, user, params: { id: string }) => {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

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

export const DELETE = requireAdmin(async (req: NextRequest, user, params: { id: string }) => {
  const { id } = params;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

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