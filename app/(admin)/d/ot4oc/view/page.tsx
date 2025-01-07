/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { notFound } from 'next/navigation'
import { getOt4ocById } from './action'
import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  calculateSectionPercentage,
  formatBirthOrder,
  formatCurrency,
  formatDate,
  formatWeight,
} from '@/lib/utils'
import { FilePenLine, ImagePlus } from 'lucide-react'

import { TreesInformation } from './c'

const Ot4ocView = async ({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>
}) => {
  const id = (await searchParams).id
  if (!id) return notFound()

  const data: any = await getOt4ocById(id)
  if (!data) return notFound()
  const percentages = {
    child: calculateSectionPercentage(data, childFields),
    parents: calculateSectionPercentage(data, parentFields),
    location: calculateSectionPercentage(data, locationFields),
    additional: calculateSectionPercentage(data, additionalFields),
    total: calculateSectionPercentage(data, [
      ...childFields,
      ...parentFields,
      ...locationFields,
      ...additionalFields,
    ]),
  }

  return (
    <ContentLayout
      title={`OT4OC Details - ${data?.childName || 'Unknown Child'}`}
    >
      {/* Add this section before the grid */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Form Completion Status</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground mt-2">
                <span className="font-medium">ID: {data.id}</span>
                <span className="sm:before:content-['•'] sm:before:mx-2">
                  Master ID: {data.masterId || 'N/A'}
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-2 md:flex-row'>
              <Button asChild>
                <Link href={`/d/ot4oc/${data.id}/addimg`}>
                  <ImagePlus />
                  <span className='hidden md:block'>Add Image</span>
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/d/ot4oc/new?id=${data.id}`}>
                  <FilePenLine />
                  <span  className='hidden md:block'>Edit</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProgressSection
            label="Child Information"
            percentage={percentages.child}
          />
          <ProgressSection
            label="Parents Information"
            percentage={percentages.parents}
          />
          <ProgressSection
            label="Location Details"
            percentage={percentages.location}
          />
          <ProgressSection
            label="Additional Details"
            percentage={percentages.additional}
          />
          <div className="pt-2 border-t">
            <ProgressSection
              label="Overall Completion"
              percentage={percentages.total}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Child Information */}
        <Card>
          <CardHeader>
            <CardTitle>Child Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <InfoRow label="Child Name" value={data.childName} />
                <InfoRow label="Gender" value={data.childGender} />
                <InfoRow
                  label="Birth Date"
                  value={formatDate(data.childBirthDate)}
                />
                <InfoRow label="Birth Place" value={data.childBornPlace} />
                <InfoRow label="Born Week" value={data.bornWeek} />
                <InfoRow
                  label="Born Weight"
                  value={formatWeight(data.bornWeight)}
                />
                <InfoRow
                  label="Birth Order"
                  value={formatBirthOrder(data.thChild)}
                />
                <InfoRow
                  label="Child Health"
                  value={data.deliveryChildHealth}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Parents Information */}
        <Card>
          <CardHeader>
            <CardTitle>Parents Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <InfoRow label="Father's Name" value={data.fatherName} />
                <InfoRow label="Father's NID" value={data.fatherNid} />
                <InfoRow label="Father's Education" value={data.fatherEdu} />
                <InfoRow label="Father's Occupation" value={data.fatherJob} />
                <InfoRow label="Mother's Name" value={data.motherName} />
                <InfoRow label="Mother's NID" value={data.motherNid} />
                <InfoRow label="Mother's Education" value={data.motherEdu} />
                <InfoRow label="Mother's Occupation" value={data.motherJob} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <InfoRow label="Division" value={data.division?.name} />
                <InfoRow label="Post Office" value={data.postOffice?.name} />
                <InfoRow label="Union" value={data.union?.name} />
                <InfoRow label="Village" value={data.village} />
                <InfoRow label="Word No" value={data.wordNo} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tree & Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Tree & Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <InfoRow label="Tree Count" value={data.tree_count || 0} />
                <InfoRow
                  label="Tree Plant Date"
                  value={formatDate(data.treePlantDate)}
                />
                <InfoRow
                  label="Family Income"
                  value={formatCurrency(data.familyIncome)}
                />
                <InfoRow label="Religion" value={data.religion} />
                <InfoRow label="Contact Number" value={data.phone} />
                <InfoRow label="Email" value={data.email} />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <TreesInformation trees={data.Tree} />

        {/* Form Submission Information - Full Width */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Form Submission Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action Type</TableHead>
                    <TableHead>Submitted By</TableHead>
                    <TableHead>Submission Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Master roll</TableCell>
                    <TableCell>{data?.User?.name}</TableCell>
                    <TableCell>{formatDate(data.createdAt)} </TableCell>
                  </TableRow>
                  {data.TreeInvolved?.map((info: any) => (
                    <React.Fragment key={info.id}>
                      {info?.detailsBy && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Details Information
                          </TableCell>
                          <TableCell>{info?.detailsBy.name}</TableCell>
                          <TableCell>{formatDate(info?.detailsDate)}</TableCell>
                        </TableRow>
                      )}
                      {info?.contactInfoBy && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Contact Information
                          </TableCell>
                          <TableCell>{info?.contactInfoBy.name}</TableCell>
                          <TableCell>
                            {formatDate(info?.contactInfoDate)}{' '}
                          </TableCell>
                        </TableRow>
                      )}
                      {info?.motherInfoBy && (
                        <TableRow>
                          <TableCell className="font-medium">
                            Mother Information
                          </TableCell>
                          <TableCell>{info?.motherInfoBy.name}</TableCell>
                          <TableCell>
                            {formatDate(info?.motherInfoDate)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  )
}

export default Ot4ocView

const childFields = [
  'childName',
  'childGender',
  'childBirthDate',
  'childBornPlace',
  'bornWeek',
  'bornWeight',
  'thChild',
  'deliveryChildHealth'
]
const parentFields = [
  'fatherName',
  'fatherNid',
  'fatherEdu',
  'fatherJob',
  'motherName',
  'motherNid',
  'motherEdu',
  'motherJob',
  'fatherBirthDate',
  'motherBirthDate',
]
const locationFields = ['division', 'postOffice', 'union', 'village', 'wordNo']
const additionalFields = [
  'tree_count',
  'treePlantDate',
  'familyIncome',
  'religion',
  'phone',
  'email',
]

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <TableRow>
    <TableCell className="font-medium w-1/3">{label}</TableCell>
    <TableCell>
      {value === null || value === undefined ? 'N/A' : value}
    </TableCell>
  </TableRow>
)

const ProgressSection = ({
  label,
  percentage,
}: {
  label: string
  percentage: number
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium">{label}</span>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
    <Progress value={percentage} className="h-2" />
  </div>
)
