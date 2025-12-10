/**
 * Email provider factory and main export
 * Selects provider based on EMAIL_PROVIDER environment variable
 * Defaults to 'console' for development
 */

import { EmailProvider, EmailProviderType } from './types';
import { ConsoleEmailProvider } from './providers/console';
import { ResendEmailProvider } from './providers/resend';
import { SendGridEmailProvider } from './providers/sendgrid';
import { SESEmailProvider } from './providers/ses';

let providerInstance: EmailProvider | null = null;

function getEmailProvider(): EmailProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const providerType: EmailProviderType =
    (process.env.EMAIL_PROVIDER as EmailProviderType) || 'console';

  switch (providerType) {
    case 'resend':
      providerInstance = new ResendEmailProvider();
      break;
    case 'sendgrid':
      providerInstance = new SendGridEmailProvider();
      break;
    case 'ses':
      providerInstance = new SESEmailProvider();
      break;
    case 'console':
    default:
      providerInstance = new ConsoleEmailProvider();
      break;
  }

  return providerInstance;
}

/**
 * Send an email using the configured provider
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
}) {
  const provider = getEmailProvider();
  return provider.sendEmail(params);
}

export { EmailProvider, EmailProviderType } from './types';

