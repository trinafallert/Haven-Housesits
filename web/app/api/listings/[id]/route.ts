import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// GET /api/listings/[id] — get single listing
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: {
          id: true, firstName: true, lastName: true, avatar: true,
          averageRating: true, totalSits: true, totalReviews: true,
          headline: true, idVerified: true, backgroundCheck: true,
        },
      },
      pets:  { select: { type: true, name: true, breed: true, age: true } },
      _count: { select: { applications: true } },
    },
  })

  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
  }

  return NextResponse.json({ listing }, { headers: corsHeaders() })
}
