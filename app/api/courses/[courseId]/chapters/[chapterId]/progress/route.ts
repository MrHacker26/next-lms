import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: NextRequest, { params }: { params: { courseId: string; chapterId: string } }) {
  try {
    const { userId } = auth()
    const { isCompleted } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const userProgress = await db.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: params.chapterId } },
      update: { isCompleted },
      create: { userId, chapterId: params.chapterId, isCompleted },
    })

    return NextResponse.json(userProgress)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
