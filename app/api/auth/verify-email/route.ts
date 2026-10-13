import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { verifyEmailSchema } from '@/lib/validators';
import { sendWelcomeEmail } from '@/lib/email';
import { UserRole } from '@prisma/client';
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

    // The link references a PendingSignup (the local account only exists in the
    // database once this link is confirmed — see register route).
    // TypeScript may not see the newly generated model immediately due to
    // caching, but it exists at runtime after prisma generate.
    const pending = await (basePrisma as any).pendingSignup.findFirst({
      where: {
        id: userId,
        tokenHash,
        expiresAt: { gt: new Date() },
      },
    });

    if (!pending) {
      return NextResponse.json(
        { error: 'This verification link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const alreadyUsed = pending.usedAt != null;

    // Idempotent re-clicks: the signup was already confirmed, so the account
    // (if still present) should already be verified.
    if (alreadyUsed) {
      const existingUser = await (basePrisma as any).user.findUnique({
        where: { email: pending.email },
        select: { id: true, emailVerifiedAt: true, provider: true },
      });
      if (existingUser?.emailVerifiedAt) {
        return NextResponse.json({
          success: true,
          message: 'Your email address is already verified. You can sign in now.',
        });
      }
      // Fall through: the account was never created (rolled back / deleted), so
      // let the visitor confirm again to create it.
    }

    const now = new Date();

    // Guard: a confirmed account must not be created when one already exists
    // for this email (e.g. a Google account was created in the meantime).
    const existingUser = await (basePrisma as any).user.findUnique({
      where: { email: pending.email },
      select: { id: true },
    });
    if (existingUser) {
      await (basePrisma as any).pendingSignup.update({
        where: { id: pending.id },
        data: { usedAt: now },
      });
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please sign in instead.' },
        { status: 409 }
      );
    }

    try {
      // Create the User now that the email address is confirmed, and mark the
      // staged signup as consumed — atomically.
      await (basePrisma as any).$transaction([
        (basePrisma as any).user.create({
          data: {
            email: pending.email,
            passwordHash: pending.passwordHash,
            name: pending.name,
            role: UserRole.USER,
            provider: 'local',
            emailVerifiedAt: now,
            isActive: true,
          },
        }),
        (basePrisma as any).pendingSignup.update({
          where: { id: pending.id },
          data: { usedAt: now },
        }),
      ]);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // Duplicate email — an account appeared between our check and the write.
        await (basePrisma as any).pendingSignup.update({
          where: { id: pending.id },
          data: { usedAt: now },
        }).catch(() => {});
        return NextResponse.json(
          { error: 'An account with this email address already exists. Please sign in instead.' },
          { status: 409 }
        );
      }
      throw err;
    }

    // Fire-and-forget welcome email now that the account is active.
    sendWelcomeEmail({ to: pending.email, name: pending.name }).catch((err) => {
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