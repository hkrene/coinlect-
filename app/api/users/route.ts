import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastActivityAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error('Users fetch error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = requireAdmin(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    if (action !== 'promote' && action !== 'demote') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Prevent self-modification
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot modify your own role' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let newRole: UserRole;
    if (action === 'promote') {
      if (targetUser.role === UserRole.ADMIN) {
        return NextResponse.json({ error: 'User is already an admin' }, { status: 400 });
      }
      newRole = UserRole.ADMIN;
    } else {
      if (targetUser.role === UserRole.USER) {
        return NextResponse.json({ error: 'User is already a regular user' }, { status: 400 });
      }
      newRole = UserRole.USER;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        lastActivityAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error('User role update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
