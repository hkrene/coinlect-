import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { signAccessToken, signRefreshToken } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/email';
import { UserRole } from '@prisma/client';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID is not set.');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET is not set.');
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Handle OAuth errors from Google
    if (error) {
      console.error('Google OAuth error:', error, errorDescription);
      
      // Specific handling for redirect_uri_mismatch
      if (error === 'redirect_uri_mismatch') {
        const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
        return NextResponse.redirect(
          new URL(
            `/login?error=oauth_config&message=${encodeURIComponent(
              `Redirect URI mismatch. Please add this URI to Google Cloud Console: ${redirectUri}`
            )}`,
            req.url
          )
        );
      }
      
      // Generic OAuth error
      return NextResponse.redirect(
        new URL(
          `/login?error=oauth_error&message=${encodeURIComponent(errorDescription || error)}`,
          req.url
        )
      );
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
    }

    // Construct the redirect URI that was used in the authorization request
    // This must match exactly what was sent to Google
    const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;

    // Exchange code for tokens
    // The redirect URI must match the one used in the authorization request
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    });
    client.setCredentials(tokens);

    // Get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload.sub) {
      return NextResponse.redirect(new URL('/login?error=invalid_token', req.url));
    }

    const email = payload.email;
    const googleId = payload.sub;
    const name = payload.name || email;
    const avatar = payload.picture || null;

    // Check if user exists before upsert to determine if it's a new signup
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const isNewUser = !existingUser;

    // Create or update user. Google already verified the email address, so
    // mark it as confirmed regardless of the provider the account was created with.
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        googleId,
        provider: 'google',
        name,
        avatar,
        emailVerifiedAt: new Date(),
      },
      create: {
        email,
        googleId,
        provider: 'google',
        name,
        avatar,
        role: UserRole.USER,
        emailVerifiedAt: new Date(),
      },
    });

    // Send welcome email for new users (best-effort; never block signup)
    if (isNewUser) {
      await sendWelcomeEmail({ to: user.email, name: user.name }).catch((e) => {
        console.error('Welcome email failed for Google OAuth callback', e);
      });
    }

    // Create session
    const tokenPayload = { sub: user.id, role: user.role };
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    // Create response with redirect to academy (or check for stored redirect path)
    // Check if there's a redirect path in the referer or use academy as default
    const referer = req.headers.get('referer');
    const redirectPath = referer?.includes('/login') ? '/academy' : 
                        referer?.includes('/register') ? '/academy' : 
                        '/academy';
    const response = NextResponse.redirect(new URL(redirectPath, req.url));

    // Set refresh token cookie (this is used by the auth system)
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    
    // Handle specific OAuth errors
    if (err.message?.includes('invalid_request') || err.code === 'invalid_request') {
      const redirectUri = `${req.nextUrl.origin}/api/auth/google/callback`;
      console.error('Invalid request - redirect URI mismatch or code already used');
      console.error('Expected redirect URI:', redirectUri);
      return NextResponse.redirect(
        new URL(
          `/login?error=oauth_config&message=${encodeURIComponent(
            `OAuth configuration error. Please verify the redirect URI ${redirectUri} is correctly configured in Google Cloud Console.`
          )}`,
          req.url
        )
      );
    }
    
    if (err.message === 'GOOGLE_CLIENT_ID is not set.' || err.message === 'GOOGLE_CLIENT_SECRET is not set.') {
      return NextResponse.redirect(new URL('/login?error=server_config_error', req.url));
    }
    if (err.message === 'JWT_SECRET missing') {
      return NextResponse.redirect(new URL('/login?error=server_config_error', req.url));
    }
    
    // Log full error details for debugging
    console.error('Full error details:', {
      message: err.message,
      code: err.code,
      response: err.response?.data,
    });
    
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url));
  }
}