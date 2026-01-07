import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      // Delete the refresh token from database
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Clear the refresh token cookie
    const cookie = serialize('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (err) {
    console.error('Logout error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

