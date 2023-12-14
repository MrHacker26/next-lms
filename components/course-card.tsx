import Image from 'next/image'
import Link from 'next/link'
import { BookOpenIcon } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import { IconBadge } from './icon-badge'
import { CourseProgress } from './course-progress'

type CourseCardProps = {
  id: string
  title: string
  imageUrl: string
  chaptersLength: number
  price: number
  progress: number | null
  category: string
}

export default function CourseCard({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  category,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>

        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-primary md:text-base">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-1 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpenIcon} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? 'Chapter' : 'Chapters'}
              </span>
            </div>
          </div>

          {progress !== null ? (
            <CourseProgress variant={progress === 100 ? 'success' : 'default'} size="sm" value={progress} />
          ) : (
            <p className="text-md font-medium text-slate-700 md:text-sm">{formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
