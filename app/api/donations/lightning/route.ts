import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import crypto from 'crypto';
import { getAuthUser } from '@/lib/auth-utils';
import { lightningDonationSchema, donationStatusUpdateSchema } from '@/lib/validators';
import { enforceRateLimit } from '@/lib/rate-limit';

// Optional: configure an external Lightning invoice service (LNbits, BTCPay, etc.)
// These environment variables are intentionally generic so you can plug in
// your preferred Lightning backend without changing the rest of the code.
const LIGHTNING_INVOICE_URL = process.env.LIGHTNING_INVOICE_URL;
const LIGHTNING_API_KEY = process.env.LIGHTNING_API_KEY;

const MAX_METADATA_BYTES = 5000;

export async function POST(req: NextRequest) {
  // Public endpoint: throttle to avoid donation-record flooding.
  const limited = enforceRateLimit(req, 'lightning-donation', 10, 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));

    // Accept either `amountSats` or the legacy `amount` field.
    const parsed = lightningDonationSchema.safeParse({
      amountSats: body.amountSats ?? body.amount,
      memo: body.memo,
      metadata: body.metadata,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid amount. Please provide amountSats > 0.' },
        { status: 400 }
      );
    }

    const { amountSats } = parsed.data;
    const memo = parsed.data.memo || 'CoinLect Lightning donation';
    const metadata = parsed.data.metadata ?? {};

    if (JSON.stringify(metadata).length > MAX_METADATA_BYTES) {
      return NextResponse.json({ error: 'Metadata is too large' }, { status: 400 });
    }

    // Create a pending Donation record first so we can attach external references.
    const donation = await prisma.donation.create({
      data: {
        method: 'LIGHTNING',
        status: 'PENDING',
        amountSats,
        currency: 'SATS',
        metadata,
      },
    });

    let invoice: string | null = null;
    let paymentHash: string | null = null;

    // If a Lightning backend is configured, ask it to generate a Bolt11 invoice.
    if (LIGHTNING_INVOICE_URL && LIGHTNING_API_KEY) {
      try {
        const lnRes = await fetch(LIGHTNING_INVOICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LIGHTNING_API_KEY}`,
          },
          body: JSON.stringify({
            amount: amountSats,
            memo,
            externalId: donation.id,
          }),
        });

        if (!lnRes.ok) {
          const text = await lnRes.text();
          console.error('Lightning invoice API error', text);
        } else {
          const lnJson = await lnRes.json();
          invoice =
            lnJson.payment_request ||
            lnJson.bolt11 ||
            lnJson.invoice ||
            null;
          paymentHash =
            lnJson.payment_hash ||
            lnJson.r_hash ||
            lnJson.paymentHash ||
            null;
        }
      } catch (err) {
        console.error('Error calling Lightning backend', err);
      }
    }

    const updated = await prisma.donation.update({
      where: { id: donation.id },
      data: {
        lightningInvoice: invoice,
        lightningPaymentHash: paymentHash ?? undefined,
      },
    });

    return NextResponse.json(
      {
        donationId: updated.id,
        invoice: updated.lightningInvoice,
        paymentHash: updated.lightningPaymentHash,
        // Helpful message if the Lightning backend has not been wired yet.
        message:
          updated.lightningInvoice ||
          'Donation created. Configure LIGHTNING_INVOICE_URL and LIGHTNING_API_KEY to return a real Bolt11 invoice.',
      },
      { status: updated.lightningInvoice ? 200 : 202 }
    );
  } catch (err) {
    console.error('Create Lightning invoice error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * Authorization for updating a donation's status.
 * Only an authenticated admin or a caller presenting the configured
 * `x-webhook-secret` (your Lightning backend) may confirm/fail a donation.
 */
async function isAuthorizedUpdate(req: NextRequest): Promise<boolean> {
  const auth = await getAuthUser(req);
  if (auth?.role === UserRole.ADMIN) return true;

  const configured = process.env.LIGHTNING_WEBHOOK_SECRET;
  const provided = req.headers.get('x-webhook-secret') || '';
  if (configured && provided.length === configured.length) {
    return crypto.timingSafeEqual(Buffer.from(configured), Buffer.from(provided));
  }
  return false;
}

// Optional callback / update endpoint.
// This must only be called by your Lightning backend (webhook) or an admin.
export async function PUT(req: NextRequest) {
  if (!(await isAuthorizedUpdate(req))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const limited = enforceRateLimit(req, 'donation-status-update', 60, 60 * 1000);
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const parsed = donationStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'donationId and a valid status are required' },
        { status: 400 }
      );
    }

    const { donationId, status, amountSats, reference } = parsed.data;

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status,
        amountSats: amountSats ?? undefined,
        reference,
      },
    });

    return NextResponse.json({ success: true, donation: updated });
  } catch (err) {
    console.error('Update Lightning donation error', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
