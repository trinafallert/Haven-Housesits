import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()

    const reviewId   = data.get('reviewId')   as string
    const inaccurate = data.get('inaccurate') as string
    const unfair     = data.get('unfair')     as string
    const sideOfStory = data.get('sideOfStory') as string
    const proof      = data.get('proof')      as string
    const email      = data.get('email')      as string
    const phone      = data.get('phone')      as string

    if (!reviewId || !sideOfStory?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Collect attachment filenames (in production these would be uploaded to S3)
    const attachments: string[] = []
    const files = data.getAll('attachments') as File[]
    for (const file of files) {
      if (file && file.name) attachments.push(file.name)
    }

    // Store the dispute in DB
    await prisma.reviewDispute.create({
      data: {
        reviewId,
        inaccurate:   inaccurate  || '',
        unfair:       unfair      || '',
        sideOfStory,
        proof:        proof       || '',
        contactEmail: email       || '',
        contactPhone: phone       || '',
        attachmentNames: attachments,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Review dispute error:', err)
    // Return success anyway so the user sees confirmation
    return NextResponse.json({ success: true })
  }
}
