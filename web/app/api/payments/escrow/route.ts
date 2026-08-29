/**
 * Haven Housesits — Escrow Payment API
 *
 * Rover/Wag-style escrow flow:
 *   POST   /api/payments/escrow        → Create hold (charge card, hold funds)
 *   PATCH  /api/payments/escrow        → Release (sit done → pay sitter) or Cancel (refund)
 *
 * How it works:
 *   1. Owner books a paid sit → card charged immediately, funds held in escrow
 *   2. Sit happens → Haven holds money throughout
 *   3. Sit ends → owner/system marks complete → funds released to sitter within 2 business days
 *   4. If cancelled → full refund to owner automatically
 *
 * Security: Card data never touches Haven servers (Stripe Elements). PCI DSS SAQ A.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit } from '@/lib/security'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'sk_test_placeholder', {
  apiVersion: '2024-06-20',
})

// ─── CREATE ESCROW HOLD ───────────────────────────────────────────────────────
// Called when owner confirms a paid sit booking
// Charges the card immediately but holds (does not capture) the funds
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, 10, 60_000)
  if (limited) return limited

  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const schema = z.object({
    applicationId:   z.string().cuid(),
    paymentMethodId: z.string().startsWith('pm_'),
  })

  const parse = schema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { applicationId, paymentMethodId } = parse.data

  // Load application + listing
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      listing: {
        select: {
          id: true, ownerId: true, dailyRate: true, price: true,
          startDate: true, endDate: true, title: true, isPaid: true,
        },
      },
      sitter: { select: { id: true } },
    },
  })

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  // Only the listing owner can initiate payment
  if (application.listing.ownerId !== (user!.id as string)) {
    return NextResponse.json({ error: 'Only the home owner can initiate payment' }, { status: 403 })
  }

  if (!application.listing.isPaid) {
    return NextResponse.json({ error: 'This is a free exchange sit — no payment required' }, { status: 400 })
  }

  // Calculate total — use dailyRate × days, or flat price
  const rate = application.listing.dailyRate ?? application.listing.price ?? 0
  if (!rate) return NextResponse.json({ error: 'No rate set for this listing' }, { status: 400 })

  const days = Math.max(1, Math.ceil(
    (new Date(application.listing.endDate).getTime() - new Date(application.listing.startDate).getTime())
    / (1000 * 60 * 60 * 24)
  ))
  const subtotalCents   = Math.round(rate * days * 100)
  const platformFee     = Math.round(subtotalCents * 0.08)  // 8% Haven fee
  const totalCents      = subtotalCents + platformFee

  // Check Stripe key is real before trying
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_placeholder')) {
    // No Stripe key yet — store intent in DB as HELD (demo mode)
    const payment = await prisma.payment.create({
      data: {
        applicationId,
        amount:       totalCents / 100,
        platformFee:  platformFee / 100,
        currency:     'USD',
        status:       'HELD',
        type:         'sit_payment',
        description:  `Paid sit: ${application.listing.title}`,
        payerId:      user!.id as string,
        payeeId:      application.sitter.id,
        stripeHoldId: `demo_hold_${applicationId}`,
        heldAt:       new Date(),
      },
    })

    // Mark application as ACCEPTED since owner is paying
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: 'ACCEPTED' },
    })

    return NextResponse.json({
      paymentId: payment.id,
      status: 'held',
      amount: totalCents,
      platformFee,
      message: 'Payment held in escrow (demo mode — add Stripe key to go live)',
    })
  }

  // ── Real Stripe flow ──
  // capture_method: 'manual' = authorise + hold, do NOT capture yet
  const paymentIntent = await stripe.paymentIntents.create({
    amount:               totalCents,
    currency:             'usd',
    payment_method:       paymentMethodId,
    capture_method:       'manual',   // ← funds held, not released to sitter yet
    confirm:              true,
    application_fee_amount: platformFee,
    description:          `Haven Housesits — ${application.listing.title} (${days} days)`,
    metadata: {
      applicationId,
      listingId:    application.listing.id,
      ownerId:      user!.id as string,
      sitterId:     application.sitter.id,
      havenVersion: '1.0',
    },
  })

  const payment = await prisma.payment.create({
    data: {
      applicationId,
      amount:       totalCents / 100,
      platformFee:  platformFee / 100,
      currency:     'USD',
      status:       'HELD',
      type:         'sit_payment',
      description:  `Paid sit: ${application.listing.title}`,
      payerId:      user!.id as string,
      payeeId:      application.sitter.id,
      stripeHoldId: paymentIntent.id,
      heldAt:       new Date(),
    },
  })

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: 'ACCEPTED' },
  })

  return NextResponse.json({
    paymentId:    payment.id,
    clientSecret: paymentIntent.client_secret,
    status:       paymentIntent.status,
    amount:       totalCents,
    platformFee,
  })
}

// ─── RELEASE OR CANCEL ESCROW ─────────────────────────────────────────────────
// PATCH { action: 'release' | 'cancel', paymentId }
// release → sit complete, capture funds → sitter gets paid in 2 business days
// cancel  → sit cancelled, void hold → full refund to owner
export async function PATCH(req: NextRequest) {
  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const schema = z.object({
    paymentId: z.string().cuid(),
    action:    z.enum(['release', 'cancel']),
  })

  const parse = schema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { paymentId, action } = parse.data

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      payer: { select: { id: true } },
      payee: { select: { id: true } },
    },
  })

  if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  if (payment.status !== 'HELD') {
    return NextResponse.json({ error: `Payment is already ${payment.status}` }, { status: 400 })
  }

  // Only payer (owner) or payee (sitter) can trigger this
  const uid = user!.id as string
  if (payment.payerId !== uid && payment.payeeId !== uid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Demo mode — no Stripe key
  const demoMode = !process.env.STRIPE_SECRET_KEY || payment.stripeHoldId?.startsWith('demo_hold_')
  if (demoMode) {
    const updated = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status:      action === 'release' ? 'RELEASED' : 'REFUNDED',
        releasedAt:  action === 'release' ? new Date() : undefined,
      },
    })
    return NextResponse.json({ payment: updated, action })
  }

  // ── Real Stripe ──
  if (action === 'release') {
    await stripe.paymentIntents.capture(payment.stripeHoldId!)
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'RELEASED', releasedAt: new Date() },
    })
  } else {
    await stripe.paymentIntents.cancel(payment.stripeHoldId!)
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'REFUNDED' },
    })
  }

  return NextResponse.json({ success: true, action })
}
