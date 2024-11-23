import { ContentLayout } from '@/components/admin-panel/content-layout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'
import { AddDivision, DeleteDivision, EditDivision } from './c'

const getCountDIvision = unstable_cache(
  async () => await prisma.division.count(),
  undefined,
  {
    tags: ['division'],
  }
)
const getAllDivision = unstable_cache(
  async () =>
    await prisma.division.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            Zilla: true,
          },
        },
      },
    }),
  undefined,
  {
    tags: ['division'],
  }
)

const DataDivision = async () => {
  const [count, divisions] = await Promise.all([
    getCountDIvision(),
    getAllDivision(),
  ])

  return (
    <ContentLayout title="Add Division">
      <div className="flex items-center justify-between">
        <p className="font-bold">{count} Divisions</p>
        <AddDivision />
      </div>
      <div className="mt-10">
        <h1 className="text-center">All Divisions</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Zilla Count</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {divisions.map((division) => (
              <TableRow key={division.id}>
                <TableCell className="w-[100px]">{division.id}</TableCell>
                <TableCell>{division.name}</TableCell>
                <TableCell>{division._count.Zilla}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditDivision id={division.id} n={division.name} />
                  <DeleteDivision
                    id={division.id}
                    name={division.name}
                    zillacount={division._count.Zilla}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default DataDivision
