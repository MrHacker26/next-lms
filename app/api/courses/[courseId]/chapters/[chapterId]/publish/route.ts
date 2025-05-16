import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = Promise<{ chapterId: string; courseId: string }>

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { chapterId, courseId } = await params
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({ where: { id: courseId, createdById: userId } })
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.findUnique({ where: { id: chapterId, courseId } })
    const muxData = await db.muxData.findUnique({ where: { chapterId } })

    if (![chapter, muxData, chapter?.title, chapter?.description, chapter?.videoUrl].every(Boolean)) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: { id: chapterId, courseId },
      data: { isPublished: true },
    })

    return NextResponse.json(publishedChapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
