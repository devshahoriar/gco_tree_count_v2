'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { addNewTree } from './action'
import { useRouter } from 'next/navigation'
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'

export const AddNewTree = () => {
  const [open, setOpen] = useState(false)
  const [treeName, setTreeName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await addNewTree(treeName)
    setTreeName('')
    setOpen(false)
    router.refresh()
  }

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button>Add New Tree</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle> Add New Tree Type</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody>
          <form onSubmit={handleSubmit}>
            <Input
              placeholder="Enter tree name"
              value={treeName}
              onChange={(e) => setTreeName(e.target.value)}
              required
            />
            <CredenzaFooter className="mt-4">
              <Button type="submit" disabled={!treeName}>
                Save
              </Button>
            </CredenzaFooter>
          </form>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
