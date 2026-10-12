/**
 * Cloudflare Turnstile verification.
 *
 * Turnstile is a privacy-friendly, usually-invisible CAPTCHA. The client widget
 * (see `components/Turnstile.tsx`) produces a single-use token which the server
 * validates here against Cloudflare's `siteverify` endpoint.
 *
 * Configuration:
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY - public site key rendered by the widget
 *   TURNSTILE_SECRET_KEY           - secret used for server-side verification
 *
 * When `TURNSTILE_SECRET_KEY` is unset (local development, or a self-hosted
 * instance without keys) verification is skipped so the forms keep working.
 * Set both keys in production to actually enforce it.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface CaptchaResult {
  success: boolean;
  /** True when no secret is configured and verification was skipped. */
  skipped?: boolean;
  errorCodes?: string[];
}

/**
 * Whether CAPTCHA verification is configured on both sides.
 *
 * Both keys are required: the secret drives server verification while the
 * site key drives the client widget. Enforcing with only the secret set would
 * reject every submission because the client never renders a widget, so a
 * half-configured environment skips verification instead of locking users out.
 */
export function isCaptchaConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

/**
 * Verify a Turnstile token.
 *
 * Fails closed: a missing token or a network error rejects the request, so an
 * outage of the verification service can never silently disable protection.
 */
export async function verifyCaptcha(token: unknown, ip?: string): Promise<CaptchaResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!secret) return { success: true, skipped: true };
  if (!siteKey) {
    console.warn(
      'TURNSTILE_SECRET_KEY is set but NEXT_PUBLIC_TURNSTILE_SITE_KEY is missing; ' +
        'CAPTCHA verification is disabled to avoid rejecting every request. Set both keys to enable it.'
    );
    return { success: true, skipped: true };
  }

  if (typeof token !== 'string' || token.trim().length === 0) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== 'unknown') body.set('remoteip', ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    return { success: Boolean(data.success), errorCodes: data['error-codes'] };
  } catch (err) {
    console.error('Turnstile verification failed', err);
    return { success: false };
  }
}
