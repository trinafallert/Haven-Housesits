import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit } from '@/lib/security'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const TipSchema = z.object({
  applicationId:  z.string().cuid(),
  amount:         z.number().int().min(1).max(500), // $1–$500
  paymentMethodId: z.string().startsWith('pm_'),
})

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, 10, 60_000)
  if (limited) return limited

  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parse = TipSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { applicationId, amount, paymentMethodId } = parse.data

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      listing: { select: { ownerId: true } },
      sitter:  { select: { id: true, stripeAccountId: true } },
    },
  })

  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  if (application.listing.ownerId !== (user!.id as string)) {
    return NextResponse.json({ error: 'Only the home owner can send a tip' }, { status: 403 })
  }

  const amountCents = amount * 100

  /**
   * Tip is a direct payment to sitter's Stripe Connect account.
   * Haven takes 0% of tips (100% goes to sitter).
   * This is a key differentiator vs platforms that take a % of tips.
   */
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: true,
    // If sitter has Connect account, transfer directly
    ...(application.sitter.stripeAccountId
      ? {
          transfer_data: {
            destination: application.sitter.stripeAccountId,
          },
        }
      : {}),
    metadata: {
      type: 'tip',
      applicationId,
      fromUserId: user!.id as string,
      toUserId: application.sitter.id,
    },
    description: `Haven tip for sit #${applicationId}`,
  })

  // Record tip
  await prisma.payment.create({
    data: {
      applicationId,
      amount,
      platformFee: 0,   // 100% goes to sitter
      currency: 'USD',
      status: 'RELEASED',
      stripeHoldId: paymentIntent.id,
      heldAt: new Date(),
      releasedAt: new Date(),
      isTip: true,
    },
  })

  return NextResponse.json({ success: true, amount }, { status: 201 })
}
