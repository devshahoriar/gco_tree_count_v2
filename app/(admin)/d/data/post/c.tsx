
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import InputBox from '@/components/shared/InputBox'
import { Button } from '@/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza'
import { Label } from '@/components/ui/label'
import { Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export const AddPostOffice = ({ allUpazilla }: { allUpazilla: any[] }) => {
  const [name, setName] = useState('')
  const [postCode, setPostCode] = useState('')
  const [upazillaId, setUpazillaId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = async () => {
    if (!name || !postCode || !upazillaId) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await fetch('/api/addData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, postCode, type: 'postOffice', pId: upazillaId }),
        credentials: 'include',
      })
      closeRef?.current?.click()
      refresh()
      setName('')
      setPostCode('')
    } catch (error: any) {
      console.log(error)
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Add Post Office</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Post Office</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Upazilla</Label>
            <select
              value={upazillaId}
              onChange={(e) => setUpazillaId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value={0}>Select</option>
              {allUpazilla.map((upazilla) => (
                <option key={upazilla.id} value={upazilla.id}>
                  {upazilla.name} - {upazilla.zilla.name} - {upazilla.zilla.division.name}
                </option>
              ))}
            </select>
          </div>
          <InputBox
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            title="Name"
          />
          <InputBox
            id="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            title="Post Code"
          />
          <p className="text-red-500 text-sm">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            Create
          </Button>
          <CredenzaClose asChild>
            <Button ref={closeRef}>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export const EditPostOffice = ({
  id,
  n,
  pc,
  allUpazilla,
  upId,
}: {
  id: number
  n: string
  pc: string
  allUpazilla: any[]
  upId: number
}) => {
  const [name, setName] = useState(n)
  const [postCode, setPostCode] = useState(pc)
  const [upazillaId, setUpazillaId] = useState(upId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleSubmit = async () => {
    if (!name || !postCode) {
      setError('Name and Post Code are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      await fetch('/api/addData', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, postCode, type: 'postOffice', pId: upazillaId }),
        credentials: 'include',
      })
      closeRef.current?.click()
      refresh()
    } catch (error: any) {
      console.log(error)
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>
          <Edit size={20} />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Post Office</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Upazilla</Label>
            <select
              value={upazillaId}
              onChange={(e) => setUpazillaId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value={0}>Select</option>
              {allUpazilla.map((upazilla) => (
                <option key={upazilla.id} value={upazilla.id}>
                  {upazilla.name} - {upazilla.zilla.name} - {upazilla.zilla.division.name}
                </option>
              ))}
            </select>
          </div>
          <InputBox
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            title="Name"
          />
          <InputBox
            id="postCode"
            value={postCode}
            onChange={(e) => setPostCode(e.target.value)}
            title="Post Code"
          />
          <p className="text-red-500 text-sm">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            Update
          </Button>
          <CredenzaClose asChild>
            <Button ref={closeRef}>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export const DeletePostOffice = ({
  id,
  name,
}: {
  id: number
  name: string
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await fetch('/api/addData', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type: 'postOffice' }),
        credentials: 'include',
      })
      refresh()
    } catch (error: any) {
      console.log(error)
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button variant="destructive">
          <Trash size={20} />
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Delete Post Office</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete <span className="font-bold">{name}</span>?
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-red-500">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={handleSubmit} disabled={loading} variant="destructive">
            Delete
          </Button>
          <CredenzaClose asChild>
            <Button>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}