/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import InputBox, { InputParent } from '@/components/shared/InputBox'
/* eslint-disable react/no-unescaped-entities */
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

import { useState } from 'react'
import { toast } from 'sonner'

const MatiInfo = ({ baby, setBaby }: { baby: any; setBaby: any }) => {
  const [isChanged, setIsChanged] = useState(false)
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
      await fetch('/api/addtree', {
        method: 'POST',
        body: JSON.stringify(baby),
        credentials: 'include',
      }).then((res) => res.json())

      setIsChanged(false)
      toast.success('Maternity information saved')
    } catch (error) {
      console.log(error)
      toast.error('Failed to save maternity information')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maternity Information</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <p>Details about pregnancy and child birth.</p>
            {isChanged && <p className="text-red-500">*Please save changes</p>}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            id="treePlantDate"
            title="Tree Plant Date"
            type="date"
            value={
              baby.treePlantDate
                ? new Date(baby.treePlantDate).toISOString().split('T')[0]
                : ''
            }
            onChange={(e) => handleChange('treePlantDate', e.target.value)}
          />
          <InputBox
            id="whoPlanName"
            title="Who Planted the Tree"
            placeholder="Name"
            value={baby?.whoPlanName || ''}
            onChange={(e) => handleChange('whoPlanName', e.target.value)}
          />
          <InputParent>
            <Label>Birth Week</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.bornWeek || ''}
              onChange={(e) => handleChange('bornWeek', e.target.value)}
            >
              <option value="">Select Birth Week</option>
              <option value="35">35</option>
              <option value="36">36</option>
              <option value="37">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="others">Others</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Birth Weight (kg)</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.bornWeight || ''}
              onChange={(e) => handleChange('bornWeight', e.target.value)}
            >
              <option value="">Select Birth Weight</option>
              <option value="2.1">2.1</option>
              <option value="2.2">2.2</option>
              <option value="2.3">2.3</option>
              <option value="2.4">2.4</option>
              <option value="2.5">2.5</option>
              <option value="2.6">2.6</option>
              <option value="2.7">2.7</option>
              <option value="2.8">2.8</option>
              <option value="2.9">2.9</option>
              <option value="3.0">3.0</option>
              <option value="3.1">3.1</option>
              <option value="3.2">3.2</option>
              <option value="3.3">3.3</option>
              <option value="3.4">3.4</option>
              <option value="3.5">3.5</option>
              <option value="3.6">3.6</option>
              <option value="3.7">3.7</option>
              <option value="3.8">3.8</option>
              <option value="3.9">3.9</option>
              <option value="4.0">4.0</option>
              <option value="other">Other</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Child Number</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.thChild || ''}
              onChange={(e) => handleChange('thChild', e.target.value)}
            >
              <option value="">Select Child Number</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
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

          <InputParent>
            <Label>Child Birth Place</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.childBornPlace || ''}
              onChange={(e) => handleChange('childBornPlace', e.target.value)}
            >
              <option value="">Select Birth Place</option>
              <option value="house">House</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="clinicNGO">Clinic NGO</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Contact with Expert</Label>
            <select
              id="motherContractExpart"
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.motherContractExpart || ''}
              onChange={(e) =>
                handleChange('motherContractExpart', e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Number of Expert Consultations</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.howManyTimeContractExpart || ''}
              onChange={(e) =>
                handleChange('howManyTimeContractExpart', e.target.value)
              }
            >
              <option value="">Select Number</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Freedom to Visit Expert</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.motherFreedomVisitExpert || ''}
              onChange={(e) =>
                handleChange('motherFreedomVisitExpert', e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Serious Sickness</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.motherSeriousSick || ''}
              onChange={(e) =>
                handleChange('motherSeriousSick', e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Reasons Preventing Expert Visit</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.preventCozToGoExpert || ''}
              onChange={(e) =>
                handleChange('preventCozToGoExpert', e.target.value)
              }
            >
              <option value="">Select Reason</option>
              <option value="distance">Distance</option>
              <option value="husband's_Obohela">Husband's Obohela</option>
              <option value="high_Expense">High Expense</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Location During Pregnancy</Label>
            <select
              className="from-input bg-transparent focus:outline-none rounded-md"
              value={baby?.whereIsMotherWhenPregnant || ''}
              onChange={(e) =>
                handleChange('whereIsMotherWhenPregnant', e.target.value)
              }
            >
              <option value="">Select Location</option>
              <option value="fathersHouse">Father's House</option>
              <option value="husbandsHouse">Husband's House</option>
            </select>
          </InputParent>
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button onClick={handleSave} disabled={!isChanged || isLoading}>
          {isLoading ? 'Submitting' : 'Submit'}
        </Button>
        {/* <Button onClick={() => setTab('contant')}>
          <ArrowLeft /> Previous
        </Button> */}
      </CardFooter>
    </Card>
  )
}

export default MatiInfo
