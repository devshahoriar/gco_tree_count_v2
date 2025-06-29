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
  masterId: string
}

import XLSX from 'xlsx'
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
import { useCallback, useState } from 'react'
import PrintHaeder from '../PrintHaeder'
import { getData, getDevision, getUnion, getUpZilla, getZilla } from './action'

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

export const SelectOptions = () => {
  const [input, setInput] = useState<InputState>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rowData, setRowData] = useState<RowDataItem[]>([])

  // const xport = useCallback(() => {
  //   const wb = XLSX.utils.table_to_book(document.getElementById('print'),{

  //   })
  //   XLSX.writeFile(wb, `report.xlsx`)
  // }, [])

  const xport = useCallback(() => {
    const wb = XLSX.utils.book_new()

    // Calculate the maximum number of images across all rows
    const maxImages = rowData.reduce(
      (max, item) => Math.max(max, item.Tree.length),
      0
    )

    // Create dynamic headers
    const headers = [
      'Master Id',
      'Recipient Child',
      'Father Name',
      'Address',
      'GPS coordinates',
      'Mobile No',
      'Species name',
      'Area of recipients land (hectares)',
      'Planted Trees (qty)',
      'Number of Photo Taken',
      ...Array.from({ length: maxImages }, (_, i) => `Photo URL ${i + 1}`),
    ]

    const wsData = [headers]

    // Map rowData to worksheet rows
    rowData.forEach((item: RowDataItem) => {
      const row = [
        item.masterId,
        item.childName,
        item.fatherName,
        `${item.village}, Word-${item.wordNo}, ${item.union?.name}, ${item.postOffice?.name}-${item.postOffice?.postCode}, ${item.upZilla?.name}, ${item.zilla?.name}`,
        item.Tree.some((t: { lat: any; lon: any }) => t.lat && t.lon)
          ? `${Number(
              item.Tree.find((t: { lat: any; lon: any }) => t.lat && t.lon)?.lat
            ).toFixed(2)}, ${Number(
              item.Tree.find((t: { lat: any; lon: any }) => t.lat && t.lon)?.lon
            ).toFixed(2)}`
          : '-',
        item.phone,
        item.Tree.map((t: { treeType: { name: any } }) => t.treeType.name).join(
          ', '
        ),
        '-', // Area of recipients land
        item.tree_count,
        item.Tree.filter(
          (t: { images: string | any[] }) => t.images?.length > 0
        ).length,
        ...Array.from({ length: maxImages }, (_, i) =>
          item.Tree[i]?.images?.[0]?.url ? `IMG${i + 1}` : ''
        ),
      ]

      wsData.push(row as any)
    })

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Add hyperlinks to Photo URL columns (starting from column index 10)
    rowData.forEach((item: RowDataItem, rowIndex) => {
      item.Tree.forEach((tree, imgIndex) => {
        if (tree.images?.[0]?.url) {
          const cellAddress = XLSX.utils.encode_cell({
            c: 10 + imgIndex,
            r: rowIndex + 1,
          }) // +1 to skip header
          ws[cellAddress] = {
            t: 's',
            v: `IMG${imgIndex + 1}`,
            l: { Target: tree.images[0].url },
          }
        }
      })
    })

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, 'report.xlsx')
  }, [rowData])

  const _hendelPrint = async () => {
    try {
      // || !input.imgType || !input.startDate || !input.endDate
      if (!input.fileType) {
        // , Image type, Start Date, End Date
        setError('Please fill all required fields(file type)')
        return
      }

      setError('')
      setLoading(true)
      const data = await getData(input)

      setRowData(data as any)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      if (input?.fileType === 'excel') {
        xport()
      } else {
        print()
      }
    } catch (error: any) {
      setError(error?.message ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const totalTrees = rowData.reduce(
    (acc, curr) => acc + (curr.tree_count || 0),
    0
  )
  const totalPhotos = rowData.reduce(
    (acc, curr) =>
      acc + (curr.Tree?.filter((t) => t.images?.length > 0).length || 0),
    0
  )

  return (
    <>
      <Card className='w-[500px] print:hidden mx-auto'>
        <CardHeader className='text-center'>
          <CardTitle>Master Roll</CardTitle>
          <CardDescription>Make your report</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-3'>
            <InputParent>
              <Label>File type</Label>
              <Select
                value={input?.fileType}
                onValueChange={(x) => setInput({ ...input, fileType: x })}
              >
                <SelectTrigger className=''>
                  <SelectValue placeholder='Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pdf'>PDF</SelectItem>
                  <SelectItem value='excel'>Excel</SelectItem>
                </SelectContent>
              </Select>
            </InputParent>

            <InputParent>
              <Label>Image type</Label>
              <Select
                value={input?.imgType}
                onValueChange={(x) => setInput({ ...input, imgType: x })}
              >
                <SelectTrigger className=''>
                  <SelectValue placeholder='Image' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='withImg'>With Image</SelectItem>
                  <SelectItem value='withOutImg'>With out Image</SelectItem>
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
                label='Select'
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
                  label='Select'
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
                  label='Select'
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
                  label='Select'
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
                  <SelectTrigger className=''>
                    <SelectValue placeholder='Word' />
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
            <div className='text-center text-blue-500 text-sm mt-3'>
              Loading...
            </div>
          )}
          {error && (
            <div className='text-center text-red-500 text-sm mt-3'>{error}</div>
          )}
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button disabled={loading} onClick={_hendelPrint}>
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

      <div className='pt-10 printable hidden print:block'>
        <PrintHaeder />
        <div className='mt-5 border-t pt-2 print:w-screen'>
          <h1 className='underline text-center font-semibold'>
            Enrollment of tree plantation
          </h1>
          <p className='text-center'>
            {rowData.length > 0 &&
              `${rowData[0]?.division?.name}, ${rowData[0]?.zilla?.name}, ${rowData[0]?.upZilla?.name}, ${rowData[0]?.union?.name}`}
          </p>
          <div className='flex justify-between mt-5'>
            <p>Date : {format(new Date(), 'dd,MMM,yyyy')} </p>
            <p className='font-semibold'>
              Total Number of Beneficiary: {rowData.length}
            </p>
            <p className='font-semibold'>Total Number of Trees: {totalTrees}</p>
            <p className='font-semibold'>
              Total Number of Photo: {totalPhotos}
            </p>
          </div>
        </div>

        <table
          className='text-center mt-4 text-[11px] print:w-screen'
          id='print'
        >
          <thead>
            <tr className=''>
              <th className='w-[10%]'>
                Master <br /> Id.
              </th>
              <th className='w-[10%] overflow-hidden'>
                Recipent
                <br /> Child
              </th>
              <th className='w-[10%]'>
                Father
                <br /> Name
              </th>
              <th className='w-[20%]'>
                Address
                <span className='text-xs block'>
                  (vill,word,union,
                  <br />
                  post,upazila,district)
                </span>
              </th>
              <th className='w-[8%]'>
                GPS
                <br /> coordinates
              </th>
              <th className='w-[8%]'>Mobile No</th>
              <th className='w-[15%]'>Species name</th>
              <th className='w-[8%]'>
                Area of
                <br /> recipients <br />
                land <br />
                (hectares)
              </th>
              <th className='w-[6%]'>
                Planted Trees
                <br />
                (qty)
              </th>
              <th className='w-[6%]'>Number of Photo Taken</th>
              <th className='w-[6%]'>Photo URL</th>
            </tr>
          </thead>
          <tbody className='text-xs'>
            {rowData.map((item: RowDataItem) => (
              <tr key={item.id} className='h-fit'>
                <td className=''>{item?.masterId}</td>
                <td className=''>{item.childName}</td>
                <td className=''>{item.fatherName}</td>
                <td className=''>
                  {`${item?.village}, Word-${item?.wordNo}, ${item?.union?.name}, ${item?.postOffice?.name}-${item?.postOffice?.postCode}, ${item?.upZilla?.name}, ${item?.zilla?.name}`}
                </td>
                <td className='whitespace-pre-line'>
                  {item.Tree.some((t: { lat: any; lon: any }) => t.lat && t.lon)
                    ? Number(
                        item.Tree.find(
                          (t: { lat: any; lon: any }) => t.lat && t.lon
                        )?.lat
                      ).toFixed(2) +
                      ', ' +
                      '\n' +
                      Number(
                        item.Tree.find(
                          (t: { lat: any; lon: any }) => t.lat && t.lon
                        )?.lon
                      ).toFixed(2)
                    : '-'}
                </td>
                <td className=''>{item.phone}</td>
                <td className=' whitespace-pre-line'>
                  {item.Tree.map(
                    (t: { treeType: { name: any } }) => t.treeType.name
                  ).join(',\n')}
                </td>
                <td className=''>-</td>
                {/* <td className="">Ground</td> */}
                <td className=''>{item.tree_count}</td>
                <td className=''>
                  {
                    item.Tree.filter(
                      (t: { images: string | any[] }) => t.images?.length > 0
                    ).length
                  }
                </td>
                <td className='whitespace-pre-line'>
                  <div className='flex flex-col gap-1'>
                    {item.Tree.map((tree, idx) =>
                      tree.images?.[0]?.url ? (
                        <a
                          key={idx}
                          href={tree.images[0].url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline pr-3'
                        >
                          IMG{idx + 1}
                        </a>
                      ) : (
                        ''
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
