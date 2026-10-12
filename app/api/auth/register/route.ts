import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema, isDisposableEmail } from '@/lib/validators';
import { hashPassword, signRefreshToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { UserRole } from '@prisma/client';
import { serialize } from 'cookie';
import { enforceRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';

/**
 * Minimum time a human needs to fill the registration form (ms). Automated
 * submissions (and requests with no timing signal at all) are rejected.
 */
const MIN_FORM_FILL_MS = 2000;

/** Generic message returned for every bot-detection gate, so scripts can't
 *  reverse-engineer the individual rules from the error text. */
const BOT_REJECTION = 'Unable to complete registration at this time. Please try again.';

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

    const { email, password, name, website, elapsedMs, captchaToken } = parsed.data;

    // Honeypot: invisible to humans, filled by naive bots and form scrapers.
    if (website && website.trim().length > 0) {
      return NextResponse.json({ error: BOT_REJECTION }, { status: 400 });
    }

    // Timing gate: bots submit instantly (or omit the signal entirely).
    if (typeof elapsedMs !== 'number' || elapsedMs < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: BOT_REJECTION }, { status: 400 });
    }

    // CAPTCHA (Cloudflare Turnstile). No-op when no secret key is configured.
    const captcha = await verifyCaptcha(captchaToken, getClientIp(req));
    if (!captcha.success) {
      return NextResponse.json(
        { error: 'Anti-bot verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Temporary inboxes are the fuel of account factories.
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: 'Registrations with temporary email providers are not allowed. Please use a permanent email address.' },
        { status: 400 }
      );
    }

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

