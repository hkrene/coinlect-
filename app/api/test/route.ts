import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
      },
    });

    return NextResponse.json({
      jwtSecretExists: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      users: users,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Database error',
      jwtSecretExists: !!process.env.JWT_SECRET,
    });
  }
}
