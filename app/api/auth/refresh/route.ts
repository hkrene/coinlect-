import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken || typeof refreshToken !== 'string') {
      return NextResponse.json({ error: 'refreshToken required' }, { status: 400 });
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const payload = await verifyToken(refreshToken);
    if (!payload.sub || !payload.role) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const accessToken = await signAccessToken({ sub: payload.sub, role: payload.role });
    const newRefresh = await signRefreshToken({ sub: payload.sub, role: payload.role });

    const now = new Date();
    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { revokedAt: now },
      }),
      prisma.refreshToken.create({
        data: {
          userId: payload.sub,
          token: newRefresh,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        },
      }),
      prisma.user.update({
        where: { id: payload.sub },
        data: { lastActivityAt: now },
      }),
    ]);

    return NextResponse.json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    console.error('Refresh error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

