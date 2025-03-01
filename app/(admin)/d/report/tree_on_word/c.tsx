/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

interface TreeType {
  id: number
  name: string
}

interface Tree {
  treeType: TreeType
  images: any[]
  lat: string | null
  lon: string | null
}

interface RowDataItem {
  id: number
  childName: string
  fatherName: string
  village: string
  wordNo: string
  union: { name: string }
  postOffice: {
    name: string
    postCode: string
  }
  upZilla: { name: string }
  zilla: { name: string }
  division: { name: string }
  Tree: Tree[]
  phone: string
  tree_count: number
}

import { InputParent } from '@/components/shared/InputBox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import DateInput from '@/components/shared/DateInput'
import { AsyncSelect } from '@/components/ui/async-select'
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
import { getDevision, getUnion, getUpZilla, getZilla } from './action'

interface InputState {
  fileType?: string
  imgType?: string
  startDate?: Date
  endDate?: Date
  division?: any
  zilla?: any
  upZilla?: any
  union?: any
  wordNo?: string
}

const TreeOnWordSelect = () => {
  const [input, setInput] = useState<InputState>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rowData, setRowData] = useState<RowDataItem[]>([])
  return (
    <div>
      <Card className="w-[500px] print:hidden mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Tree on word</CardTitle>
          <CardDescription>Make your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <InputParent>
              <Label>File type</Label>
              <Select
                value={input?.fileType}
                onValueChange={(x) => setInput({ ...input, fileType: x })}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </InputParent>

            <InputParent>
              <Label>Start Date</Label>
              <DateInput
                value={input?.startDate}
                onChange={(x) => setInput({ ...input, startDate: x })}
              />
            </InputParent>
            <InputParent>
              <Label>End Date</Label>
              <DateInput
                value={input?.endDate}
                onChange={(x) => setInput({ ...input, endDate: x })}
              />
            </InputParent>

            <InputParent>
              <Label>Select Division</Label>
              <AsyncSelect
                fetcher={getDevision as any}
                renderOption={(item: any) => item.name}
                getOptionValue={(item) => item.id + ''}
                getDisplayValue={(item) => item.name}
                label="Select"
                value={input?.division}
                onChange={(x) => setInput({ ...input, division: x as any })}
              />
            </InputParent>
            {input?.division && (
              <InputParent>
                <Label>Select Zilla</Label>
                <AsyncSelect
                  fetcher={(x) => getZilla(x, input?.division) as any}
                  renderOption={(item: any) => item.name}
                  getOptionValue={(item) => item.id + ''}
                  getDisplayValue={(item) => item.name}
                  label="Select"
                  value={input?.zilla}
                  onChange={(x) => setInput({ ...input, zilla: x as any })}
                />
              </InputParent>
            )}
            {input?.zilla && (
              <InputParent>
                <Label>Select Up-Zilla</Label>
                <AsyncSelect
                  fetcher={(x) => getUpZilla(x, input?.zilla) as any}
                  renderOption={(item: any) => item.name}
                  getOptionValue={(item) => item.id + ''}
                  getDisplayValue={(item) => item.name}
                  label="Select"
                  value={input?.upZilla}
                  onChange={(x) => setInput({ ...input, upZilla: x as any })}
                />
              </InputParent>
            )}
            {input?.upZilla && (
              <InputParent>
                <Label>Select Union</Label>
                <AsyncSelect
                  fetcher={(x) => getUnion(x, input?.upZilla) as any}
                  renderOption={(item: any) => item.name}
                  getOptionValue={(item) => item.id + ''}
                  getDisplayValue={(item) => item.name}
                  label="Select"
                  value={input?.union}
                  onChange={(x) => setInput({ ...input, union: x as any })}
                />
              </InputParent>
            )}
            {input?.union && (
              <InputParent>
                <Label>Select Word No</Label>
                <Select
                  value={input?.wordNo}
                  onValueChange={(x) => setInput({ ...input, wordNo: x })}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Word" />
                  </SelectTrigger>
                  <SelectContent>
                    {new Array(9).fill(0).map((_, i) => (
                      <SelectItem key={i} value={i + 1 + ''}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputParent>
            )}
          </div>
          {loading && (
            <div className="text-center text-blue-500 text-sm mt-3">
              Loading...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 text-sm mt-3">{error}</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button disabled={loading} onClick={null}>
            {loading ? 'Loading...' : 'Print'}
          </Button>
        </CardFooter>

        <style>
          {`.react-date-picker__wrapper{
          padding: 3px 0px;
          border-color: hsl(var(--input));
          }`}
        </style>
      </Card>
    </div>
  )
}

export default TreeOnWordSelect
