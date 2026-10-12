import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { buildResetPasswordUrl, sendPasswordResetEmail } from '@/lib/email';
import { forgotPasswordSchema } from '@/lib/validators';
import { enforceRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';

// Create a base PrismaClient instance for operations that need direct model access
// (Accelerate extension may not expose newly added models immediately)
const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}) as PrismaClient;

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

const genericResponse = () =>
  NextResponse.json({
    success: true,
    message: 'If an account with that email exists, a password reset link has been sent.',
  });

export async function POST(req: NextRequest) {
  // Throttle to prevent email bombing / reset-token flooding.
  const limited = enforceRateLimit(req, 'forgot-password', 5, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = forgotPasswordSchema.safeParse(body);

    // Always respond with success to avoid user enumeration.
    if (!parsed.success) {
      return genericResponse();
    }
    const email = parsed.data.email;

    // CAPTCHA (Cloudflare Turnstile). A bot failing this gets a 400 (it is a
    // client error, not an enumeration signal). No-op without a secret key.
    const captcha = await verifyCaptcha(parsed.data.captchaToken, getClientIp(req));
    if (!captcha.success) {
      return NextResponse.json(
        { error: 'Anti-bot verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return genericResponse();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // TypeScript may not see the newly generated model immediately due to caching,
    // but it exists at runtime after prisma generate
    await (basePrisma as any).passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        tokenHash,
        expiresAt,
      },
    });

    const resetUrl = buildResetPasswordUrl({ userId: user.id, token });
    await sendPasswordResetEmail({ to: user.email, resetUrl });

    return genericResponse();
  } catch (err) {
    console.error('Forgot password error', err);
    // Still return generic success to avoid enumeration / leaking failures.
    return genericResponse();
  }
}

