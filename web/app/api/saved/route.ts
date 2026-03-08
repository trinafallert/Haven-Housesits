import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/security'

// GET /api/saved — list saved listings, or check one
// POST /api/saved — toggle save on a listing

export async function GET(req: NextRequest) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listingId = req.nextUrl.searchParams.get('listingId')

  if (listingId) {
    const entry = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: user.id, listingId } },
    })
    return NextResponse.json({ saved: !!entry })
  }

  const saved = await prisma.savedListing.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, avatar: true, averageRating: true } },
          pets:  { select: { type: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ listings: saved.map(s => s.listing) })
}

export async function POST(req: NextRequest) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { listingId } = await req.json()
  if (!listingId) return NextResponse.json({ error: 'listingId required' }, { status: 400 })

  const existing = await prisma.savedListing.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
  })

  if (existing) {
    await prisma.savedListing.delete({
      where: { userId_listingId: { userId: user.id, listingId } },
    })
    return NextResponse.json({ saved: false })
  } else {
    await prisma.savedListing.create({
      data: { userId: user.id, listingId },
    })
    return NextResponse.json({ saved: true })
  }
}
