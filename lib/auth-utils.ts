import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { UserRole } from '@prisma/client';

export interface AuthUser {
  id: string;
  role: UserRole;
}

export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (!payload || typeof payload.sub !== 'string' || !payload.role) {
      return null;
    }

    return {
      id: payload.sub,
      role: payload.role as UserRole,
    };
  } catch (error) {
    console.error('Auth verification failed:', error);
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

export function requireAdmin(handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req, user);
  };
}

export function requireAdminOrSelf(handler: (req: NextRequest, user: AuthUser, targetUserId?: string) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract user ID from URL if it's a path parameter
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const targetUserId = pathParts[pathParts.length - 1];

    // Admin can access anyone's data, users can only access their own
    if (user.role !== UserRole.ADMIN && user.id !== targetUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req, user, targetUserId);
  };
}
