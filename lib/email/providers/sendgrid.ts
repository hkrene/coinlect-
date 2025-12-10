/**
 * SendGrid email provider implementation
 * https://docs.sendgrid.com/api-reference/mail-send/mail-send
 */

import { EmailProvider, SendEmailParams, SendEmailResult } from '../types';

export class SendGridEmailProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@coinlect.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'Coinlect';

    if (!this.apiKey) {
      console.warn('SENDGRID_API_KEY not set. Email sending will fail.');
    }
  }

  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: 'SENDGRID_API_KEY not configured',
      };
    }

    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: params.to }],
              subject: params.subject,
            },
          ],
          from: {
            email: params.from || this.fromEmail,
            name: params.fromName || this.fromName,
          },
          content: [
            {
              type: 'text/html',
              value: params.html,
            },
            ...(params.text
              ? [
                  {
                    type: 'text/plain',
                    value: params.text,
                  },
                ]
              : []),
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: errorText || 'Failed to send email',
        };
      }

      // SendGrid returns 202 Accepted with no body on success
      const messageId = response.headers.get('x-message-id') || `sg-${Date.now()}`;

      return {
        success: true,
        messageId,
      };
    } catch (error) {
      console.error('SendGrid email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

