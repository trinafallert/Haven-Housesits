/**
 * Haven Housesits — Escrow Payment API
 *
 * Flow:
 *   1. Owner applies → POST /api/payments/escrow/create
 *      Creates a Stripe PaymentIntent in "manual" capture mode (= funds held, not yet captured)
 *
 *   2. Sit completes → POST /api/payments/escrow/release
 *      Captures the PaymentIntent → funds move to sitter's Stripe Connect account
 *
 *   3. If sit is cancelled → POST /api/payments/escrow/cancel
 *      Cancels the PaymentIntent → full refund to owner
 *
 * Security:
 *   - Card data NEVER touches Haven servers (Stripe Elements handles it)
 *   - We store only the PaymentIntent ID and status
 *   - All Stripe webhook events are signature-verified
 *   - PCI DSS SAQ A compliant
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit } from '@/lib/security'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// ─── CREATE ESCROW (hold funds) ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, 20, 60_000)
  if (limited) return limited

  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const schema = z.object({
    applicationId: z.string().cuid(),
    paymentMethodId: z.string().startsWith('pm_'),
  })

  const parse = schema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { applicationId, paymentMethodId } = parse.data

  // Load application + listing
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      listing: { select: { ownerId: true, dailyRate: true, startDate: true, endDate: true, title: true } },
    },
  })

  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  if (application.listing.ownerId !== (user!.id as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { listing } = application
  if (!listing.dailyRate) return NextResponse.json({ error: 'This is not a paid sit' }, { status: 400 })

  const days = Math.ceil(
    (new Date(listing.endDate).getTime() - new Date(listing.startDate).getTime()) / (1000 * 60 * 60 * 24)
  )
  const totalCents = Math.round(listing.dailyRate * days * 100)
  const platformFeeCents = Math.round(totalCents * 0.08)  // 8% Haven fee

  // Create PaymentIntent with manual capture (= escrow hold)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: 'usd',
    payment_method: paymentMethodId,
    capture_method: 'manual',           // ← key: authorised but not captured
    confirm: true,
    application_fee_amount: platformFeeCents,
    metadata: {
      applicationId,
      listingTitle: listing.title,
      havenUserId: user!.id as string,
    },
  })

  // Store in DB
  await prisma.payment.create({
    data: {
      applicationId,
      amount: totalCents / 100,
      platformFee: platformFeeCents / 100,
      currency: 'USD',
      status: 'HELD',
      stripeHoldId: paymentIntent.id,
      heldAt: new Date(),
    },
  })

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
    amount: totalCents,
    platformFee: platformFeeCents,
  })
}
