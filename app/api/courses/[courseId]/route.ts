import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

const { Video } = new Mux(process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!)

export async function PATCH(req: Request, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth()
    const { courseId } = await params
    const values = await req.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        createdById: userId,
      },
      data: {
        title: values?.title,
        description: values?.description,
        imageUrl: values?.imageUrl,
        categoryId: values?.categoryId,
        price: values?.price,
        attachments: values?.attachments,
      },
    })

    return NextResponse.json(course)
  } catch {
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { courseId } = await params
    const { userId } = await auth()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: courseId, createdById: userId },
      include: {
        chapters: { include: { muxData: true } },
      },
    })

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    /** Removing mux data for all chapters */
    for (const chapter of course.chapters) {
      if (chapter.muxData) {
        await Video.Assets.del(chapter.muxData.assetId)
      }
    }

    const deletedCourse = await db.course.delete({ where: { id: courseId } })

    return NextResponse.json(deletedCourse)
  } catch {
    return new NextResponse('Internal server exception', { status: 500 })
  }
}
