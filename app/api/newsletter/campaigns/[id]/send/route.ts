import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, requireAdmin } from '@/lib/api';
import { sendCampaignSchema } from '@/lib/validators';
import { CampaignStatus, DeliveryStatus, SubscriptionStatus } from '@prisma/client';
import { sendEmail } from '@/lib/email';

/**
 * Send newsletter campaign (Admin only)
 * Supports test sends to single email or full send to all active subscribers
 * Prevents duplicate sends
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requireAdmin(auth.role);

    const body = await req.json();
    const parsed = sendCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { testEmail } = parsed.data;
    const campaignId = params.id;

    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Prevent duplicate sends
    if (campaign.status === CampaignStatus.SENT && !testEmail) {
      return NextResponse.json(
        { error: 'Campaign has already been sent' },
        { status: 400 }
      );
    }

    // Test send to single email
    if (testEmail) {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/unsubscribe/test-token`;
      
      // Replace all instances of the unsubscribe placeholder (case-insensitive)
      const htmlWithUnsubscribe = campaign.htmlContent
        .replace(/\{\{UNSUBSCRIBE_URL\}\}/gi, unsubscribeUrl)
        .replace(/\{\{unsubscribe_url\}\}/gi, unsubscribeUrl);

      const result = await sendEmail({
        to: testEmail,
        subject: `[TEST] ${campaign.subject}`,
        html: htmlWithUnsubscribe,
        text: campaign.plainTextContent || undefined,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send test email', details: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        message: 'Test email sent successfully',
        messageId: result.messageId,
      });
    }

    // Full send to all active subscribers
    const activeSubscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (activeSubscribers.length === 0) {
      return NextResponse.json(
        { error: 'No active subscribers' },
        { status: 400 }
      );
    }

    // Create send logs for all subscribers
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Optimize: Create subscriber map for O(1) lookup instead of O(n) find
    const subscriberMap = new Map(
      activeSubscribers.map((s) => [s.id, s])
    );

    const sendLogs = await Promise.all(
      activeSubscribers.map((subscriber) =>
        prisma.campaignSendLog.create({
          data: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            status: DeliveryStatus.PENDING,
          },
        })
      )
    );

    // Send emails in batches (to avoid overwhelming the email provider)
    const BATCH_SIZE = 10;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < sendLogs.length; i += BATCH_SIZE) {
      const batch = sendLogs.slice(i, i + BATCH_SIZE);
      
      await Promise.all(
        batch.map(async (log) => {
          const subscriber = subscriberMap.get(log.subscriberId);
          if (!subscriber) {
            console.error(`Subscriber not found for log ${log.id}`);
            return;
          }

          const unsubscribeUrl = `${baseUrl}/unsubscribe/${subscriber.unsubscribeToken}`;
          // Replace all instances of the unsubscribe placeholder (case-insensitive)
          const htmlWithUnsubscribe = campaign.htmlContent
            .replace(/\{\{UNSUBSCRIBE_URL\}\}/gi, unsubscribeUrl)
            .replace(/\{\{unsubscribe_url\}\}/gi, unsubscribeUrl);

          const result = await sendEmail({
            to: subscriber.email,
            subject: campaign.subject,
            html: htmlWithUnsubscribe,
            text: campaign.plainTextContent || undefined,
          });

          if (result.success) {
            await prisma.campaignSendLog.update({
              where: { id: log.id },
              data: {
                status: DeliveryStatus.SENT,
                sentAt: new Date(),
              },
            });
            successCount++;
          } else {
            await prisma.campaignSendLog.update({
              where: { id: log.id },
              data: {
                status: DeliveryStatus.FAILED,
                errorMessage: result.error || 'Unknown error',
              },
            });
            failCount++;
          }
        })
      );

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < sendLogs.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status
    await prisma.newsletterCampaign.update({
      where: { id: campaignId },
      data: {
        status: CampaignStatus.SENT,
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Campaign sent',
      stats: {
        total: sendLogs.length,
        sent: successCount,
        failed: failCount,
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Send campaign error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

