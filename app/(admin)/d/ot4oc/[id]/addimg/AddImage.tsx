/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { getLocation, imageCompress } from '@/lib/utils'
import { ImageUp } from 'lucide-react'
import { useRef, useState } from 'react'

const AddImage = ({
  addFun,
  location,
  setLoaction,
  title = 'Select tree image',
  needLocation = true,
}: {
  addFun: any
  setLoaction: any
  location: any
  title?: string
  needLocation?: boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')

  return (
    <div className='flex flex-col items-start space-y-2'>
      <Label>{title}</Label>
      <input
        ref={inputRef}
        hidden
        type='file'
        accept='image/jpg,image/jpeg'
        multiple={false}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            try {
              if (needLocation) {
                const loc = await getLocation(file)
                if (!location) {
                  setLoaction?.(loc)
                }
              }

              // Pass the compressed file directly instead of file metadata
              const compressedFile: any = await imageCompress(file)
              if (
                compressedFile instanceof Blob ||
                compressedFile instanceof File
              ) {
                addFun([compressedFile])
              } else {
                throw new Error('Invalid file format after compression')
              }
            } catch (error: any) {
              setError(error?.message || 'Error processing image')
              console.error('Image processing error:', error)
            }
          }
        }}
      />
      <Button
        onClick={() => {
          setError('')
          inputRef.current?.click()
        }}
      >
        <ImageUp />
        Add Image
      </Button>
      {error && <p className='text-red-500 text-sm font-medium'>{error}</p>}
    </div>
  )
}

export default AddImage
