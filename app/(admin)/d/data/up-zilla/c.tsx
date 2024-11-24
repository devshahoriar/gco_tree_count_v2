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

export const AddUpZilla = ({ allZilla }: { allZilla: any[] }) => {
  const [name, setName] = useState('')
  const [zillaId, setZillaId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const hendelSubmit = async () => {
    if (!name || !zillaId) {
      setError('Name and Zilla are required')
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
        body: JSON.stringify({ name, type: 'upzilla', pId: zillaId }),
        credentials: 'include',
      })
      closeRef?.current?.click()
      refresh()
      setName('')
    } catch (error: any) {
      console.log(error)
      setError('Something went wrong')
    }
    setLoading(false)
  }

  return (
    <Credenza>
      <CredenzaTrigger asChild>
        <Button>Add Up-Zilla</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Up-Zilla</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Zilla</Label>
            <select
              value={zillaId}
              onChange={(e) => setZillaId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value={0}>Select</option>
              {allZilla.map((zilla) => (
                <option key={zilla.id} value={zilla.id}>
                  {zilla.name} - {zilla.division.name}
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
          <p className="text-red-500 text-sm">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={hendelSubmit} disabled={loading}>
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

export const EditUpZilla = ({
  id,
  n,
  allZilla,
  zId,
}: {
  zId: number
  id: number
  n: string
  allZilla: any[]
}) => {
  const [name, setName] = useState(n)
  const [zillaId, setZillaId] = useState(zId)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const hendelSubmit = async () => {
    if (!name) {
      setError('Name is required')
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
        body: JSON.stringify({ name, type: 'upzilla', id, pId: zillaId }),
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
          <CredenzaTitle>Edit Up-Zilla</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Zilla</Label>
            <select
              value={zillaId}
              onChange={(e) => setZillaId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value={0}>Select</option>
              {allZilla.map((zilla) => (
                <option key={zilla.id} value={zilla.id}>
                  {zilla.name} - {zilla.division.name}
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
          <p className="text-red-500 text-sm">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={hendelSubmit} disabled={loading}>
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

export const DeleteUpZilla = ({
  id,
  name,
  unionCount,
  postOfficeCount,
}: {
  id: number
  name: string
  unionCount: number
  postOfficeCount: number
}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()

  const hendelSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await fetch('/api/addData', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'upzilla', id }),
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
          <CredenzaTitle>Delete Up-Zilla</CredenzaTitle>
          <CredenzaDescription>
            Delete <span className="font-bold">{name}</span> will also delete{' '}
            {unionCount} unions and {postOfficeCount} post offices. Are you sure?
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-red-500">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button onClick={hendelSubmit} disabled={loading} variant="destructive">
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