import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators';
import { hashPassword, signRefreshToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { UserRole } from '@prisma/client';
import { serialize } from 'cookie';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Limit account creation per IP to slow down automated abuse.
  const limited = enforceRateLimit(req, 'register', 10, 10 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: UserRole.USER,
        provider: 'local',
      },
    });

    // Send welcome email (best-effort; never block signup)
    await sendWelcomeEmail({ to: user.email, name: user.name }).catch((e) => {
      console.error('Welcome email failed', e);
    });

    // Create refresh token
    const tokenPayload = { sub: user.id, role: user.role };
    const refreshToken = await signRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    // Set the refresh token cookie
    const cookie = serialize('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production', // Ensure secure cookies in production
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err: any) {
    console.error('Register error:', err.message, err.stack);
    if (err.message === 'JWT_SECRET missing') {
      return NextResponse.json({ error: 'Server configuration error: JWT_SECRET is not set.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

