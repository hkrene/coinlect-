import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(refreshToken);
    if (!payload.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, dateOfBirth, avatar } = body;

    // Type assertion needed because Prisma Accelerate extension affects type inference for dateOfBirth
    const updatedUser = await (prisma.user as any).update({
      where: { id: payload.sub },
      data: {
        name: name !== undefined ? name : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
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
