import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = { chapterId: string; courseId: string }

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({ where: { id: params.courseId, createdById: userId } })
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.findUnique({ where: { id: params.chapterId, courseId: params.courseId } })
    const muxData = await db.muxData.findUnique({ where: { chapterId: params.chapterId } })

    if (![chapter, muxData, chapter?.title, chapter?.description, chapter?.videoUrl].every(Boolean)) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: { isPublished: true },
    })

    return NextResponse.json(publishedChapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
