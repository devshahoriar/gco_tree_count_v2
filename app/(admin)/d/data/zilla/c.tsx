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
import { Division } from '@prisma/client'
import { Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

export const AddZilla = ({ allDivision }: { allDivision: Division[] }) => {
  const [name, setName] = useState('')
  const [divisionId, setDivisionId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()
  const closeRef = useRef<HTMLButtonElement>(null)

  const hendelSubmit = async () => {
    if (!name || !divisionId) {
      setError('Name and Division is required')
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
        body: JSON.stringify({ name, type: 'zilla', pId: divisionId }),
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
        <Button>Add Zilla</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Zilla</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Division</Label>
            <select
              value={divisionId}
              onChange={(e) => setDivisionId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>Select</option>
              {allDivision.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
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

export const EditZilla = ({
  id,
  n,
  allDivision,
  dId,
}: {
  dId: number
  id: number
  n: string
  allDivision: Division[]
}) => {
  const [name, setName] = useState(n)
  const [loading, setLoading] = useState(false)
  const [divisionId, setDivisionId] = useState(dId)
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
        body: JSON.stringify({ name, type: 'zilla', id, pId: divisionId }),
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
          <CredenzaTitle>Edit Zilla</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="space-y-4">
          <div className="space-y-2 flex flex-col">
            <Label>Select Zilla</Label>
            <select
              value={divisionId}
              onChange={(e) => setDivisionId(Number(e.target.value))}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>Select</option>
              {allDivision.map((division) => (
                <option key={division.id} value={division.id}>
                  {division.name}
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

export const DeleteZilla = ({
  id,
  name,
  Upzillacount,
}: {
  Upzillacount: number
  id: number
  name: string
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
        body: JSON.stringify({ type: 'zilla', id }),
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
          <CredenzaTitle>Delete Division</CredenzaTitle>
          <CredenzaDescription>
            Delete <span className="font-bold">{name}</span> will {Upzillacount}{' '}
            zillas. Are you shure?
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <p className="text-red-500">{error}</p>
        </CredenzaBody>
        <CredenzaFooter>
          <Button
            onClick={hendelSubmit}
            disabled={loading}
            variant="destructive"
          >
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
