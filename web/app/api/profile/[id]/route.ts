import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// GET /api/profile/[id] — get public profile with listings and reviews
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        tagline: true,
        bio: true,
        role: true,
        occupation: true,
        city: true,
        state: true,
        country: true,
        membershipPlan: true,
        idVerified: true,
        backgroundCheckStatus: true,
        averageRating: true,
        totalSits: true,
        totalReviews: true,
        yearsExperience: true,
        whyHouseSit: true,
        petTypes: true,
        hasCoSitter: true,
        createdAt: true,
        listings: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            title: true,
            city: true,
            state: true,
            country: true,
            startDate: true,
            endDate: true,
            photos: true,
            type: true,
            isPaid: true,
            price: true,
            currency: true,
            currentApplicants: true,
            maxApplications: true,
            pets: {
              select: { type: true, name: true },
            },
          },
          orderBy: { startDate: 'asc' },
          take: 6,
        },
        reviewsReceived: {
          where: { isPublished: true },
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
            listing: {
              select: {
                city: true,
                state: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
    }

    return NextResponse.json({ profile: user }, { headers: corsHeaders() })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders() })
  }
}
