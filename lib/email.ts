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
  // Resend requires a verified sender domain for production.
  // Using the verified domain: mail.coinlect.org
  return process.env.RESEND_FROM || 'Coinlect <hello@mail.coinlect.org>';
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

// export async function sendWelcomeEmail(params: { to: string; name?: string | null }) {
//   const client = getResendClient();
//   if (!client) return;

//   const subject = 'Bienvenue sur Coinlect';
//   const html = `
//     <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; line-height: 1.6;">
//       <h2 style="margin: 0 0 12px;">Bienvenue${params.name ? `, ${escapeHtml(params.name)}` : ''}.</h2>
//       <p style="margin: 0 0 12px;">
//         Merci de vous être inscrit sur Coinlect. Votre compte est prêt.
//       </p>
//       <p style="margin: 0;">
//         <a href="${getAppBaseUrl()}/academy" style="color:#f59e0b; text-decoration: underline;">Découvrir l’Académie</a>
//       </p>
//     </div>
//   `;

//   await client.emails.send({
//     from: getFromAddress(),
//     to: params.to,
//     subject,
//     html,
//   });
// }

export async function sendWelcomeEmail(params: { 
  to: string; 
  name?: string | null;
  language?: 'fr' | 'en'; 
}) {
  const client = getResendClient();
  if (!client) return;

  const lang = params.language || 'fr'; // Default to French
  const logoUrl = 'https://res.cloudinary.com/drsd8adkq/image/upload/v1767997893/coinlect-0_denz8g-removebg-preview_kwnhri.png';
  
  // Detects current year automatically
  const currentYear = new Date().getFullYear();

  // Dictionary for Internationalization (i18n)
  const content = {
    fr: {
      subject: 'Bienvenue sur Coinlect',
      greeting: `Bienvenue${params.name ? `, ${escapeHtml(params.name)}` : ''} !`,
      body: 'Nous sommes ravis de vous compter parmi nous. Votre compte Coinlect est désormais actif et prêt à être utilisé.',
      button: 'Découvrir l’Académie',
      ignore: "Si vous n'avez pas créé ce compte, vous pouvez ignorer cet e-mail.",
      rights: 'Tous droits réservés.'
    },
    en: {
      subject: 'Welcome to Coinlect',
      greeting: `Welcome${params.name ? `, ${escapeHtml(params.name)}` : ''}!`,
      body: "We're excited to have you on board. Your Coinlect account is now active and ready for use.",
      button: 'Explore the Academy',
      ignore: "If you didn't create this account, you can safely ignore this email.",
      rights: 'All rights reserved.'
    }
  };

  const t = content[lang];

  const html = `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <div style="padding: 35px 30px; text-align: center;">
          <img src="${logoUrl}" alt="Coinlect" style="width: 150px; height: auto; display: block; margin: 0 auto;" />
        </div>

        <div style="padding: 0 40px 40px; text-align: center;">
          <h2 style="color: #111827; font-size: 26px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em;">
            ${t.greeting}
          </h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin-bottom: 35px; font-weight: 300;">
            ${t.body}
          </p>
          
          <div style="margin-bottom: 35px;">
            <a href="${getAppBaseUrl()}/academy" 
               style="background-color: #f59e0b; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);">
              ${t.button}
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 13px; font-style: italic;">
            ${t.ignore}
          </p>
        </div>

        <div style="padding: 25px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500; letter-spacing: 0.05em; uppercase;">
            &copy; ${currentYear} COINLECT. ${t.rights}
          </p>
        </div>
      </div>
    </div>
  `;

  await client.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: t.subject,
    html,
  });
}

export async function sendPasswordResetEmail(params: { 
  to: string; 
  resetUrl: string;
  language?: 'fr' | 'en';
}) {
  const client = getResendClient();
  if (!client) return;

  const lang = params.language || 'fr';
  const logoUrl = 'https://res.cloudinary.com/drsd8adkq/image/upload/v1767997893/coinlect-0_denz8g-removebg-preview_kwnhri.png';
  const currentYear = new Date().getFullYear();

  const content = {
    fr: {
      subject: 'Réinitialiser votre mot de passe',
      title: 'Réinitialisation du mot de passe',
      body: 'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer.',
      button: 'Réinitialiser le mot de passe',
      ignore: 'Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.',
      rights: 'Tous droits réservés.'
    },
    en: {
      subject: 'Reset your password',
      title: 'Password Reset',
      body: 'You requested to reset your password. Click the button below to proceed.',
      button: 'Reset Password',
      ignore: "If you didn't request this, you can safely ignore this email.",
      rights: 'All rights reserved.'
    }
  };

  const t = content[lang];

  const html = `
    <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <div style="padding: 35px 30px; text-align: center;">
          <img src="${logoUrl}" alt="Coinlect" style="width: 150px; height: auto; display: block; margin: 0 auto;" />
        </div>

        <div style="padding: 0 40px 40px; text-align: center;">
          <h2 style="color: #111827; font-size: 26px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.02em;">
            ${t.title}
          </h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 26px; margin-bottom: 35px; font-weight: 300;">
            ${t.body}
          </p>
          
          <div style="margin-bottom: 35px;">
            <a href="${params.resetUrl}" 
               style="background-color: #f59e0b; color: #ffffff; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);">
              ${t.button}
            </a>
          </div>

          <p style="color: #9ca3af; font-size: 13px; font-style: italic;">
            ${t.ignore}
          </p>
        </div>

        <div style="padding: 25px; background-color: #f3f4f6; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500; letter-spacing: 0.05em; uppercase;">
            &copy; ${currentYear} COINLECT. ${t.rights}
          </p>
        </div>
      </div>
    </div>
  `;

  await client.emails.send({
    from: getFromAddress(),
    to: params.to,
    subject: t.subject,
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

