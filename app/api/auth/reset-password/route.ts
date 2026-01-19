import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { hashPassword } from '@/lib/auth';

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

    const reset = await (prisma as any).passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!reset || reset.userId !== userId || reset.usedAt || reset.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token is invalid or expired' }, { status: 400 });
    }

    const newHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash, provider: 'local' },
      }),
      (prisma as any).passwordResetToken.update({
        where: { tokenHash },
        data: { usedAt: new Date() },
      }),
      prisma.refreshToken.deleteMany({
        where: { userId },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Reset password error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

