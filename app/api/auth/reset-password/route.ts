import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import { hashPassword } from '@/lib/auth';
import { sendPasswordResetSuccessEmail } from '@/lib/email';

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
    const userId = typeof body.userId === 'string' ? body.userId : '';
    const token = typeof body.token === 'string' ? body.token : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!userId || !token || password.length < 8) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const tokenHash = sha256(token);

    // TypeScript may not see the newly generated model immediately due to caching,
    // but it exists at runtime after prisma generate
    const reset = await (basePrisma as any).passwordResetToken.findFirst({
      where: {
        tokenHash,
        userId,
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
    });

    if (!reset) {
      return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 });
    }

    // Fetch user to get email before updating password
    const user = await basePrisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newHash = await hashPassword(password);

    await (basePrisma as any).$transaction([
      basePrisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash, provider: 'local' },
      }),
      (basePrisma as any).passwordResetToken.update({
        where: { tokenHash },
        data: { usedAt: new Date() },
      }),
      basePrisma.refreshToken.deleteMany({
        where: { userId },
      }),
    ]);

    // Send success email (don't await to avoid blocking the response)
    sendPasswordResetSuccessEmail({ to: user.email }).catch((err) => {
      console.error('Failed to send password reset success email:', err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

