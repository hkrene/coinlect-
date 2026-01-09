import { NextRequest, NextResponse } from 'next/server';
import { UserRole, PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const refreshTokenValue = req.cookies.get('refreshToken')?.value;
    if (!refreshTokenValue) {
      return null;
    }

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!refreshToken || !refreshToken.user) {
      return null;
    }

    return {
      id: refreshToken.user.id,
      role: refreshToken.user.role,
    };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

export function requireAuth(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(req, user);
  };
}

export function requireAdmin(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>): any;
export function requireAdmin(handler: (req: NextRequest, user: AuthUser, params: Promise<{ id: string }>) => Promise<NextResponse>): any;
export function requireAdmin(handler: any, params?: any) {
  return async (req: NextRequest, context?: any) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (context?.params) {
      return handler(req, user, context.params);
    } else {
      return handler(req, user);
    }
  };
}

export function requireAdminSlug(handler: (req: NextRequest, user: AuthUser, params: Promise<{ slug: string }>) => Promise<NextResponse>) {
  return async (req: NextRequest, context: { params: Promise<{ slug: string }> }) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req, user, context.params);
  };
}

export function requireAdminOrSelf(handler: (req: NextRequest, user: AuthUser, params: Promise<{ id: string }>) => Promise<NextResponse>) {
  return async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const params = await context.params;
    const targetUserId = params.id;

    // Admin can access anyone's data, users can only access their own
    if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, user, context.params);
  };
}
