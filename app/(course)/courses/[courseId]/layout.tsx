import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import CourseNavbar from './_components/course-navbar'
import CourseSidebar from './_components/course-sidebar'
import { getProgress } from '@/actions/get-progress'

type CourseLayoutProps = {
  children: React.ReactNode
  params: Promise<{ courseId: string }>
}

export default async function CourseLayout({ children, params }: CourseLayoutProps) {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }
  const resolvedParams = await params

  const course = await db.course.findUnique({
    where: { id: await resolvedParams.courseId },
    include: {
      chapters: {
        where: { isPublished: true },
        include: { userProgress: { where: { userId } } },
        orderBy: { position: 'asc' },
      },
    },
  })

  if (!course) {
    return redirect('/')
  }

  const progressCount = await getProgress(userId, course.id)

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-20 w-full md:pl-80">
        <CourseNavbar course={course} progressCount={progressCount} />
      </div>

      <div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>

      <main className="h-full pt-20 md:pl-80">{children}</main>
    </div>
  )
}
