import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is missing. Emails will not be sent.');
    return null;
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  // Resend requires a verified sender domain for production. For dev, `onboarding@resend.dev` works.
  return process.env.RESEND_FROM || 'Coinlect <onboarding@resend.dev>';
}

function getAppBaseUrl() {
  // Public base URL used in email links.
  // Priority: APP_BASE_URL > NEXT_PUBLIC_APP_BASE_URL > NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost fallback
  const baseUrl = process.env.APP_BASE_URL || 
                  process.env.NEXT_PUBLIC_APP_BASE_URL || 
                  process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
                  'http://localhost:3000';
  
  // Ensure URL doesn't end with trailing slash
  return baseUrl.replace(/\/$/, '');
}

export async function sendWelcomeEmail(params: { to: string; name?: string | null }) {
  const client = getResendClient();
  if (!client) return;

  const subject = 'Bienvenue sur Coinlect';
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Bienvenue${params.name ? `, ${escapeHtml(params.name)}` : ''}.</h2>
      <p style="margin: 0 0 12px;">
        Merci de vous être inscrit sur Coinlect. Votre compte est prêt.
      </p>
      <p style="margin: 0;">
        <a href="${getAppBaseUrl()}/academy" style="color:#f59e0b; text-decoration: underline;">Découvrir l’Académie</a>
      </p>
    </div>
  `;

  await client.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject,
    html,
  });
}

export async function sendPasswordResetEmail(params: { to: string; resetUrl: string }) {
  const client = getResendClient();
  if (!client) return;

  const subject = 'Réinitialiser votre mot de passe';
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Réinitialisation du mot de passe</h2>
      <p style="margin: 0 0 12px;">
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous.
      </p>
      <p style="margin: 16px 0;">
        <a href="${params.resetUrl}" style="display:inline-block;background:#f59e0b;color:#000;padding:12px 16px;border-radius:10px;font-weight:700;text-decoration:none;">
          Réinitialiser le mot de passe
        </a>
      </p>
      <p style="margin: 0; color:#6b7280; font-size: 13px;">
        Si vous n’êtes pas à l’origine de cette demande, ignorez cet email.
      </p>
    </div>
  `;

  await client.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject,
    html,
  });
}

export function buildResetPasswordUrl(params: { userId: string; token: string }) {
  const base = getAppBaseUrl();
  const url = new URL('/reset-password', base);
  url.searchParams.set('uid', params.userId);
  url.searchParams.set('token', params.token);
  return url.toString();
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

