import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await req.json()

    if (!userId) {
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
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}
