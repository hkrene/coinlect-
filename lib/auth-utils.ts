import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const sessionId = req.cookies.get('__session')?.value;
    if (!sessionId) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId, expiresAt: { gt: new Date() } },
      include: { user: true },
    });

    if (!session || !session.user) {
      return null;
    }

    return {
      id: session.user.id,
      role: session.user.role,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
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

export function requireAdmin(handler: (req: NextRequest, user: AuthUser, params: { id: string }) => Promise<NextResponse>) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req, user, params);
  };
}

export function requireAdminOrSelf(handler: (req: NextRequest, user: AuthUser, params: { id: string }) => Promise<NextResponse>) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const targetUserId = params.id;

    // Admin can access anyone's data, users can only access their own
    if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, user, params);
  };
}
