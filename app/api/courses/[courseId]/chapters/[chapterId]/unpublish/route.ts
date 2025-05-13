import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Params = Promise<{ chapterId: string; courseId: string }>

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  try {
    const resolvedParams = await params
    const { userId } = await auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({ where: { id: resolvedParams.courseId, createdById: userId } })
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const unpublishedChapter = await db.chapter.update({
      where: { id: resolvedParams.chapterId, courseId: resolvedParams.courseId },
      data: { isPublished: false },
    })

    const publishedChapters = await db.chapter.count({
      where: { courseId: resolvedParams.courseId, isPublished: true },
    })
    if (!publishedChapters) {
      await db.course.update({ where: { id: resolvedParams.courseId }, data: { isPublished: false } })
    }

    return NextResponse.json(unpublishedChapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
