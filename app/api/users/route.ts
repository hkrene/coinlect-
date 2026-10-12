import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser, requireAdmin } from '@/lib/auth-utils';
import { UserRole, Prisma } from '@prisma/client';
import { userActionSchema } from '@/lib/validators';

// Keep the response payload small per request. Combined with pagination this
// lets the admin browse every user in the database without hitting response
// or database row limits. The admin UI exposes a page-size selector.
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// A local account that was created a while ago but has never logged in is a
// strong signal of an automated/bot signup. Used by the "Suspects" filter.
const SUSPECT_MIN_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== UserRole.ADMIN) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1);
    const pageSize = Math.min(
      MAX_PAGE_SIZE,
      Math.max(1, Number.parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
    );
    const search = (searchParams.get('search') || '').trim();
    const role = (searchParams.get('role') || '').trim().toUpperCase();
    const status = (searchParams.get('status') || '').trim().toLowerCase();

    // Build a filtered where clause so counts and rows stay consistent.
    const where: Prisma.UserWhereInput = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role === UserRole.ADMIN || role === UserRole.USER) {
      where.role = role as UserRole;
    }
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'suspended' || status === 'inactive') {
      where.isActive = false;
    } else if (status === 'suspects') {
      // Bots: local accounts that have never signed in.
      where.isActive = true;
      where.provider = 'local';
      where.lastActivityAt = null;
      where.createdAt = { lt: new Date(Date.now() - SUSPECT_MIN_AGE_MS) };
    }

    // Paginate: never load the entire user table at once (it can exceed the
    // database/Prisma response limit and break the admin panel).
    const [totalUsers, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          role: true,
          provider: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          lastActivityAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      users,
      totalUsers,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(totalUsers / pageSize)),
    });
  } catch (err) {
    console.error('Users fetch error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const POST = requireAdmin(async (req: NextRequest, user) => {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = userActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { userId, action } = parsed.data;

    // Prevent self-modification
    if (userId === user.id) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'activate' || action === 'deactivate') {
      const isActive = action === 'activate';
      if (targetUser.isActive === isActive) {
        return NextResponse.json(
          { error: isActive ? 'User is already active' : 'User is already suspended' },
          { status: 400 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { isActive },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          provider: true,
          isActive: true,
          createdAt: true,
          lastActivityAt: true,
        },
      });

      // Invalidate any existing sessions so a suspended account is logged out
      // everywhere immediately (getAuthUser also rejects inactive users).
      if (!isActive) {
        await prisma.refreshToken.updateMany({
          where: { userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
      }

      return NextResponse.json({ user: updatedUser });
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
        provider: true,
        isActive: true,
        createdAt: true,
        lastActivityAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    console.error('User update error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
});
