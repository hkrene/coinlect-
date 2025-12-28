import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { prisma } from './prisma';
import { UserRole } from '@prisma/client';

export interface AuthContext {
  userId: string;
  role: UserRole;
}

export async function getAuthContext(req: NextRequest): Promise<AuthContext | null> {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.replace('Bearer ', '');
  try {
    const payload = await verifyToken(token);
    if (!payload.sub || !payload.role) return null;
    // Optional: ensure user still exists
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    return { userId: user.id, role: payload.role };
  } catch {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = 'Internal Server Error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function notFound(message = 'Not Found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function requireAdmin(role: UserRole) {
  if (role !== UserRole.ADMIN) {
    throw new Error('FORBIDDEN');
  }
}

