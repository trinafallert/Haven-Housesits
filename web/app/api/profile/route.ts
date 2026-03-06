import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, sanitizeText, corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function GET(req: NextRequest) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { error, user } = await requireAuth(req)
  if (error) return new NextResponse(error.body, { status: error.status, headers: corsHeaders() })

  const profile = await prisma.user.findUnique({
    where: { id: user!.id as string },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      avatar: true, tagline: true, bio: true, role: true,
      membershipPlan: true, isStudent: true, idVerified: true,
      backgroundCheckStatus: true, averageRating: true, totalSits: true,
      totalReviews: true, city: true, state: true,
      createdAt: true,
    },
  })

  if (!profile) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
  }

  return NextResponse.json({ profile }, { headers: corsHeaders() })
}

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName:  z.string().min(1).max(50).optional(),
  tagline:  z.string().max(120).optional(),
  bio:       z.string().max(2000).optional(),
  city:      z.string().max(100).optional(),
  state:     z.string().max(100).optional(),
  country:   z.string().max(2).optional(),
  avatar:    z.string().url().optional(),
})

export async function PATCH(req: NextRequest) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { error, user } = await requireAuth(req)
  if (error) return new NextResponse(error.body, { status: error.status, headers: corsHeaders() })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() })
  }

  const parse = UpdateProfileSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 422, headers: corsHeaders() })
  }

  const data = parse.data
  const sanitized: Record<string, any> = {}
  if (data.firstName) sanitized.firstName = sanitizeText(data.firstName, 50)
  if (data.lastName)  sanitized.lastName  = sanitizeText(data.lastName, 50)
  if (data.tagline)  sanitized.tagline  = sanitizeText(data.tagline, 120)
  if (data.bio)       sanitized.bio       = sanitizeText(data.bio, 2000)
  if (data.city)      sanitized.city      = sanitizeText(data.city, 100)
  if (data.state)     sanitized.state     = sanitizeText(data.state, 100)
  if (data.country)   sanitized.country   = data.country
  if (data.avatar)    sanitized.avatar    = data.avatar

  const profile = await prisma.user.update({
    where: { id: user!.id as string },
    data: sanitized,
    select: {
      id: true, email: true, firstName: true, lastName: true,
      avatar: true, tagline: true, bio: true, role: true,
      membershipPlan: true, averageRating: true, totalSits: true,
      totalReviews: true, city: true, state: true,
    },
  })

  return NextResponse.json({ profile }, { headers: corsHeaders() })
}
