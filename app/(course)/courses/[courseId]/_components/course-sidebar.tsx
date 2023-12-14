import { auth } from '@clerk/nextjs'
import { Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import CourseSidebarItem from './course-sidebar-item'
import { CourseProgress } from '@/components/course-progress'

type CourseSidebarProps = {
  course: Prisma.CourseGetPayload<{ include: { chapters: { include: { userProgress: true } } } }>
  progressCount: number
}

export default async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  })

  return (
    <div className="flex h-full flex-col overflow-y-auto border-r shadow-sm">
      <div className="flex flex-col border-b p-8">
        <h1 className="text-lg font-semibold">{course.title}</h1>
        {purchase ? (
          <div className="mt-10">
            <CourseProgress variant="success" value={progressCount} />
          </div>
        ) : null}
      </div>
      <div className="flex w-full flex-col">
        {course.chapters.map((chapter) => (
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  )
}
