'use client'

import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/modals'
import { useConfettiStore } from '@/hooks/use-confetti'

type ActionsProps = {
  disabled?: boolean
  isPublished?: boolean
  courseId: string
}

export default function Actions({ disabled, isPublished, courseId }: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const confetti = useConfettiStore()

  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/courses/${courseId}`)
      toast.success('Course deleted')
      router.refresh()
      router.push(`/teacher/courses/${courseId}`)
    } catch {
      toast.error('Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  const onPublish = async () => {
    try {
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`)
        toast.success('Course unpublished!')
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`)
        toast.success('Course published!')
        confetti.onOpen()
      }
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled || isLoading} variant="outline" size="sm" onClick={onPublish}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
