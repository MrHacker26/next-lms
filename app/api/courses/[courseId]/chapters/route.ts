import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const resolvedParams = await params
    const { userId } = await auth()
    const { title } = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const courseOwner = await db.course.findUnique({
      where: { id: resolvedParams.courseId, createdById: userId },
    })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId: resolvedParams.courseId },
      orderBy: { position: 'desc' },
    })

    const newPosition = lastChapter ? lastChapter.position + 1 : 1

    const newChapter = await db.chapter.create({
      data: { title, courseId: resolvedParams.courseId, position: newPosition },
    })

    return NextResponse.json(newChapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
