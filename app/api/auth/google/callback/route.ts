import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { UserRole } from '@prisma/client';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const client = clientId && clientSecret ? new OAuth2Client(clientId, clientSecret) : null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
    }

    if (!client) {
      return NextResponse.redirect(new URL('/login?error=google_not_configured', req.url));
    }

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || email;
    const avatar = payload.picture || null;

    // Create or update user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        googleId,
        provider: 'google',
        name,
        avatar,
      },
      create: {
        email,
        googleId,
        provider: 'google',
        name,
        avatar,
        role: UserRole.USER,
      },
    });

    // Create session
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

    // Create response with redirect to home
    const response = NextResponse.redirect(new URL('/', req.url));

    // Set refresh token cookie (this is used by the auth system)
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
  }
}