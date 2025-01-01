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

const Details = ({ setTab }: { setTab: (arg0: string) => void }) => {
  const [data, setData] = useState<any>({
    childName: '',
    childBirthDate: '',
    childGender: '',
    fatherName: '',
    fatherBirthDate: '',
    fatherNid: '',
    fatherJob: '',
    fatherEdu: '',
    motherName: '',
    motherBirthDate: '',
    motherNid: '',
    motherJob: '',
    motherEdu: '',
    religion: '',
    deliveryInfo: '',
    deliveryChildHealth: '',
    familyIncome: ''
  })
  const [isChanged, setIsChanged] = useState(false)
  const handleChange = (name: string, value: string | number) => {
    setData({ ...data, [name]: value })
    setIsChanged(true)
  }

  const handleSave = () => {
    // Implement save functionality here
    console.log(isChanged)
    console.log('Data saved:', data)
    setIsChanged(false)
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
            onChange={(e) => handleChange('childName', e.target.value)}
          />
          <InputBox
            id="gender"
            title="Child gender"
            placeholder="Gender"
            onChange={(e) => handleChange('childGender', e.target.value)}
          />
          <InputBox
            id="bithday"
            type="date"
            title="Child Birthday"
            onChange={(e) => handleChange('childBirthDate', e.target.value)}
          />

          {/* //father info */}
          <InputBox
            id="fName"
            title="Father Name"
            placeholder="Name"
            onChange={(e) => handleChange('fatherName', e.target.value)}
          />
          <InputBox
            id="fBithday"
            type="date"
            title="Father's Birthday"
            onChange={(e) => handleChange('fatherBirthDate', e.target.value)}
          />
          <InputBox
            id="fNID"
            placeholder="Father's NID"
            title="Father's NID"
            onChange={(e) => handleChange('fatherNid', e.target.value)}
          />

          <InputParent>
            <Label>Father's Job</Label>
            <select
              name="fatherJob"
              id="fatherJob"
              className="from-input bg-transparent focus:outline-none rounded-md"
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
            onChange={(e) => handleChange('motherName', e.target.value)}
          />
          <InputBox
            id="mBithday"
            type="date"
            title="Mother's Birthday"
            onChange={(e) => handleChange('motherBirthDate', e.target.value)}
          />
          <InputBox
            id="mNID"
            placeholder="Mother's NID"
            title="Mother's NID"
            onChange={(e) => handleChange('motherNid', e.target.value)}
          />

          <InputParent>
            <Label>Mother's Job</Label>
            <select
              name="motherJob"
              id="motherJob"
              className="from-input bg-transparent focus:outline-none rounded-md"
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
              onChange={(e) => handleChange('deliveryChildHealth', e.target.value)}
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
            onChange={(e) => handleChange('familyIncome', e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button
          onClick={handleSave}
          disabled={!isChanged}
          className="bg-green-500"
        >Save Change</Button>
        <Button onClick={() => setTab('masterRoll')}>
          <ArrowLeft /> Previous
        </Button>
        <Button onClick={() => setTab('contant')}>
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Details
