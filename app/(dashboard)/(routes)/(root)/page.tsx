import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CheckCircle, Clock } from 'lucide-react'
import CoursesList from '@/components/course-list'
import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import { InfoCard } from './_components/info-card'

export default async function Dashboard() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={Clock} label="In Progress" numberOfItems={coursesInProgress.length} />
        <InfoCard icon={CheckCircle} label="Completed" numberOfItems={completedCourses.length} variant="success" />
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}
