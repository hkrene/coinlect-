import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validators';
import { verifyPassword, signRefreshToken } from '@/lib/auth';
import { serialize } from 'cookie';
import { enforceRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { email, password, captchaToken } = parsed.data;

    // Throttle by IP and by targeted account to slow credential stuffing /
    // brute-force attacks. A generic message is always returned.
    const perIp = enforceRateLimit(req, 'login:ip', 20, 10 * 60 * 1000);
    if (perIp) return perIp;
    const perAccount = enforceRateLimit(req, 'login:account', 10, 10 * 60 * 1000, email);
    if (perAccount) return perAccount;

    // CAPTCHA (Cloudflare Turnstile). No-op when no secret key is configured.
    const captcha = await verifyCaptcha(captchaToken, getClientIp(req));
    if (!captcha.success) {
      return NextResponse.json(
        { error: 'Anti-bot verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

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

    await prisma.user.update({
      where: { id: user.id },
      data: { lastActivityAt: new Date() },
    });

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err: any) {
    console.error('Login error', err);
    if (err.message === 'JWT_SECRET missing') {
      return NextResponse.json({ error: 'Server configuration error: JWT_SECRET is not set.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

