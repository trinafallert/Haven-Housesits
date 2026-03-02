/**
 * Haven Housesits — Stripe Webhook Handler
 *
 * Handles payment lifecycle events from Stripe.
 * All events are signature-verified before processing.
 */

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { verifyStripeWebhook } from '@/lib/security'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = verifyStripeWebhook(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    // Payment captured (sit complete — sitter receives funds)
    case 'payment_intent.amount_capturable_updated': {
      const pi = event.data.object as Stripe.PaymentIntent
      await prisma.payment.updateMany({
        where:  { stripeHoldId: pi.id },
        data:   { status: 'PROCESSING' },
      })
      break
    }

    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      await prisma.payment.updateMany({
        where: { stripeHoldId: pi.id },
        data:  { status: 'RELEASED', releasedAt: new Date() },
      })
      break
    }

    case 'payment_intent.canceled': {
      const pi = event.data.object as Stripe.PaymentIntent
      await prisma.payment.updateMany({
        where: { stripeHoldId: pi.id },
        data:  { status: 'REFUNDED' },
      })
      break
    }

    // Dispute opened — freeze payout, notify team
    case 'charge.dispute.created': {
      const dispute = event.data.object as Stripe.Dispute
      console.error('DISPUTE OPENED:', dispute.id, dispute.amount, dispute.reason)
      // TODO: notify admin, suspend sit if active
      break
    }

    default:
      // Unhandled event type — safe to ignore
      break
  }

  return NextResponse.json({ received: true })
}

// Disable body parsing — we need raw body for signature verification
export const config = { api: { bodyParser: false } }
