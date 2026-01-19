import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { buildResetPasswordUrl, sendPasswordResetEmail } from '@/lib/email';

// Create a base PrismaClient instance for operations that need direct model access
// (Accelerate extension may not expose newly added models immediately)
const basePrisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}) as PrismaClient;

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    // Always respond with success to avoid user enumeration.
    if (!email) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
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

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    console.error('Forgot password error', err);
    // Still return generic success to avoid enumeration / leaking failures.
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  }
}

