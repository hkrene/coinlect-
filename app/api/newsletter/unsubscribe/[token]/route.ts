import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionStatus } from '@prisma/client';

/**
 * Public unsubscribe endpoint (no auth required)
 * Uses secure tokenized unsubscribe link
 * Idempotent - safe to call multiple times
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { error: 'Unsubscribe token required' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
    });

    if (!subscriber) {
      // Return success even if not found (security best practice)
      return NextResponse.json({
        message: 'Unsubscribed successfully',
        alreadyUnsubscribed: true,
      });
    }

    // Idempotent - check if already unsubscribed
    if (subscriber.status === SubscriptionStatus.UNSUBSCRIBED) {
      return NextResponse.json({
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true,
      });
    }

    // Unsubscribe
    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        status: SubscriptionStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Successfully unsubscribed',
      email: subscriber.email,
    });
  } catch (err) {
    console.error('Unsubscribe error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for unsubscribe confirmation page
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { unsubscribeToken: token },
      select: {
        email: true,
        status: true,
      },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid unsubscribe link' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: subscriber.email,
      alreadyUnsubscribed: subscriber.status === SubscriptionStatus.UNSUBSCRIBED,
    });
  } catch (err) {
    console.error('Get unsubscribe info error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

