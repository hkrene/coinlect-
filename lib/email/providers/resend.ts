/**
 * Resend email provider implementation
 * https://resend.com/docs/api-reference/emails/send-email
 */

import { EmailProvider, SendEmailParams, SendEmailResult } from '../types';

export class ResendEmailProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@coinlect.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Coinlect';

    if (!this.apiKey) {
      console.warn('RESEND_API_KEY not set. Email sending will fail.');
    }
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'RESEND_API_KEY not configured',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: params.from || `${this.fromName} <${this.fromEmail}>`,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

