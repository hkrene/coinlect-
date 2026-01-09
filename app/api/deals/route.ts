import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dealSchema } from '@/lib/validators';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ deals });
}

export const POST = requireAdmin(async (req: NextRequest, user) => {

  try {
    const body = await req.json();
    const parsed = dealSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;
    const deal = await prisma.deal.create({
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
    return NextResponse.json({ deal }, { status: 201 });
  } catch (err) {
    console.error('Deal create error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
