/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { deleteTree, removeImage } from './action'
import { useRouter } from 'next/navigation'

const DeleteTree = ({ id, imgs }: any) => {
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()
  const handleDelete = async () => {
    try {
      setLoading(true)
      for (let index = 0; index < imgs.length; index++) {
        await removeImage(
          id as any,
          imgs[index]?.fileId as any,
          imgs[index]?.id
        )
      }
      await deleteTree(id)
      refresh()
      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } catch (error) {
      console.log(error)
      toast.error('Failed to tree image')
    }
  }
  return (
    <Button
      disabled={loading}
      onClick={handleDelete}
      className="absolute top-2 right-2"
      size='icon'
    >
      <Trash2 className="text-red-600" />
    </Button>
  )
}

export default DeleteTree
