import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Progress = Promise<{
  courseId: string
  chapterId: string
}>

export async function PUT(req: NextRequest, { params }: { params: Progress }) {
  try {
    const { chapterId } = await params
    const { userId } = await auth()
    const { isCompleted } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userProgress = await db.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId } },
      update: { isCompleted },
      create: { userId, chapterId, isCompleted },
    })

    return NextResponse.json(userProgress)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
