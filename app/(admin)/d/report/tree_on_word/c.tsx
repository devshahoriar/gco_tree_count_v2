/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

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
import { format } from 'date-fns'
import { useState } from 'react'
import { getDevision, getTreeCountByWord, getUnion, getUpZilla, getZilla } from './action'
import PrintHaeder from '../PrintHaeder'

interface TreeType {
  id: number
  name: string
}

interface TreeByWordData {
  treeType: TreeType;
  wordCounts: {
    [key: string]: number;
  };
}

interface ReportData {
  treeData: TreeByWordData[];
  wordNumbers: string[];
  locationInfo: {
    division: { name: string } | null;
    zilla: { name: string } | null;
    upZilla: { name: string } | null;
    union: { name: string } | null;
  }
}

interface InputState {
  fileType?: string;
  startDate?: Date;
  endDate?: Date;
  division?: any;
  zilla?: any;
  upZilla?: any;
  union?: any;
  wordNo?: string;
}

const TreeOnWordSelect = () => {
  const [input, setInput] = useState<InputState>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [reportData, setReportData] = useState<ReportData | null>(null)

  const _hendelSubmit = async () => {
    try {
      // Validate required fields
      if (!input.fileType || !input.startDate || !input.endDate || !input.division) {
        setError('Please fill all required fields')
        return
      }

      setError('')
      setLoading(true)

      const data = await getTreeCountByWord({
        division: input.division?.id?.toString() || input.division,
        zilla: input.zilla?.id?.toString() || input.zilla,
        upZilla: input.upZilla?.id?.toString() || input.upZilla,
        union: input.union?.id?.toString() || input.union,
        startDate: input.startDate,
        endDate: input.endDate
      })

      // Ensure all word numbers from 1-9 are included
      const allWordNumbers = [...Array(9)].map((_, i) => (i + 1).toString());
      
      // Merge with existing word numbers from data
      const existingWordNumbers = new Set(data.wordNumbers);
      const mergedWordNumbers = allWordNumbers.filter(wordNo => 
        // Keep all numbers 1-9 if they're in the existing data
        existingWordNumbers.has(wordNo)
      ).sort((a, b) => parseInt(a) - parseInt(b));
      
      // Update the data with the complete set of word numbers
      const updatedData = {
        ...data,
        wordNumbers: mergedWordNumbers
      };

      setReportData(updatedData as any);
      
      // If PDF is selected, trigger print dialog
      if (input.fileType === 'pdf') {
        setTimeout(() => {
          window.print()
        }, 500)
      } else if (input.fileType === 'excel') {
        // Excel export logic would go here if implemented
        setError('Excel export not implemented yet')
      }
    } catch (error: any) {
      setError(error?.message ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals for each word number
  const wordTotals: { [key: string]: number } = {}
  if (reportData?.wordNumbers) {
    reportData.wordNumbers.forEach(wordNo => {
      wordTotals[wordNo] = reportData.treeData.reduce(
        (sum, treeData) => sum + (treeData.wordCounts[wordNo] || 0), 
        0
      )
    })
  }

  // Calculate total trees for each species
  const speciesTotals: { [key: number]: number } = {}
  if (reportData?.treeData) {
    reportData.treeData.forEach(data => {
      speciesTotals[data.treeType.id] = Object.values(data.wordCounts).reduce((sum, count) => sum + count, 0)
    })
  }

  // Calculate grand total
  const grandTotal = Object.values(speciesTotals).reduce((sum, count) => sum + count, 0)

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
          <Button onClick={_hendelSubmit} disabled={loading} >
            {loading ? 'Loading...' : 'Generate Report'}
          </Button>
        </CardFooter>

        <style>
          {`.react-date-picker__wrapper{
          padding: 3px 0px;
          border-color: hsl(var(--input));
          }`}
        </style>
      </Card>

      {/* Printable Report Section */}
      {reportData && (
        <div className="mt-10 printable hidden print:block">
          <PrintHaeder />
          <div className="mt-5 border-t pt-2 print:w-screen">
            <h1 className="underline text-center font-semibold">
              Tree Count by Word Report
            </h1>
            <p className="text-center">
              {reportData.locationInfo.division?.name || ''} 
              {reportData.locationInfo.zilla?.name ? `, ${reportData.locationInfo.zilla.name}` : ''}
              {reportData.locationInfo.upZilla?.name ? `, ${reportData.locationInfo.upZilla.name}` : ''}
              {reportData.locationInfo.union?.name ? `, ${reportData.locationInfo.union.name}` : ''}
            </p>
            <div className="flex justify-between mt-5">
              <p>Date: {format(new Date(), 'dd-MMM-yyyy')}</p>
              <p>Period: {format(new Date(input.startDate!), 'dd-MMM-yyyy')} to {format(new Date(input.endDate!), 'dd-MMM-yyyy')}</p>
              <p className="font-semibold">
                Total Trees: {grandTotal}
              </p>
            </div>
          </div>

          {/* Tree by Word Table */}
          <table className="border-collapse border w-full mt-4 text-center print:w-screen">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Sl.No</th>
                <th className="border p-2">Species Name</th>
                {reportData.wordNumbers.map(wordNo => (
                  <th key={wordNo} className="border p-2">Word-{wordNo}</th>
                ))}
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.treeData.map((data, index) => (
                <tr key={data.treeType.id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{data.treeType.name}</td>
                  {reportData.wordNumbers.map(wordNo => (
                    <td key={wordNo} className="border p-2">
                      {data.wordCounts[wordNo] || 0}
                    </td>
                  ))}
                  <td className="border p-2 font-semibold">
                    {speciesTotals[data.treeType.id]}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border p-2" colSpan={2}>
                  Total
                </td>
                {reportData.wordNumbers.map(wordNo => (
                  <td key={wordNo} className="border p-2">
                    {wordTotals[wordNo]}
                  </td>
                ))}
                <td className="border p-2">{grandTotal}</td>
              </tr>
            </tbody>
          </table>

         
         
        </div>
      )}
    </div>
  )
}

export default TreeOnWordSelect
