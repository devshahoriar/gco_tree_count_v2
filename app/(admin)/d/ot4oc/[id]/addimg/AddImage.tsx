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
}: {
  addFun: any
  setLoaction: any
  location: any
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  return (
    <div className="flex flex-col items-start space-y-2">
      <Label>Select tree image</Label>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpg,image/jpeg"
        multiple={false}
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            try {
              const loc = await getLocation(file)
              if (!location) {
                setLoaction(loc)
              }
              const img = await imageCompress(file)
           
              console.log(img)
              addFun((p:any) => [...p, img])
            } catch (error: any) {
              if (error?.message) {
                setError(error.message)
              }
              console.log(error)
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
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  )
}

export default AddImage
