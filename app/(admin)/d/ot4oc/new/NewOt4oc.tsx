'use client'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, X } from 'lucide-react'
import { HTMLProps } from 'react'

const NewOt4oc = () => {
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
        <Tabs defaultValue="masterRoll" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="masterRoll">Master roll</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contant">Contact</TabsTrigger>
            <TabsTrigger value="matinfo">
              Maternity <span className="hidden md:inline">-information</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="masterRoll">
            <MasterRoll />
          </TabsContent>
          <TabsContent value="details">
            <Details />
          </TabsContent>
          <TabsContent value="contant">
            <Content />
          </TabsContent>
          <TabsContent value="matinfo">
            <MatiInfo />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

const MasterRoll = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Master roll</CardTitle>
        <CardDescription>
          Initial information about the child and the tree.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <InputBox id="masterId" title="Master roll" placeholder="ID" />
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  )
}

const Details = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>
          Child and parent details. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <div className="space-y-2 flex flex-col">
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
        </div>
        <div className="space-y-2 flex flex-col">
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
        </div>

        {/* mother info */}
        <InputBox id="mName" title="Mother Name" placeholder="Name" />
        <InputBox id="mBithday" type="date" title="Mother's Birthday" />
        <InputBox id="mNID" placeholder="Mother's NID" title="Mother's NID" />

        <div className="space-y-2 flex flex-col">
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
        </div>
        <div className="space-y-2 flex flex-col">
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
        </div>

        <div className="space-y-2 flex flex-col">
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
        </div>

        <div className="space-y-2 flex flex-col">
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
        </div>
        <div className="space-y-2 flex flex-col">
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
        </div>
        <InputBox id="fameliIncome" title="Famely income" placeholder="Taka" />
      </CardContent>
      <CardFooter>
        <Button>Save Change</Button>
      </CardFooter>
    </Card>
  )
}
const Content = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Make changes to your account here. Click save when you're done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@peduarte" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save changes</Button>
      </CardFooter>
    </Card>
  )
}

const MatiInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password here. After saving, you'll be logged out.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save password</Button>
      </CardFooter>
    </Card>
  )
}

type InputBoxProps = {
  title: string
  id: string
} & HTMLProps<HTMLInputElement>

const InputBox = ({ id, title, ...props }: InputBoxProps) => {
  return (
    <div className="space-y-2 flex flex-col">
      <Label htmlFor={id}>{title}</Label>
      <input
        id={id}
        name={id}
        {...props}
        className="from-input bg-transparent focus:outline-none rounded-md"
      />
    </div>
  )
}

export default NewOt4oc
