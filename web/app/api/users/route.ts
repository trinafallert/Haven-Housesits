import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// GET /api/users — list sitters (public fields only, no passwords)
export async function GET(req: NextRequest) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { searchParams } = req.nextUrl
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12')))
  const skip = (page - 1) * limit

  try {
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            in: ['SITTER', 'BOTH'],
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          tagline: true,
          bio: true,
          role: true,
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
          petTypes: true,
          createdAt: true,
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalSits: 'desc' },
        ],
        skip,
        take: limit,
      }),
      prisma.user.count({
        where: {
          role: {
            in: ['SITTER', 'BOTH'],
          },
        },
      }),
    ])

    return NextResponse.json(
      {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { headers: corsHeaders() }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders() })
  }
}
