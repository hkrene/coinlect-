import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Optional: configure an external Lightning invoice service (LNbits, BTCPay, etc.)
// These environment variables are intentionally generic so you can plug in
// your preferred Lightning backend without changing the rest of the code.
const LIGHTNING_INVOICE_URL = process.env.LIGHTNING_INVOICE_URL;
const LIGHTNING_API_KEY = process.env.LIGHTNING_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const rawAmount =
      typeof body.amountSats === 'number'
        ? body.amountSats
        : typeof body.amount === 'number'
        ? body.amount
        : parseInt(body.amountSats || body.amount || '0', 10);

    const amountSats = Number.isFinite(rawAmount) ? Math.floor(rawAmount) : 0;

    if (!amountSats || amountSats <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Please provide amountSats > 0.' },
        { status: 400 }
      );
    }

    const memo =
      typeof body.memo === 'string' && body.memo.trim().length > 0
        ? body.memo.trim()
        : 'CoinLect Lightning donation';

    // Create a pending Donation record first so we can attach external references.
    const donation = await prisma.donation.create({
      data: {
        method: 'LIGHTNING',
        status: 'PENDING',
        amountSats,
        currency: 'SATS',
        metadata: body.metadata ?? {},
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

// Optional callback / update endpoint.
// This is designed to be called either by your Lightning backend (webhook)
// or by the frontend after a successful WebLN payment.
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const donationId = typeof body.donationId === 'string' ? body.donationId : '';
    const statusRaw = typeof body.status === 'string' ? body.status.toUpperCase() : '';

    if (!donationId || !statusRaw) {
      return NextResponse.json(
        { error: 'donationId and status are required' },
        { status: 400 }
      );
    }

    const allowed = ['PENDING', 'CONFIRMED', 'FAILED'];
    if (!allowed.includes(statusRaw)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const amountSats =
      typeof body.amountSats === 'number'
        ? Math.floor(body.amountSats)
        : undefined;

    const reference =
      typeof body.reference === 'string' && body.reference.trim().length > 0
        ? body.reference.trim()
        : undefined;

    const updated = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status: statusRaw as any,
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

