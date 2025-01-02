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

import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const Details = ({
  setTab,
  baby,
  setBaby,
}: {
  baby: any
  setBaby: any
  setTab: (arg: string) => void
}) => {
  const [isChanged, setIsChanged] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (name: string, value: string | number) => {
    setBaby({ ...baby, [name]: value })
    setIsChanged(true)
  }

  const handleSave = async () => {
    if (!baby?.id) {
      toast.error('Please fill the master roll first')
      return
    }
    try {
      setIsLoading(true)
      const response = await fetch('/api/addtree', {
        method: 'POST',
        body: JSON.stringify(baby),
        credentials: 'include',
      }).then((res) => res.json())

      if (response?.error) {
        setError(response.error)
        console.error(response.error)
      } else if (response?.success) {
        console.log('Data saved:', response.data)
        setIsChanged(false)
        setError('')
        toast.success('Details saved successfully')
      }
    } catch (error) {
      setError('Error saving data')
      console.error('Error saving data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <p>Child and parent details. Click save when you're done.</p>
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
            value={baby.childName || ''}
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
          <InputBox
            id="bithday"
            type="date"
            title="Child Birthday"
            value={
              baby.childBirthDate
                ? new Date(baby.childBirthDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => handleChange('childBirthDate', e.target.value)}
          />

          {/* //father info */}
          <InputBox
            id="fName"
            title="Father Name"
            placeholder="Name"
            value={baby.fatherName || ''}
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
          <InputBox
            id="fBithday"
            type="date"
            title="Father's Birthday"
            value={
              baby.fatherBirthDate
                ? new Date(baby.fatherBirthDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => handleChange('fatherBirthDate', e.target.value)}
          />
          <InputBox
            id="fNID"
            placeholder="Father's NID"
            title="Father's NID"
            value={baby.fatherNid || ''}
            onChange={(e) => handleChange('fatherNid', e.target.value)}
          />

          <InputParent>
            <Label>Father's Job</Label>
            <select
              name="fatherJob"
              id="fatherJob"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.fatherJob || ''}
              onChange={(e) => handleChange('fatherJob', e.target.value)}
            >
              <option>Select</option>
              <option value="Private Service">Private Service</option>
              <option value="Govt Service">Govt Service</option>
              <option value="Daily labour">Daily labour</option>
              <option value="Teacher">Teacher</option>
              <option value="Business">Business</option>
              <option value="Doctor">Doctor</option>
              <option value="Farmer">Farmer</option>
              <option value="Other">Other</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Father's Education</Label>
            <select
              name="fatherEdu"
              id="fatherEdu"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.fatherEdu || ''}
              onChange={(e) => handleChange('fatherEdu', e.target.value)}
            >
              <option>Select</option>
              <option value="Phd">Phd</option>
              <option value="Masters">Masters</option>
              <option value="Honors">Honors</option>

              <option value="Higher secondary">Higher secondary</option>

              <option value="Secondary">Secondary </option>

              <option value="Primary">Primary </option>

              <option value="No formal education">No formal education</option>
            </select>
          </InputParent>

          {/* mother info */}
          <InputBox
            id="mName"
            title="Mother Name"
            placeholder="Name"
            value={baby.motherName || ''}
            onChange={(e) => handleChange('motherName', e.target.value)}
          />
          <InputBox
            id="mBithday"
            type="date"
            title="Mother's Birthday"
            value={
              baby.motherBirthDate
                ? new Date(baby.motherBirthDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => handleChange('motherBirthDate', e.target.value)}
          />
          <InputBox
            id="mNID"
            placeholder="Mother's NID"
            title="Mother's NID"
            value={baby.motherNid || ''}
            onChange={(e) => handleChange('motherNid', e.target.value)}
          />

          <InputParent>
            <Label>Mother's Job</Label>
            <select
              name="motherJob"
              id="motherJob"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.motherJob || ''}
              onChange={(e) => handleChange('motherJob', e.target.value)}
            >
              <option>Select</option>
              <option value="Private Service">Private Service</option>
              <option value="Govt Service">Govt Service</option>
              <option value="Daily labour">Daily labour</option>
              <option value="Teacher">Teacher</option>
              <option value="Business">Business</option>
              <option value="Doctor">Doctor</option>
              <option value="Farmer">Farmer</option>
              <option value="Other">Other</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Education</Label>
            <select
              name="motherEdu"
              id="motherEdu"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.motherEdu || ''}
              onChange={(e) => handleChange('motherEdu', e.target.value)}
            >
              <option>Select</option>
              <option value="Phd">Phd</option>
              <option value="Masters">Masters</option>
              <option value="Honors">Honors</option>

              <option value="Higher secondary">Higher secondary</option>

              <option value="Secondary">Secondary </option>

              <option value="Primary">Primary </option>

              <option value="No formal education">No formal education</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Relesian</Label>
            <select
              name="religion"
              id="religion"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.religion || ''}
              onChange={(e) => handleChange('religion', e.target.value)}
            >
              <option>Select</option>

              <option value="islam">Islam</option>
              <option value="hindu">Hindu</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Delevary info</Label>
            <select
              name="deliveryInfo"
              id="deliveryInfo"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.deliveryInfo || ''}
              onChange={(e) => handleChange('deliveryInfo', e.target.value)}
            >
              <option>Select</option>

              <option value="normal">Normal</option>
              <option value="operation">Operation</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Child health on delevary</Label>
            <select
              name="deliveryChildHealth"
              id="deliveryChildHealth"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby.deliveryChildHealth || ''}
              onChange={(e) =>
                handleChange('deliveryChildHealth', e.target.value)
              }
            >
              <option>Select</option>

              <option value="normal">Normal</option>
              <option value="abnormal">Abnormal</option>
            </select>
          </InputParent>
          <InputBox
            id="fameliIncome"
            title="Famely income"
            placeholder="Taka"
            value={baby.familyIncome || ''}
            onChange={(e) => handleChange('familyIncome', e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </CardContent>
      <CardFooter className="space-x-2">
        <Button onClick={handleSave} disabled={!isChanged || isLoading}>
          {isLoading ? 'Saving' : 'Save'}
        </Button>
        <Button
          onClick={() => {
            if (isChanged) {
              toast.error('Please save changes first')
              return
            }
            setTab('masterRoll')
          }}
          disabled={isLoading}
        >
          <ArrowLeft /> Previous
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
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Details
