import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// PATCH /api/applications/[id] — update application status (owner only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { error, user } = await requireAuth(req)
  if (error) return new NextResponse(error.body, { status: error.status, headers: corsHeaders() })

  const UpdateSchema = z.object({
    status: z.enum(['ACCEPTED', 'DECLINED']),
  })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders() })
  }

  const parse = UpdateSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: parse.error.flatten() }, { status: 422, headers: corsHeaders() })
  }

  // Verify ownership
  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: { listing: { select: { ownerId: true } } },
  })

  if (!application) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404, headers: corsHeaders() })
  }

  if (application.listing.ownerId !== (user!.id as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders() })
  }

  const updated = await prisma.application.update({
    where: { id: params.id },
    data: { status: parse.data.status },
  })

  return NextResponse.json({ application: updated }, { headers: corsHeaders() })
}

// GET /api/applications/[id] — get single application
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { error, user } = await requireAuth(req)
  if (error) return new NextResponse(error.body, { status: error.status, headers: corsHeaders() })

  const application = await prisma.application.findUnique({
    where: { id: params.id },
    include: {
      listing: {
        select: {
          id: true, title: true, city: true, state: true,
          startDate: true, endDate: true, photos: true,
          pets: { select: { type: true, name: true } },
          ownerId: true,
        },
      },
      sitter: { select: { id: true, firstName: true, lastName: true, avatar: true, averageRating: true } },
    },
  })

  if (!application) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: corsHeaders() })
  }

  // Must be sitter or owner
  if (
    application.sitterId !== (user!.id as string) &&
    application.listing.ownerId !== (user!.id as string)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: corsHeaders() })
  }

  return NextResponse.json({ application }, { headers: corsHeaders() })
}
