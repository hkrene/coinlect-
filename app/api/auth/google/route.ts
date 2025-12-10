import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { UserRole } from '@prisma/client';

const clientId = process.env.GOOGLE_CLIENT_ID;

const client = clientId ? new OAuth2Client(clientId) : null;

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'idToken required' }, { status: 400 });
    }
    if (!client) {
      return NextResponse.json({ error: 'Google OAuth not configured' }, { status: 500 });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 401 });
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || email;

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        googleId,
        provider: 'google',
        name,
      },
      create: {
        email,
        googleId,
        provider: 'google',
        name,
        role: UserRole.USER,
      },
    });

    const tokenPayload = { sub: user.id, role: user.role };
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('Google auth error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

