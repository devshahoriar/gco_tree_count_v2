/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'
import InputBox from '@/components/shared/InputBox'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { z } from 'zod'

const dataSchema = z.object({
  childName: z.string().nonempty('Child name is required'),
  fatherName: z.string().nonempty('Father name is required'),
  village: z.string().nonempty('Village name is required'),
  phone: z.string().nonempty('Phone number is required'),
  tree_count: z.string().nonempty('Tree count is required'),
  masterId: z.string().nonempty('Master roll ID is required'),
})

const MasterRoll = ({ setTab }: { setTab: (arg: string) => void }) => {
  const [error, setError] = useState('')
  const [data, setData] = useState({
    childName: '',
    fatherName: '',
    village: '',
    phone: '',
    tree_count: '',
    masterId: '',
  })
  const [isChanged, setIsChanged] = useState(false)

  const handleChange = (name: string, value: string | number) => {
    setIsChanged(true)
    setData({ ...data, [name]: value })
  }

  const handleSave = async () => {
    setError('')
    setIsChanged(false)
    try {
      dataSchema.parse(data)
      // Implement save functionality here
      const x = await fetch('/api/addtree', {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
      }).then((res) => res.json())
      if (x?.error) {
        setError(x.error)
      }
    } catch (e: any) {
      setError(e.errors[0].message)
      console.log(e.errors)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master roll</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <p>Initial information about the child and the tree.</p>
            {isChanged && <p className="text-red-500">*Please save changes</p>}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            id="name"
            title="Child Name / Rechivar name"
            placeholder="Name"
            onChange={(e) => handleChange('childName', e.target.value)}
          />

          <InputBox
            id="fName"
            title="Father Name"
            placeholder="Name"
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
          <InputBox
            id="village"
            title="Village Name"
            placeholder="Village"
            onChange={(e) => handleChange('village', e.target.value)}
          />
          <InputBox
            id="phone"
            title="Phone"
            placeholder="Mobile"
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <InputBox
            id="treeCount"
            title="How many tree plant"
            placeholder="Tree Count"
            onChange={(e) => handleChange('tree_count', e.target.value)}
          />
          <InputBox
            id="masterId"
            title="Master roll Id"
            placeholder="ID"
            onChange={(e) => handleChange('masterId', e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="space-x-2">
        <Button
          disabled={!isChanged}
          onClick={handleSave}
          className="bg-green-500"
        >
          Save changes
        </Button>
        <Button onClick={() => setTab('details')}>
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}
export default MasterRoll
