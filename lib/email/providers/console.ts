/**
 * Console email provider - for development/testing
 * Logs emails to console instead of sending
 */

import { EmailProvider, SendEmailParams, SendEmailResult } from '../types';

export class ConsoleEmailProvider implements EmailProvider {
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    console.log('📧 [Console Email Provider]');
    console.log('To:', params.to);
    console.log('Subject:', params.subject);
    console.log('From:', params.from || 'noreply@coinlect.com');
    console.log('HTML Content:', params.html.substring(0, 200) + '...');
    if (params.text) {
      console.log('Text Content:', params.text.substring(0, 200) + '...');
    }
    console.log('---');

    return {
      success: true,
      messageId: `console-${Date.now()}`,
    };
  }
}

