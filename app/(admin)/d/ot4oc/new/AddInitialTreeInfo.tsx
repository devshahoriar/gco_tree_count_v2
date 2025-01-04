/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { InputParent } from '@/components/shared/InputBox'
import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'
import { Label } from '@/components/ui/label'
import fetcher from '@/lib/swrFectcher'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

const AddInitialTreeInfo = ({ id }: { id: number | string }) => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [datas, setDatas] = useState<any>({})
  const { data, isLoading, mutate } = useSWR(
    open ? `/api/initialTree?id=${id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    }
  )
  useEffect(() => {
    if (data && data.error) {
      setError(data.error)
    }

    setDatas(data)
  }, [data])

  const previousTrees = datas?.trees
  const newAddedTreeCount: number =
    data?.fors?.tree_count - previousTrees?.length
  const [updatedTrees, setUpdatedTrees] = useState<any[]>([])
  const [newCreatedTrees, setNewCreatedTrees] = useState<any[]>([])
  useEffect(() => {
    if (!open) {
      setUpdatedTrees([])
      setNewCreatedTrees([])
      setError('')
    }
    mutate()
  }, [open])
  const [savLoading, setSaveLoading] = useState(false)
  const handleSubmit = async () => {
    if (updatedTrees.length === 0 && newCreatedTrees.length === 0) {
      setError('Please select at least one tree')
      return
    }
    setSaveLoading(true)
    const d = await fetch(`/api/initialTree?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({
        updatedTrees,
        newCreatedTrees,
      }),
    }).then((res) => res.json())
    if (d?.error) {
      setError(d.error)
    }
    if (d?.message === 'ok') {
      setOpen(false)
      toast.success('Tree added/update successfully')
      mutate()
    }
    setSaveLoading(false)
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button disabled={isLoading} className="w-20">
          {isLoading ? (
            <Loader2 className={cn('w-5 h-5', isLoading && 'animate-spin')} />
          ) : (
            'Add Tree'
          )}
        </Button>
      </CredenzaTrigger>
      {!isLoading && (
        <CredenzaContent className="overflow-auto max-h-[70vh]">
          <CredenzaHeader>
            <CredenzaTitle>Add Tree</CredenzaTitle>
            <CredenzaDescription>
              Add trees for {datas?.fors?.childName}, ID = {datas?.fors?.id}
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            {previousTrees?.map((tree: any) => (
              <InputParent key={tree.id}>
                <Label>Select Tree</Label>
                <select
                  defaultValue={tree.treeType.id}
                  onChange={(e) => {
                    setUpdatedTrees((prev) => [
                      ...prev,
                      { id: tree.id, treeTypeId: e.target.value },
                    ])
                  }}
                  className="from-input bg-transparent focus:outline-none rounded-md"
                >
                  <option value="">Select tree</option>
                  {datas?.treeType.map((treeType: any) => (
                    <option key={treeType.id} value={treeType.id}>
                      {treeType.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            ))}
            {new Array(newAddedTreeCount || 0).fill(0).map((_, i) => (
              <InputParent key={i}>
                <Label>Select Tree</Label>
                <select
                  onChange={(e) => {
                    setNewCreatedTrees((prev) => [
                      ...prev,
                      { treeTypeId: e.target.value },
                    ])
                  }}
                  className="from-input bg-transparent focus:outline-none rounded-md"
                >
                  <option value="">Select tree</option>
                  {datas?.treeType.map((treeType: any) => (
                    <option key={treeType.id} value={treeType.id}>
                      {treeType.name}
                    </option>
                  ))}
                </select>
              </InputParent>
            ))}
            {datas?.fors?.tree_count === 0 && (
              <div>
                <p className="text-red-500">No tree added yet</p>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </CredenzaBody>
          <CredenzaFooter>
            <Button disabled={savLoading} onClick={handleSubmit}>
              Save
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      )}
    </Credenza>
  )
}

export default AddInitialTreeInfo
