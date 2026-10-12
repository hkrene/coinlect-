import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { verifyEmailSchema } from '@/lib/validators';
import { sendWelcomeEmail } from '@/lib/email';
import { enforceRateLimit } from '@/lib/rate-limit';

// Create a base PrismaClient instance for operations that need direct model access
// (Accelerate extension may not expose newly added models immediately)
const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}) as PrismaClient;

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(req: NextRequest) {
  // Throttle token guessing.
  const limited = enforceRateLimit(req, 'verify-email', 10, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = verifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const { userId, token } = parsed.data;

    const tokenHash = sha256(token);

    // TypeScript may not see the newly generated model immediately due to caching,
    // but it exists at runtime after prisma generate
    const verification = await (basePrisma as any).emailVerificationToken.findFirst({
      where: {
        tokenHash,
        userId,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!verification) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const user = await (basePrisma as any).user.findUnique({ where: { id: userId } });
    if (!user || user.provider === 'google') {
      return NextResponse.json({ error: 'Invalid verification link' }, { status: 400 });
    }

    if (user.emailVerifiedAt) {
      // Idempotent: the email is already confirmed.
      return NextResponse.json({
        success: true,
        message: 'Your email address is already verified. You can sign in now.',
      });
    }

    const now = new Date();
    await (basePrisma as any).$transaction([
      (basePrisma as any).user.update({
        where: { id: userId },
        data: { emailVerifiedAt: now, isActive: true },
      }),
      (basePrisma as any).emailVerificationToken.update({
        where: { id: verification.id },
        data: { usedAt: now },
      }),
    ]);

    // Fire-and-forget welcome email now that the account is active.
    sendWelcomeEmail({ to: user.email, name: user.name }).catch((err) => {
      console.error('Welcome email failed after verification', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Your email address has been verified. You can sign in now.',
    });
  } catch (err) {
    console.error('Verify email error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}