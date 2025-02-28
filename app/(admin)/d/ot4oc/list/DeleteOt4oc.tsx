'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { deleteOt4oc } from './action'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const DeleteOt4oc = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(false)
  const {refresh} = useRouter()
  const hendelDelete = async () => {
    try {
      setLoading(true)
      await deleteOt4oc(id)
      toast.info("Delete successfully.")
      refresh()
    } catch (error) {
      console.log(error)

      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  return (
    <button
      className={cn('text-red-600', loading && "opacity-50")}
      disabled={loading}
      onClick={hendelDelete}
    >
      Delete
    </button>
  )
}

export default DeleteOt4oc
