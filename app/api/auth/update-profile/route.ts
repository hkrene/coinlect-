import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth-utils';
import { updateProfileSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const limited = enforceRateLimit(req, 'update-profile', 20, 10 * 60 * 1000, auth.id);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { name, dateOfBirth, avatar } = parsed.data;

    if (name === undefined && dateOfBirth === undefined && avatar === undefined) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Type assertion needed because Prisma Accelerate extension affects type inference for dateOfBirth
    const updatedUser = await (prisma.user as any).update({
      where: { id: auth.id },
      data: {
        name: name !== undefined ? name : undefined,
        dateOfBirth: dateOfBirth !== undefined ? dateOfBirth : undefined,
        avatar: avatar !== undefined ? avatar : undefined,
      } as any,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        createdAt: true,
        dateOfBirth: true,
      } as any,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    console.error('Update profile error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
