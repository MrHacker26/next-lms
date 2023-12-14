import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { DataTable } from './_component/data-table'
import { columns } from './_component/columns'

export default async function Courses() {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const courses = await db.course.findMany({ where: { createdById: userId }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-6 p-6">
      <DataTable columns={columns} data={courses} />
    </div>
  )
}
