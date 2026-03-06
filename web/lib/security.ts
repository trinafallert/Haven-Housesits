/**
 * Haven Housesits — Security utilities
 *
 * Payment card data NEVER touches our servers.
 * All card tokenisation happens inside Stripe's iframe (Stripe Elements/Stripe.js).
 * We store only a Stripe PaymentIntent / PaymentMethod ID.
 *
 * PCI DSS scope: SAQ A (no cardholder data on our servers → minimal audit burden).
 */

import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { rateLimit } from '@/lib/rate-limit'
import crypto from 'crypto'

// ─── Auth guard ────────────────────────────────────────────────────────────────

export async function requireAuth(req: NextRequest) {
  // 1. Try standard NextAuth JWT cookie (web)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (token) return { error: null, user: token }

  // 2. Try Bearer token (mobile apps)
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7)
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(bearerToken, process.env.NEXTAUTH_SECRET!) as any
      return { error: null, user: decoded }
    } catch {
      // fall through to 401
    }
  }

  return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null }
}

// ─── CORS headers for mobile ──────────────────────────────────────────────────
export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export function handleCors(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: corsHeaders() })
  }
  return null
}

// ─── Rate limiting ─────────────────────────────────────────────────────────────

export async function withRateLimit(req: NextRequest, limit = 30, windowMs = 60_000) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  const allowed = await rateLimit(ip, limit, windowMs)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  return null
}

// ─── Input sanitization ────────────────────────────────────────────────────────

/**
 * Strip HTML tags and limit string length to prevent XSS / excessively long inputs.
 */
export function sanitizeText(input: string, maxLength = 5000): string {
  return input
    .replace(/<[^>]*>/g, '')      // strip HTML
    .replace(/[<>'"]/g, '')       // strip dangerous chars
    .trim()
    .slice(0, maxLength)
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T, maxLength = 5000): T {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k,
      typeof v === 'string' ? sanitizeText(v, maxLength) : v,
    ])
  ) as T
}

// ─── CSRF helpers ──────────────────────────────────────────────────────────────

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// ─── Stripe webhook signature verification ────────────────────────────────────

export function verifyStripeWebhook(body: string, signature: string, secret: string) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  return stripe.webhooks.constructEvent(body, signature, secret)
}

// ─── Security headers (applied in middleware) ──────────────────────────────────

export const SECURITY_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.stripe.com https://*.pusher.com wss://*.pusher.com",
    "frame-src https://js.stripe.com https://hooks.stripe.com",
  ].join('; '),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
}

// ─── PII masking (for logs) ────────────────────────────────────────────────────

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 2)}***@${domain}`
}

export function maskCard(last4: string): string {
  return `•••• •••• •••• ${last4}`
}
