import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, requireAdmin } from '@/lib/api';
import { updateCampaignSchema } from '@/lib/validators';
import { CampaignStatus } from '@prisma/client';

/**
 * Get campaign by ID (Admin only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requireAdmin(auth.role);

    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            sendLogs: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Get analytics
    const [sent, delivered, opened] = await Promise.all([
      prisma.campaignSendLog.count({
        where: { campaignId: campaign.id },
      }),
      prisma.campaignSendLog.count({
        where: {
          campaignId: campaign.id,
          status: 'SENT',
        },
      }),
      prisma.campaignSendLog.count({
        where: {
          campaignId: campaign.id,
          openedAt: { not: null },
        },
      }),
    ]);

    return NextResponse.json({
      campaign: {
        ...campaign,
        stats: {
          sent,
          delivered,
          opened,
          failed: sent - delivered,
        },
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Get campaign error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Update campaign (Admin only)
 */
export async function PATCH(
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
    const parsed = updateCampaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data: any = {};
    if (parsed.data.title) data.title = parsed.data.title;
    if (parsed.data.subject) data.subject = parsed.data.subject;
    if (parsed.data.htmlContent) data.htmlContent = parsed.data.htmlContent;
    if (parsed.data.plainTextContent !== undefined)
      data.plainTextContent = parsed.data.plainTextContent;
    if (parsed.data.scheduledAt) {
      data.scheduledAt = new Date(parsed.data.scheduledAt);
      data.status = CampaignStatus.SCHEDULED;
    }

    const campaign = await prisma.newsletterCampaign.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ campaign });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (err instanceof Error && err.message.includes('not found')) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    console.error('Update campaign error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Delete campaign (Admin only)
 * Only allows deletion of DRAFT campaigns
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requireAdmin(auth.role);

    const campaign = await prisma.newsletterCampaign.findUnique({
      where: { id: params.id },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    if (campaign.status === CampaignStatus.SENT) {
      return NextResponse.json(
        { error: 'Cannot delete sent campaigns' },
        { status: 400 }
      );
    }

    await prisma.newsletterCampaign.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Campaign deleted' });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Delete campaign error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

