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
import { Division } from '@prisma/client'
import { Edit, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export const AddDivision = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()

  const hendelSubmit = async () => {
    if (!name) {
      setError('Name is required')
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
        body: JSON.stringify({ name, type: 'division' }),
        credentials: 'include',
      })

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
        <Button>Add Division</Button>
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Add Division</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
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
            <Button>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export const EditDivision = ({ id, n }: { id: number; n: string }) => {
  const [name, setName] = useState(n)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { refresh } = useRouter()

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
        body: JSON.stringify({ name, type: 'division', id }),
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
        <Button>
          <Edit size={20} />
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Edit Division</CredenzaTitle>
          <CredenzaDescription> </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
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
            <Button>Close</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  )
}

export const DeleteDivision = ({
  id,
  name,
  zillacount,
}: { zillacount: number } & Division) => {
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
        body: JSON.stringify({ type: 'division', id }),
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
            Delete <span className='font-bold'>{name}</span> will {zillacount} zillas. Are you shure?{' '}
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
