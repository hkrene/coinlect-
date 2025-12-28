import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get('__session')?.value;

    if (sessionId) {
      await prisma.session.delete({
        where: { id: sessionId },
      });
    }

    // Clear the session cookie
    const cookie = serialize('__session', '', {
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

