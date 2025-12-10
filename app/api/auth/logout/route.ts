import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken || typeof refreshToken !== 'string') {
      return NextResponse.json({ error: 'refreshToken required' }, { status: 400 });
    }

    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Logout error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

