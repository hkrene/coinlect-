/**
 * Email provider abstraction types
 * Supports multiple email providers (SendGrid, Resend, Amazon SES)
 * Provider selection via environment configuration
 */

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  fromName?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export type EmailProviderType = 'sendgrid' | 'resend' | 'ses' | 'console';

