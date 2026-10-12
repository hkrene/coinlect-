import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { getAuthUser } from '@/lib/auth-utils';
import { changePasswordSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Throttle password attempts per account.
  const limited = enforceRateLimit(req, 'change-password', 5, 15 * 60 * 1000, auth.id);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: auth.id },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'User not found or password not set' }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 });
    }

    // Reject reuse of the current password.
    const isSame = await verifyPassword(newPassword, user.passwordHash);
    if (isSame) {
      return NextResponse.json(
        { error: 'New password must be different from the current password' },
        { status: 400 }
      );
    }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password and invalidate all *other* sessions.
    const currentToken = req.cookies.get('refreshToken')?.value;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: auth.id },
        data: { passwordHash },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: auth.id, revokedAt: null, token: { not: currentToken } },
        data: { revokedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Change password error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
