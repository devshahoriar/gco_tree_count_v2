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
import useSWR from 'swr'
const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Content = ({
  setTab,
  allDivi,
}: {
  allDivi: any
  setTab: (arg0: string) => void
}) => {
  const [data, setData] = useState<any>({})
  const [isChanged, setIsChanged] = useState(false)

  const { data: zillas } = useSWR(
    () =>
      data?.divisionId !== undefined
        ? `/api/addData?divisionId=${data.divisionId}`
        : null,
    fetcher
  )

  const { data: Upzillas } = useSWR(
    () =>
      data?.zillaId !== undefined
        ? `/api/addData?zillaId=${data.zillaId}`
        : null,
    fetcher
  )

  const { data: unions } = useSWR(
    () =>
      data?.upZillaId !== undefined
        ? `/api/addData?upZillaId=${data.upZillaId}`
        : null,
    fetcher
  )

  const handleChange = (name: string, value: string | number) => {
    setData({ ...data, [name]: value })
    setIsChanged(true)
  }

  const hendelSubmit = () => {
    setIsChanged(false)
    console.log(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          <div className="flex items-center justify-between">
            <p>Address and contact information details.</p>
            {isChanged && <p className="text-red-500">*Please save changes</p>}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputBox
            id="email"
            title="Email"
            type="email"
            placeholder="Email"
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <InputBox
            id="phone"
            title="Phone"
            placeholder="Phone number"
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <InputBox
            id="village"
            title="Village"
            placeholder="Village name"
            onChange={(e) => handleChange('village', e.target.value)}
          />
          <InputParent>
            <Label>Word No</Label>
            <select
              onChange={(e) => handleChange('wordNo', e.target.value)}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option value="">Select Word No</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </InputParent>
          <InputParent>
            <Label>Division</Label>
            <select
              onChange={async (e) => handleChange('divisionId', e.target.value)}
              className="from-input bg-transparent focus:outline-none rounded-md"
            >
              <option>Select Division</option>
              {allDivi.map((divi: any) => (
                <option key={divi.id} value={divi.id}>
                  {divi.name}
                </option>
              ))}
            </select>
          </InputParent>

          {zillas && (
            <InputParent>
              <Label>Zilla</Label>
              <select
                onChange={(e) => handleChange('zillaId', e.target.value)}
                className="from-input bg-transparent focus:outline-none rounded-md"
              >
                <option>Select Zilla</option>
                {zillas.map((zil: any) => (
                  <option key={zil.id} value={zil.id}>
                    {zil.name}
                  </option>
                ))}
              </select>
            </InputParent>
          )}

          {Upzillas && (
            <InputParent>
              <Label>Upazilla</Label>
              <select
                onChange={(e) => handleChange('upZillaId', e.target.value)}
                className="from-input bg-transparent focus:outline-none rounded-md"
              >
                <option>Select Upazilla</option>
                {Upzillas.map((upz: any) => (
                  <option key={upz.id} value={upz.id}>
                    {upz.name}
                  </option>
                ))}
              </select>
            </InputParent>
          )}

          {unions && (
            <InputParent>
              <Label>Union</Label>
              <select
                onChange={(e) => handleChange('unionId', e.target.value)}
                className="from-input bg-transparent focus:outline-none rounded-md"
              >
                <option>Select Union</option>
                {unions?.unions?.map((uni: any) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
            </InputParent>
          )}

          {unions && (
            <InputParent>
              <Label>Post Office</Label>
              <select
                onChange={(e) => handleChange('postId', e.target.value)}
                className="from-input bg-transparent focus:outline-none rounded-md"
              >
                <option>Select Post Office</option>
                {unions?.posts?.map((post: any) => (
                  <option key={post.id} value={post.id}>
                    {post.name}
                  </option>
                ))}
              </select>
            </InputParent>
          )}
        </div>
      </CardContent>
      <CardFooter className="space-x-2">
        <Button
          onClick={hendelSubmit}
          disabled={!isChanged}
          className="bg-green-500"
        >
          Save changes
        </Button>
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

export default Content
