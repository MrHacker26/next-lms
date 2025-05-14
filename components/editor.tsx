'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import 'react-quill-new/dist/quill.snow.css'

interface EditorProps {
  onChange: (value: string) => void
  value: string
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), [])

  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  )
}
