import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { resendVerificationSchema } from '@/lib/validators';
import { sendVerificationEmail, buildVerificationUrl } from '@/lib/email';
import { enforceRateLimit, getClientIp } from '@/lib/rate-limit';
import { verifyCaptcha } from '@/lib/captcha';

const VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// Create a base PrismaClient instance for operations that need direct model access
// (Accelerate extension may not expose newly added models immediately)
const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}) as PrismaClient;

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Always succeed publicly so scripts cannot tell whether an account exists or
// is already verified (prevents user enumeration + verification-token flooding).
const genericResponse = () =>
  NextResponse.json({
    success: true,
    message: 'If your account still needs verification, a new confirmation link has been sent.',
  });

export async function POST(req: NextRequest) {
  // Throttle to prevent email bombing.
  const limitedIp = enforceRateLimit(req, 'resend-verification:ip', 10, 15 * 60 * 1000);
  if (limitedIp) return limitedIp;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = resendVerificationSchema.safeParse(body);
    if (!parsed.success) {
      return genericResponse();
    }
    const { email, captchaToken } = parsed.data;

    const limitedEmail = enforceRateLimit(req, 'resend-verification:email', 3, 15 * 60 * 1000, email);
    if (limitedEmail) return limitedEmail;

    // CAPTCHA (Cloudflare Turnstile). Fails closed when configured and no token
    // is supplied. No-op without a secret key.
    const captcha = await verifyCaptcha(captchaToken, getClientIp(req));
    if (!captcha.success) {
      return NextResponse.json(
        { error: 'Anti-bot verification failed. Please try again.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    // Only local, unverified accounts need (and may receive) a new link.
    if (!user || user.provider === 'google' || (user as any).emailVerifiedAt) {
      return genericResponse();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

    await (basePrisma as any).emailVerificationToken.create({
      data: {
        userId: user.id,
        token,
        tokenHash,
        expiresAt,
      },
    });

    const verificationUrl = buildVerificationUrl({ userId: user.id, token });
    await sendVerificationEmail({ to: user.email, name: user.name, verificationUrl });

    return genericResponse();
  } catch (err) {
    console.error('Resend verification error', err);
    return genericResponse();
  }
}