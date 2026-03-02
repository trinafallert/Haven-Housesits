import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit, sanitizeText } from '@/lib/security'

const CreateReviewSchema = z.object({
  applicationId:  z.string().cuid(),
  rating:         z.number().int().min(1).max(5),
  communication:  z.number().int().min(1).max(5),
  accuracy:       z.number().int().min(1).max(5),
  welcome:        z.number().int().min(1).max(5),
  pets:           z.number().int().min(1).max(5),
  comment:        z.string().max(1000).optional(),
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

  const parse = CreateReviewSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { applicationId, rating, communication, accuracy, welcome, pets, comment } = parse.data

  // Load application to verify caller is a participant
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      listing: { select: { ownerId: true } },
      sitter:  { select: { id: true } },
    },
  })

  if (!application) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

  const isSitter = application.sitter.id === (user!.id as string)
  const isOwner  = application.listing.ownerId === (user!.id as string)
  if (!isSitter && !isOwner) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Check for duplicate
  const existing = await prisma.review.findFirst({
    where: { applicationId, reviewerId: user!.id as string },
  })
  if (existing) return NextResponse.json({ error: 'You have already reviewed this sit' }, { status: 409 })

  /**
   * Blind review system:
   * Reviews are stored as isPublished=false.
   * A background job publishes them when both parties have reviewed
   * OR 14 days have passed since the sit ended.
   */
  const review = await prisma.review.create({
    data: {
      applicationId,
      reviewerId:   user!.id as string,
      revieweeId:   isSitter ? application.listing.ownerId : application.sitter.id,
      rating,
      communication,
      accuracy,
      welcome,
      pets,
      comment: comment ? sanitizeText(comment, 1000) : undefined,
      isPublished: false,   // blind review — held until counterpart reviews
    },
  })

  // Check if both parties have now reviewed → publish both
  const allReviews = await prisma.review.findMany({ where: { applicationId } })
  if (allReviews.length === 2) {
    await prisma.review.updateMany({
      where: { applicationId },
      data:  { isPublished: true },
    })
    // Recalculate averageRating for both users
    for (const r of allReviews) {
      const agg = await prisma.review.aggregate({
        where:   { revieweeId: r.revieweeId, isPublished: true },
        _avg:    { rating: true },
        _count:  { rating: true },
      })
      await prisma.user.update({
        where: { id: r.revieweeId },
        data:  {
          averageRating: agg._avg.rating ?? 0,
          totalReviews:  agg._count.rating,
        },
      })
    }
  }

  return NextResponse.json({ review: { id: review.id, isPublished: review.isPublished } }, { status: 201 })
}
