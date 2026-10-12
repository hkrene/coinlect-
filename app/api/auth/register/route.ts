import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { registerSchema, isDisposableEmail } from '@/lib/validators';
import { hashPassword } from '@/lib/auth';
import { sendVerificationEmail, buildVerificationUrl } from '@/lib/email';
import { UserRole } from '@prisma/client';
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

/** Email verification links are valid for 24 hours. */
const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;

// Create a base PrismaClient instance for operations that need direct model access
// (Accelerate extension may not expose newly added models immediately)
const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}) as PrismaClient;

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

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
        emailVerifiedAt: null, // must confirm their email via link before signing in
      },
    });

    // Generate a single-use verification token and email the confirmation link.
    // The account is NOT usable (no session is issued) until the email is confirmed.
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

    try {
      await (basePrisma as any).emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          tokenHash,
          expiresAt,
        },
      });
    } catch (err) {
      // Roll back the account so a legitimate visitor can simply retry sign-up
      // instead of hitting an "email already in use" dead-end.
      console.error('Failed to create email verification token', err);
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      throw err;
    }

    const verificationUrl = buildVerificationUrl({ userId: user.id, token });
    await sendVerificationEmail({ to: user.email, name: user.name, verificationUrl }).catch((e) => {
      console.error('Verification email failed', e);
    });

    // Do NOT create a session: {@link User.emailVerifiedAt} must be set first.
    return NextResponse.json(
      {
        success: true,
        requiresEmailVerification: true,
        message:
          'Account created. Please check your email to confirm your address and activate your account.',
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Register error:', err.message, err.stack);
    if (err.message === 'JWT_SECRET missing') {
      return NextResponse.json({ error: 'Server configuration error: JWT_SECRET is not set.' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}