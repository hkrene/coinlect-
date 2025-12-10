import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subscribeSchema } from '@/lib/validators';
import { randomUUID } from 'crypto';

/**
 * Public endpoint for newsletter subscription
 * Supports both email-only and user-linked subscriptions
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, source = 'WEBSITE', userId } = parsed.data;

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      // If unsubscribed, reactivate
      if (existing.status === 'UNSUBSCRIBED') {
        const updated = await prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: {
            status: 'ACTIVE',
            source: source as any,
            userId: userId || existing.userId,
            unsubscribedAt: null,
            unsubscribeToken: randomUUID(), // Generate new token for security
          },
        });

        return NextResponse.json({
          message: 'Successfully resubscribed',
          subscriber: {
            id: updated.id,
            email: updated.email,
            status: updated.status,
          },
        });
      }

      // Already active
      return NextResponse.json(
        { message: 'Already subscribed', subscriber: { email: existing.email } },
        { status: 200 }
      );
    }

    // Create new subscription
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        status: 'ACTIVE',
        source: source as any,
        userId: userId || null,
        unsubscribeToken: randomUUID(),
      },
    });

    return NextResponse.json({
      message: 'Successfully subscribed',
      subscriber: {
        id: subscriber.id,
        email: subscriber.email,
        status: subscriber.status,
      },
    });
  } catch (err) {
    console.error('Subscribe error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

