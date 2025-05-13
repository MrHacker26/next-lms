import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isTeacher } from '@/lib/teacher'

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!isTeacher(userId)) {
    return redirect('/')
  }

  return <>{children}</>
}
