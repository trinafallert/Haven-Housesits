import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, corsHeaders, handleCors } from '@/lib/security'

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// GET /api/conversations — list conversations for current user
export async function GET(req: NextRequest) {
  const corsOpt = handleCors(req)
  if (corsOpt) return corsOpt

  const { error, user } = await requireAuth(req)
  if (error) return new NextResponse(error.body, { status: error.status, headers: corsHeaders() })

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId: user!.id as string } },
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      participants: {
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          sender: { select: { id: true, firstName: true } },
        },
      },
      application: {
        select: {
          id: true,
          listing: { select: { id: true, title: true } },
        },
      },
    },
  })

  // Count unread messages per conversation
  const result = await Promise.all(
    conversations.map(async (conv) => {
      const unread = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: user!.id as string },
          readAt: null,
        },
      })

      const otherParticipant = conv.participants.find(
        (p) => p.userId !== (user!.id as string)
      )

      return {
        id: conv.id,
        otherUser: otherParticipant?.user ?? null,
        lastMessage: conv.messages[0] ?? null,
        unreadCount: unread,
        listingTitle: conv.application?.listing?.title ?? '',
        listingId: conv.application?.listing?.id ?? '',
        applicationId: conv.application?.id ?? '',
        updatedAt: conv.updatedAt,
      }
    })
  )

  return NextResponse.json({ conversations: result }, { headers: corsHeaders() })
}
