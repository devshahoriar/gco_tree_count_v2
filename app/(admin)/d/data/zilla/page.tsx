import { ContentLayout } from '@/components/admin-panel/content-layout'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'
import { AddZilla, EditZilla } from './c'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const getCountZilla = unstable_cache(
  async () => await prisma.zilla.count(),
  undefined,
  {
    tags: ['zilla'],
  }
)

const getAllDivision = unstable_cache(
  async () =>
    await prisma.division.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  undefined,
  {
    tags: ['division'],
  }
)

const getAllZilla = unstable_cache(
  async () =>
    await prisma.zilla.findMany({
      select: {
        id: true,
        name: true,
        division: {
          select: {
            name: true,
            id: true,
          },
        },
        _count: {
          select: {
            Upazilla: true,
          },
        },
      },
    }),
  undefined,
  {
    tags: ['zilla'],
  }
)

const DataZilla = async () => {
  const [count, allDivision, allZilla] = await Promise.all([
    getCountZilla(),
    getAllDivision(),
    getAllZilla(),
  ])
  return (
    <ContentLayout title="Add Zilla">
      <div className="flex items-center justify-between">
        <p className="font-bold">{count} Zilla</p>
        <AddZilla allDivision={allDivision} />
      </div>
      <div className="mt-10">
        <h1 className="text-center">All Zilla</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Up-Zilla Count</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allZilla.map((zilla) => (
              <TableRow key={zilla.id}>
                <TableCell className="w-[100px]">{zilla.id}</TableCell>
                <TableCell>{zilla.name}</TableCell>
                <TableCell>{zilla.division.name}</TableCell>
                <TableCell>{zilla._count.Upazilla}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditZilla
                    allDivision={allDivision}
                    id={zilla.id}
                    n={zilla.name}
                    dId={zilla.division.id}
                  />
                  {/* <EditDivision id={division.id} n={division.name} />
                  <DeleteDivision
                    id={division.id}
                    name={division.name}
                    zillacount={division._count.Zilla}
                  /> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default DataZilla
