/* eslint-disable react/no-unescaped-entities */
import { ContentLayout } from '@/components/admin-panel/content-layout'
import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddUpZilla, DeleteUpZilla, EditUpZilla } from './c'

const getCountUpZilla = unstable_cache(
  async () => await prisma.upazilla.count(),
  undefined,
  {
    tags: ['upazilla'],
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
          },
        },
      },
    }),
  undefined,
  {
    tags: ['zilla'],
  }
)

const getAllUpZilla = unstable_cache(
  async () =>
    await prisma.upazilla.findMany({
      select: {
        id: true,
        name: true,
        zilla: {
          select: {
            name: true,
            id: true,
            division: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            Union: true,
            PostOffice: true,
          },
        },
      },
    }),
  undefined,
  {
    tags: ['upazilla'],
  }
)

const DataUpZilla = async () => {
  const [count, allZilla, allUpZilla] = await Promise.all([
    getCountUpZilla(),
    getAllZilla(),
    getAllUpZilla(),
  ])
  
  return (
    <ContentLayout title="Add Up-Zilla">
      <div className="flex items-center justify-between">
        <div>
        <p className="font-bold">{count} Up-Zilla</p>
        <p className='text-xs text-red-600'>Ones add you can't <b>delete</b> or <b>Remove</b>.</p>
        <p className='text-xs text-red-600'> Only you can edit.</p>
        </div>
        <AddUpZilla allZilla={allZilla} />
      </div>
      <div className="mt-10">
        <h1 className="text-center">All Up-Zilla</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Zilla</TableHead>
              <TableHead>Division</TableHead>
              <TableHead>Union Count</TableHead>
              <TableHead>Post Office Count</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUpZilla.map((upzilla) => (
              <TableRow key={upzilla.id}>
                <TableCell className="w-[100px]">{upzilla.id}</TableCell>
                <TableCell>{upzilla?.name}</TableCell>
                <TableCell>{upzilla?.zilla?.name}</TableCell>
                <TableCell>{upzilla?.zilla?.division?.name}</TableCell>
                <TableCell>{upzilla._count.Union}</TableCell>
                <TableCell>{upzilla._count.PostOffice}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditUpZilla
                    allZilla={allZilla}
                    id={upzilla.id}
                    n={upzilla.name as string}
                    zId={upzilla?.zilla?.id as number}
                  />
                  <DeleteUpZilla
                    id={upzilla.id as number}
                    name={upzilla.name as string}
                    unionCount={upzilla._count.Union}
                    postOfficeCount={upzilla._count.PostOffice}
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

export default DataUpZilla