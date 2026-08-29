import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/security'

// POST /api/notifications/[id]/read — mark one notification as read

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await requireAuth(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.notification.updateMany({
    where: { id: params.id, userId: user.id },
    data:  { isRead: true },
  })

  return NextResponse.json({ success: true })
}
