import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { isTeacher } from '@/lib/teacher'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!isTeacher(userId)) {
    return redirect('/')
  }

  return <>{children}</>
}
