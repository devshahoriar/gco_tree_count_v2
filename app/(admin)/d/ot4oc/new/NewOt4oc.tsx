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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, ArrowRight, Search, X } from 'lucide-react'
import { useState } from 'react'

const NewOt4oc = () => {
  const [tab, setTab] = useState('masterRoll')
  return (
    <section>
      <div className="flex justify-between items-center">
        <p className="font-bold">One Tree for One Child</p>
        <div className="flex items-center gap-2">
          <Button>
            <Search />
            <span className="hidden md:inline">Search</span>
          </Button>
          <Button>
            <X />
            <span className="hidden md:inline">Reset</span>
          </Button>
        </div>
      </div>
      <div className="mt-5">
        <Tabs
          onValueChange={setTab}
          value={tab}
          defaultValue="masterRoll"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="masterRoll">Master roll</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contant">Contact</TabsTrigger>
            <TabsTrigger value="matinfo">
              Maternity <span className="hidden md:inline">-information</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="masterRoll">
            {tab === 'masterRoll' && <MasterRoll setTab={setTab} />}
          </TabsContent>
          <TabsContent value="details">
            {tab === 'details' && <Details setTab={setTab} />}
          </TabsContent>
          <TabsContent value="contant">
            {tab === 'contant' && <Content setTab={setTab} />}
          </TabsContent>
          <TabsContent value="matinfo">
            {tab === 'matinfo' && <MatiInfo />}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

const MasterRoll = ({ setTab }: { setTab: (arg: string) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Master roll</CardTitle>
        <CardDescription>
          Initial information about the child and the tree.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            id="name"
            title="Child Name / Rechivar name"
            placeholder="Name"
          />

          <InputBox id="fName" title="Father Name" placeholder="Name" />
          <InputBox id="village" title="Village Name" placeholder="Village" />
          <InputBox id="phone" title="Phone" placeholder="Mobile" />
          <InputBox
            id="treeCount"
            title="How many tree plant"
            placeholder="Tree Count"
          />
          <InputBox id="masterId" title="Master roll Id" placeholder="ID" />
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button>Save changes</Button>
        <Button onClick={() => setTab('details')}>
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

const Details = ({ setTab }: { setTab: (arg0: string) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>
          Child and parent details. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            id="name"
            title="Child Name / Rechivar name"
            placeholder="Name"
          />
          <InputBox id="gender" title="Child gender" placeholder="Gender" />
          <InputBox id="bithday" type="date" title="Child Birthday" />

          {/* //father info */}
          <InputBox id="fName" title="Father Name" placeholder="Name" />
          <InputBox id="fBithday" type="date" title="Father's Birthday" />
          <InputBox id="fNID" placeholder="Father's NID" title="Father's NID" />

          <InputParent>
            <Label>Father's Job</Label>
            <select
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
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
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
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
          <InputBox id="mName" title="Mother Name" placeholder="Name" />
          <InputBox id="mBithday" type="date" title="Mother's Birthday" />
          <InputBox id="mNID" placeholder="Mother's NID" title="Mother's NID" />

          <InputParent>
            <Label>Mother's Job</Label>
            <select
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
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
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
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
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>Select</option>

              <option value="islam">Islam</option>
              <option value="hindu">Hindu</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Delevary info</Label>
            <select
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>Select</option>

              <option value="normal">Normal</option>
              <option value="operation">Operation</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Child health on delevary</Label>
            <select
              name=""
              id=""
              className="from-input bg-transparent focus:outline-none rounded-md"
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
          />
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button>Save Change</Button>
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

const Content = ({ setTab }: { setTab: (arg0: string) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          Address and contact information details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox id="email" title="Email" type="email" placeholder="Email" />
          <InputBox id="phone" title="Phone" placeholder="Phone number" />
          <InputBox id="village" title="Village" placeholder="Village name" />
          <InputBox
            id="wordNo"
            title="Word No"
            type="number"
            placeholder="Word number"
          />

          <InputParent>
            <Label>Division</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Division</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>District/Zilla</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select District</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Upazilla</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Upazilla</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Union</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Union</option>
            </select>
          </InputParent>

          <InputParent>
            <Label>Post Office</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Post Office</option>
            </select>
          </InputParent>
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button>Save changes</Button>
        <Button onClick={() => setTab('details')}>
          <ArrowLeft /> Previous
        </Button>
        <Button onClick={() => setTab('matinfo')}>
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

const MatiInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maternity Information</CardTitle>
        <CardDescription>
          Details about pregnancy and child birth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox id="treePlantDate" title="Tree Plant Date" type="date" />
          <InputParent>
            <Label>Tree Type</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Tree Type</option>
            </select>
          </InputParent>
          <InputBox
            id="whoPlanName"
            title="Who Planted the Tree"
            placeholder="Name"
          />
          <InputBox id="bornWeek" title="Birth Week" placeholder="Week number" />
          <InputBox
            id="bornWeight"
            title="Birth Weight"
            placeholder="Weight in KG"
          />
          <InputBox
            id="thChild"
            title="Child Number"
            placeholder="Which number child"
          />
          <InputParent>
            <Label>Child Birth Place</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option>Select Birth Place</option>
              <option value="hospital">Hospital</option>
              <option value="home">Home</option>
              <option value="other">Other</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Mother's Contact with Expert</Label>
            <select 
              id="motherContractExpart"
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </InputParent>
          <InputBox
            id="howManyTimeContractExpart"
            title="Number of Expert Consultations"
            placeholder="Number"
          />
          <InputParent>
            <Label>Mother's Freedom to Visit Expert</Label>
            <select className="from-input bg-transparent focus:outline-none rounded-md">
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </InputParent>
          <InputBox
            id="motherSeriousSick"
            title="Mother's Serious Sickness"
            placeholder="If any"
          />
          <InputBox
            id="preventCozToGoExpert"
            title="Reasons Preventing Expert Visit"
            placeholder="If any"
          />
          <InputBox
            id="whereIsMotherWhenPregnant"
            title="Mother's Location During Pregnancy"
            placeholder="Location details"
          />
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button>Submit All Information</Button>
        {/* <Button onClick={() => setTab('contant')}>
          <ArrowLeft /> Previous
        </Button> */}
      </CardFooter>
    </Card>
  )
}

export default NewOt4oc
