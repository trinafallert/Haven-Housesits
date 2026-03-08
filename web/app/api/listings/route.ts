import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit, sanitizeText } from '@/lib/security'

// ─── GET /api/listings ────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const page     = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit    = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
  const skip     = (page - 1) * limit
  const sitType  = searchParams.get('sitType') ?? undefined
  const petType  = searchParams.get('petType') ?? undefined
  const country  = searchParams.get('country') ?? undefined
  const city     = searchParams.get('city') ?? undefined
  const startDate= searchParams.get('startDate') ?? undefined
  const endDate  = searchParams.get('endDate') ?? undefined
  const search   = searchParams.get('search') ?? undefined
  const minDays  = searchParams.get('minDays') ? parseInt(searchParams.get('minDays')!) : undefined
  const dogWalk  = searchParams.get('dogWalkReq') ?? undefined
  const autoLitter = searchParams.get('hasAutoLitterBox')

  const where: any = {
    status: 'ACTIVE',
    ...(sitType ? { type: sitType } : {}),
    ...(country ? { country: { contains: country, mode: 'insensitive' } } : {}),
    ...(city    ? { city: { contains: city, mode: 'insensitive' } } : {}),
    ...(dogWalk ? { dogWalkReq: dogWalk } : {}),
    ...(autoLitter === 'true' ? { hasAutoLitterBox: true } : {}),
    ...(startDate ? { startDate: { lte: new Date(startDate) } } : {}),
    ...(endDate   ? { endDate:   { gte: new Date(endDate) } }   : {}),
    ...(petType   ? { pets: { some: { type: petType } } }       : {}),
    ...(search    ? { OR: [
      { title:       { contains: search, mode: 'insensitive' } },
      { city:        { contains: search, mode: 'insensitive' } },
      { country:     { contains: search, mode: 'insensitive' } },
      { state:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]} : {}),
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, avatar: true, averageRating: true, totalSits: true, idVerified: true } },
        pets:  { select: { type: true, name: true, breed: true, age: true } },
        _count: { select: { applications: true } },
      },
    }),
    prisma.listing.count({ where }),
  ])

  // Client-side minDays filter (duration = endDate - startDate in days)
  const filtered = minDays
    ? listings.filter(l => {
        const days = Math.round(
          (new Date(l.endDate).getTime() - new Date(l.startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        return days >= minDays
      })
    : listings

  return NextResponse.json({
    listings: filtered,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

// ─── POST /api/listings ───────────────────────────────────────────────────────
const CreateListingSchema = z.object({
  title:            z.string().min(5).max(80),
  description:      z.string().min(20).max(3000),
  sitType:          z.enum(['FREE', 'PAID', 'VACANT', 'LONG_TERM', 'PET_ONLY']),
  homeType:         z.enum(['HOUSE', 'APARTMENT', 'COTTAGE', 'RURAL', 'VILLA', 'OTHER']),
  city:             z.string().min(1).max(100),
  state:            z.string().min(1).max(100),
  country:          z.string().length(2),
  startDate:        z.string().datetime(),
  endDate:          z.string().datetime(),
  dailyRate:        z.number().min(0).optional(),
  bedrooms:         z.number().int().min(0).max(20),
  bathrooms:        z.number().int().min(0).max(20),
  dogWalkReq:       z.string().optional(),
  hasAutoLitterBox: z.boolean().default(false),
  hasBackyard:      z.boolean().default(false),
  isFamilyFriendly: z.boolean().default(false),
  hasWifi:          z.boolean().default(true),
  hasParking:       z.boolean().default(false),
  hasPool:          z.boolean().default(false),
  remoteWorkFriendly: z.boolean().default(false),
  maxApplications:  z.number().int().min(1).max(15).default(10),
  responsibilities: z.string().max(1000).optional(),
  pets:             z.array(z.object({
    type:  z.string(),
    name:  z.string().max(50),
    breed: z.string().max(50).optional(),
    age:   z.string().max(20).optional(),
  })).optional(),
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

  const parse = CreateListingSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })
  }

  const { pets, ...data } = parse.data

  const listing = await prisma.listing.create({
    data: {
      ...data,
      title:       sanitizeText(data.title, 80),
      description: sanitizeText(data.description, 3000),
      ownerId:     user!.id as string,
      startDate:   new Date(data.startDate),
      endDate:     new Date(data.endDate),
      pets: pets?.length
        ? { createMany: { data: pets.map((p) => ({ type: p.type, name: p.name, breed: p.breed, age: p.age })) } }
        : undefined,
    },
    include: { pets: true },
  })

  return NextResponse.json({ listing }, { status: 201 })
}
