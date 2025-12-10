import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext, unauthorized } from '@/lib/api';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const auth = await getAuthContext(req);
  if (!auth) return unauthorized();

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true, email: true, name: true, role: true, lastActivityAt: true },
  });
  if (!user) return unauthorized();

  return NextResponse.json({ user });
}

