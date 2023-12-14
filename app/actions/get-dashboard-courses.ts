import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { getProgress } from './get-progress'

type CourseWithProgressAndCategory = Prisma.CourseGetPayload<{ include: { category: true; chapters: true } }> & {
  progress: number
}

type DashboardCourses = {
  completedCourses: CourseWithProgressAndCategory[]
  coursesInProgress: CourseWithProgressAndCategory[]
}

export async function getDashboardCourses(userId: string): Promise<DashboardCourses> {
  try {
    const purchasedCourses = await db.purchase.findMany({
      where: { userId },
      select: { course: { include: { category: true, chapters: { where: { isPublished: true } } } } },
    })

    const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressAndCategory[]

    for (const course of courses) {
      const progress = await getProgress(userId, course.id)
      course.progress = progress
    }

    const completedCourses = courses.filter((course) => course.progress === 100)
    const coursesInProgress = courses.filter((course) => (course?.progress ?? 0) < 100)

    return {
      completedCourses,
      coursesInProgress,
    }
  } catch {
    return {
      completedCourses: [],
      coursesInProgress: [],
    }
  }
}
