import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/security'
import { corsHeaders, handleCors } from '@/lib/security'

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) ?? new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function POST(req: NextRequest) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const limited = await withRateLimit(req, 10, 60_000)
  if (limited) return limited

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() })
  }

  const parse = LoginSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 422, headers: corsHeaders() })
  }

  const { email, password } = parse.data

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      passwordHash: true, role: true, membershipPlan: true,
      isStudent: true, avatar: true, tagline: true,
      averageRating: true, totalSits: true, totalReviews: true,
    },
  })

  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401, headers: corsHeaders() })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401, headers: corsHeaders() })
  }

  // Issue a JWT token for mobile use
  const tokenPayload = {
    id:        user.id,
    sub:       user.id,
    email:     user.email,
    name:      `${user.firstName} ${user.lastName}`,
    role:      user.role,
    plan:      user.membershipPlan,
    isStudent: user.isStudent,
  }

  const token = jwt.sign(tokenPayload, process.env.NEXTAUTH_SECRET!, { expiresIn: '30d' })

  return NextResponse.json({
    token,
    user: {
      id:           user.id,
      email:        user.email,
      firstName:    user.firstName,
      lastName:     user.lastName,
      role:         user.role,
      plan:         user.membershipPlan,
      isStudent:    user.isStudent,
      avatar:       user.avatar,
      tagline:      user.tagline,
      averageRating: user.averageRating,
      totalSits:    user.totalSits,
      totalReviews: user.totalReviews,
    },
  }, { headers: corsHeaders() })
}
