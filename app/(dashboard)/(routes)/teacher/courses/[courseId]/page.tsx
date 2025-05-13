import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'

import { db } from '@/lib/db'
import { IconBadge } from '@/components/icon-badge'
import { TitleForm } from './_components/title-form'
import { DescriptionForm } from './_components/description-form'
import { ImageForm } from './_components/image-form'
import CategoryForm from './_components/category-form'
import { PriceForm } from './_components/price-form'
import { AttachmentForm } from './_components/attachment-form'
import { ChaptersForm } from './_components/chapters-form'
import { Banner } from '@/components/banner'
import Actions from './_components/actions'

type CourseIdPageProps = {
  params: Promise<{
    courseId: string
  }>
}

const CourseIdPage = async ({ params }: CourseIdPageProps) => {
  const resolvedParams = await params
  const { userId } = await auth()

  if (!userId) {
    return redirect('/')
  }

  const course = await db.course.findUnique({
    where: { id: resolvedParams.courseId, createdById: userId },
    include: { attachments: { orderBy: { createdAt: 'desc' } }, chapters: { orderBy: { position: 'asc' } } },
  })

  if (!course) {
    return redirect('/')
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ]

  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!course.isPublished && <Banner label="This course is unpublished. It will not be visible to the students." />}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
          </div>
          <Actions disabled={!isComplete} courseId={resolvedParams.courseId} isPublished={course.isPublished} />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseIdPage
