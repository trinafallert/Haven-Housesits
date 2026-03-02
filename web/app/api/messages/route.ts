import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, withRateLimit, sanitizeText } from '@/lib/security'

const SendMessageSchema = z.object({
  conversationId: z.string().cuid(),
  text:           z.string().min(1).max(2000),
  imageUrl:       z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  const limited = await withRateLimit(req, 60, 60_000)
  if (limited) return limited

  const { error, user } = await requireAuth(req)
  if (error) return error

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parse = SendMessageSchema.safeParse(body)
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 422 })

  const { conversationId, text, imageUrl } = parse.data

  // Verify the caller is a participant in this conversation
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: user!.id as string },
  })
  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId: user!.id as string,
      text: sanitizeText(text, 2000),
      imageUrl,
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
    },
  })

  // TODO: emit to Pusher/Socket.io for real-time delivery
  // await pusher.trigger(`conversation-${conversationId}`, 'new-message', message)

  return NextResponse.json({ message }, { status: 201 })
}

export async function GET(req: NextRequest) {
  const { error, user } = await requireAuth(req)
  if (error) return error

  const { searchParams } = req.nextUrl
  const conversationId   = searchParams.get('conversationId')
  if (!conversationId) return NextResponse.json({ error: 'conversationId required' }, { status: 400 })

  // Verify participant
  const participant = await prisma.conversationParticipant.findFirst({
    where: { conversationId, userId: user!.id as string },
  })
  if (!participant) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: {
      sender: { select: { id: true, firstName: true, avatar: true } },
    },
  })

  return NextResponse.json({ messages })
}
