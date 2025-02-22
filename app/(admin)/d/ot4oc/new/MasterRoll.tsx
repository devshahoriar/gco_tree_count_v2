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

import DateInput from '@/components/shared/DateInput'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import AddInitialTreeInfo from './AddInitialTreeInfo'

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
)

const dataSchema = z.object({
  childName: z
    .string({
      required_error: 'Child name is required',
      message: 'Child name must be a string',
    })
    .min(1, 'Child name is required'),
  fatherName: z
    .string({
      required_error: 'Father name is required',
      message: 'Father name must be a string',
    })
    .min(1, 'Father name is required'),
  phone: z
    .string({
      required_error: 'Phone number is required',
      message: 'Phone number must be a string',
    })
    .regex(phoneRegex, 'Invalid phonen Number!')
    .length(11, 'Phone number must be 11 digit'),
  tree_count: z.number({
    required_error: 'Tree count is required',
    message: 'Tree count must be a number',
  }),
  masterId: z.string().min(1, 'Master roll ID is required'),
  childGender: z.enum(['Boy', 'Girl', 'Other'], {
    required_error: 'Child gender is required',
    invalid_type_error: 'Please select a valid gender',
    message: 'Please select a valid gender',
  }),
  deliveryChildHealth: z.enum(['normal', 'abnormal'], {
    required_error: 'Child health status is required',
    invalid_type_error: 'Please select a valid health status',
    message: 'Please select a valid health status',
  }),
  treePlantDate: z.date({ message: 'Tree plant date is required' }),
  whoPlanName: z.string({
    message: 'Tree planter name is required',
  }),
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
        setTab('contant')
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
            id="masterId"
            title="Master roll Id"
            placeholder="ID"
            value={baby.masterId}
            onChange={(e) => handleChange('masterId', e.target.value)}
            pattern="[0-9]*"
            inputMode="numeric"
          />
          <InputBox
            id="name"
            title="Child Name / Rechivar name"
            placeholder="Name"
            value={baby.childName}
            onChange={(e) => handleChange('childName', e.target.value)}
          />
          <InputParent>
            <Label>Child Gender</Label>
            <select
              name="childGender"
              id="childGender"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.childGender || ''}
              onChange={(e) => handleChange('childGender', e.target.value)}
            >
              <option>Select</option>
              <option value="Boy">Boy</option>
              <option value="Girl">Girl</option>
              <option value="Other">Other</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Child health on born</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.deliveryChildHealth || ''}
              onChange={(e) =>
                handleChange('deliveryChildHealth', e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </InputParent>
          <InputBox
            id="fName"
            title="Father Name"
            placeholder="Name"
            value={baby.fatherName}
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />

          <InputBox
            id="phone"
            title="Phone"
            type="tel"
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

          <InputParent>
            <Label>Tree Plant Date</Label>
            <DateInput
              onChange={(e) => {
                console.log(e)
                handleChange('treePlantDate', e)
              }}
              value={
                baby?.treePlantDate ? new Date(baby.treePlantDate) : undefined
              }
            />
          </InputParent>
          <InputBox
            id="whoPlanName"
            title="Who Planted the Tree"
            placeholder="Name"
            value={baby?.whoPlanName || ''}
            onChange={(e) => handleChange('whoPlanName', e.target.value)}
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
          {isLoading ? 'Saving' : 'Save'}
        </Button>
        <Button
          onClick={() => {
            if (isChanged) {
              toast.error('Please save changes first')
              return
            }
            setTab('contant')
          }}
          disabled={isLoading}
        >
          <span className="hidden md:block">Next</span> <ArrowRight />
        </Button>
        {baby.id && <AddInitialTreeInfo id={baby.id} />}
      </CardFooter>
    </Card>
  )
}
export default MasterRoll
