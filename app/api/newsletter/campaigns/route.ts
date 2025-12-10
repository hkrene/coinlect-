import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, requireAdmin } from '@/lib/api';
import { campaignSchema, updateCampaignSchema } from '@/lib/validators';
import { CampaignStatus } from '@prisma/client';

/**
 * Create a new newsletter campaign (Admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requireAdmin(auth.role);

    const body = await req.json();
    const parsed = campaignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, subject, htmlContent, plainTextContent, scheduledAt } =
      parsed.data;

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        title,
        subject,
        htmlContent,
        plainTextContent: plainTextContent || null,
        status: scheduledAt
          ? CampaignStatus.SCHEDULED
          : CampaignStatus.DRAFT,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('Create campaign error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * List all campaigns (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    requireAdmin(auth.role);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [campaigns, total] = await Promise.all([
      prisma.newsletterCampaign.findMany({
        where,
        include: {
          _count: {
            select: {
              sendLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.newsletterCampaign.count({ where }),
    ]);

    // Get analytics for each campaign
    const campaignsWithStats = await Promise.all(
      campaigns.map(async (campaign) => {
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

        return {
          ...campaign,
          stats: {
            sent,
            delivered,
            opened,
            failed: sent - delivered,
          },
        };
      })
    );

    return NextResponse.json({
      campaigns: campaignsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('List campaigns error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

