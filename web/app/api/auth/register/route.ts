import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { withRateLimit, sanitizeText } from '@/lib/security'

const RegisterSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName:  z.string().min(1).max(50),
  email:     z.string().email(),
  password:  z.string().min(8).max(100),
  role:      z.enum(['SITTER', 'OWNER', 'BOTH']),
})

function isStudentEmail(email: string): boolean {
  const studentDomains = ['.edu', '.ac.uk', '.edu.au', '.ac.nz', '.edu.ca', '.ac.za']
  return studentDomains.some((d) => email.toLowerCase().endsWith(d))
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 registrations per IP per hour
  const limited = await withRateLimit(req, 20, 60 * 60 * 1000)
  if (limited) return limited

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parse = RegisterSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })
  }

  const { firstName, lastName, email, password, role } = parse.data

  // Check for existing account
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
  }

  // Hash password with bcrypt (cost factor 12)
  const passwordHash = await bcrypt.hash(password, 12)

  const isStudent = isStudentEmail(email)

  const user = await prisma.user.create({
    data: {
      firstName: sanitizeText(firstName, 50),
      lastName:  sanitizeText(lastName, 50),
      email,
      passwordHash,
      role,
      isStudent,
      // 3-month free trial
      membershipPlan: 'FREE_TRIAL',
      membershipExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  })

  return NextResponse.json({ success: true, user }, { status: 201 })
}
