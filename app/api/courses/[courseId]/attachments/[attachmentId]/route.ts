import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

type Attachment = Promise<{
  courseId: string
  attachmentId: string
}>

export async function DELETE(request: NextRequest, { params }: { params: Attachment }) {
  try {
    const { courseId, attachmentId } = await params
    const { userId } = await auth()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({ where: { id: courseId, createdById: userId } })
    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const attachment = await db.attachment.delete({ where: { courseId, id: attachmentId } })

    return NextResponse.json(attachment)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
