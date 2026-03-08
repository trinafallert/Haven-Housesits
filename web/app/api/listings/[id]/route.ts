import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// GET /api/listings/[id] — get single listing with full details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            tagline: true,
            bio: true,
            averageRating: true,
            totalSits: true,
            totalReviews: true,
            idVerified: true,
            backgroundCheckStatus: true,
            membershipPlan: true,
            city: true,
            state: true,
            country: true,
            occupation: true,
            createdAt: true,
          },
        },
        pets: true,
        _count: {
          select: { applications: true },
        },
        reviews: {
          where: { isPublished: true },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                averageRating: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
    }

    return NextResponse.json({ listing }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders() })
  }
}
