/* eslint-disable react/no-unescaped-entities */
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
import { AddZilla, DeleteZilla, EditZilla } from './c'

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
        <div>
          <p className="font-bold">{count} Zilla</p>
          <p className="text-xs text-red-600">
            Ones add you can't <b>delete</b> or <b>Remove</b>.
          </p>
          <p className="text-xs text-red-600"> Only you can edit.</p>
        </div>
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
                <TableCell>{zilla?.division?.name}</TableCell>
                <TableCell>{zilla._count.Upazilla}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditZilla
                    allDivision={allDivision}
                    id={zilla.id}
                    n={zilla.name as string}
                    dId={zilla?.division?.id as number}
                  />
                  <DeleteZilla
                    id={zilla.id}
                    name={zilla.name as string}
                    Upzillacount={zilla._count.Upazilla}
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

export default DataZilla
