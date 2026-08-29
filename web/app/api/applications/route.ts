import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit, sanitizeText } from '@/lib/security'

const CreateApplicationSchema = z.object({
  listingId: z.string().cuid(),
  message:   z.string().min(50).max(1000),
})

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, 20, 60_000)
  if (limited) return limited

  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parse = CreateApplicationSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { listingId, message } = parse.data

  // Load listing
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { _count: { select: { applications: true } } },
  })

  if (!listing || listing.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Listing not found or no longer active' }, { status: 404 })
  }

  // Can't apply to own listing
  if (listing.ownerId === (user!.id as string)) {
    return NextResponse.json({ error: 'You cannot apply to your own listing' }, { status: 400 })
  }

  // Check max applications cap (Haven default: 7)
  // Count only non-declined apps — when owner declines one, a new slot opens
  const activeApplicationCount = await prisma.application.count({
    where: { listingId, status: { not: 'DECLINED' } },
  })
  const cap = listing.maxApplications
  if (activeApplicationCount >= cap) {
    return NextResponse.json({ error: 'This listing has reached its maximum applications' }, { status: 400 })
  }

  // Check for duplicate
  const existing = await prisma.application.findFirst({
    where: { listingId, sitterId: user!.id as string },
  })
  if (existing) return NextResponse.json({ error: 'You have already applied to this listing' }, { status: 409 })

  // Free plan users: max 3 applications/month
  const userRecord = await prisma.user.findUnique({ where: { id: user!.id as string } })
  if (userRecord?.membershipPlan === 'FREE_TRIAL') {
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const monthlyCount = await prisma.application.count({
      where: { sitterId: user!.id as string, createdAt: { gte: monthStart } },
    })
    if (monthlyCount >= 3) {
      return NextResponse.json({
        error: 'Free plan members can send 3 applications per month. Upgrade to Standard or Premium for unlimited applications.',
        upgradeRequired: true,
      }, { status: 403 })
    }
  }

  const application = await prisma.application.create({
    data: {
      listingId,
      sitterId: user!.id as string,
      message: sanitizeText(message, 1000),
      status: 'PENDING',
    },
  })

  // Create a conversation thread
  const conversation = await prisma.conversation.create({
    data: {
      applicationId: application.id,
      participants: {
        createMany: {
          data: [
            { userId: user!.id as string },
            { userId: listing.ownerId },
          ],
        },
      },
    },
  })

  return NextResponse.json({ application, conversationId: conversation.id }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req)
  if (error) return error

  const { searchParams } = req.nextUrl
  const status = searchParams.get('status') ?? undefined
  const role   = searchParams.get('role') ?? 'sitter'

  const where = role === 'owner'
    ? { listing: { ownerId: user!.id as string }, ...(status ? { status } : {}) }
    : { sitterId: user!.id as string, ...(status ? { status } : {}) }

  const applications = await prisma.application.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        select: {
          id: true, title: true, city: true, state: true,
          startDate: true, endDate: true,
          photos: true,
          pets: { select: { type: true, name: true } },
        },
      },
      sitter: { select: { id: true, firstName: true, lastName: true, avatar: true, averageRating: true } },
    },
  })

  return NextResponse.json({ applications })
}
