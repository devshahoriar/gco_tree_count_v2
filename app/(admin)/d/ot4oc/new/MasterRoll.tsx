/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
'use client'
import InputBox, { InputParent } from '@/components/shared/InputBox'
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

import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import AddInitialTreeInfo from './AddInitialTreeInfo'

const dataSchema = z.object({
  childName: z.string().nonempty('Child name is required'),
  fatherName: z.string().nonempty('Father name is required'),
  village: z.string().nonempty('Village name is required'),
  phone: z.string().nonempty('Phone number is required'),
  tree_count: z.number({
    required_error: 'Tree count is required',
    message: 'Tree count must be a number',
  }),
  masterId: z.string().nonempty('Master roll ID is required'),
})

const MasterRoll = ({
  setTab,
  baby,
  setBaby,
}: {
  baby: any
  setBaby: any
  setTab: (arg: string) => void
}) => {
  const [error, setError] = useState('')
  const [isChanged, setIsChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (name: string, value: string | number | boolean) => {
    setIsChanged(true)
    setBaby({ ...baby, [name]: value })
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      dataSchema.parse(baby)
      setError('')

      const x = await fetch('/api/addtree', {
        method: 'POST',
        body: JSON.stringify(baby),
        credentials: 'include',
      }).then((res) => res.json())

      if (x?.error) {
        setError(x.error)
        if (x?.type === 'DUPLICATE_PHONE') {
          handleChange('subNumber', true)
        }
      }

      if (x?.success) {
        handleChange('id', x?.data)
        setIsChanged(false)
        toast.success('Data saved successfully')
      }
    } catch (e: any) {
      setError(e.errors?.[0]?.message || 'An error occurred')
    } finally {
      setIsLoading(false)
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
            value={baby.childName}
            onChange={(e) => handleChange('childName', e.target.value)}
          />

          <InputBox
            id="fName"
            title="Father Name"
            placeholder="Name"
            value={baby.fatherName}
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
          <InputBox
            id="village"
            title="Village Name"
            placeholder="Village"
            value={baby.village}
            onChange={(e) => handleChange('village', e.target.value)}
          />
          <InputBox
            id="phone"
            title="Phone"
            placeholder="Mobile"
            value={baby.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <InputBox
            id="treeCount"
            title="How many tree plant"
            type="number"
            className="appearance-none"
            placeholder="Tree Count"
            value={baby.tree_count}
            onClick={(e) => e.currentTarget.select()}
            onChange={(e) => handleChange('tree_count', Number(e.target.value))}
          />
          <InputBox
            id="masterId"
            title="Master roll Id"
            placeholder="ID"
            value={baby.masterId}
            onChange={(e) => handleChange('masterId', e.target.value)}
          />
          {baby?.subNumber && (
            <InputParent className="flex-row items-center gap-2 space-y-0">
              <Checkbox
                id="dupNumReeor"
                onCheckedChange={(v) => handleChange('subNumber', v)}
              />
              <Label htmlFor="dupNumReeor">Subpress worning.</Label>
            </InputParent>
          )}
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="space-x-2">
        <Button disabled={!isChanged || isLoading} onClick={handleSave}>
          {isLoading ? 'Saving...' : 'Save changes'}
        </Button>
        <Button
          onClick={() => {
            if (isChanged) {
              toast.error('Please save changes first')
              return
            }
            setTab('details')
          }}
          disabled={isLoading}
        >
          Next <ArrowRight />
        </Button>
        {baby.id && <AddInitialTreeInfo id={baby.id} />}
      </CardFooter>
    </Card>
  )
}
export default MasterRoll
