import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

type Attachment = Promise<{
  courseId: string
  attachmentId: string
}>

export async function POST(request: NextRequest, { params }: { params: Attachment }) {
  const { courseId } = await params
  try {
    const { userId } = await auth()
    const { url } = await request.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        createdById: userId,
      },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId,
      },
    })

    return NextResponse.json(attachment)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
