import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { list } = await req.json()
    const courseOwner = await db.course.findUnique({ where: { id: params.courseId, createdById: userId } })

    if (!courseOwner) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    for (const item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position },
      })
    }

    return new NextResponse('Success', { status: 200 })
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
