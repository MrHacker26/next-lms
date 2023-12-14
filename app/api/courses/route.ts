import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isTeacher } from '@/lib/teacher'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    const { title } = await request.json()

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.create({
      data: {
        title,
        createdById: userId,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
