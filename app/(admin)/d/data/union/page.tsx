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
import { AddUnion, EditUnion, DeleteUnion } from './c'

const getCountUnion = unstable_cache(
  async () => await prisma.union.count(),
  undefined,
  {
    tags: ['union'],
  }
)

const getAllUpazilla = unstable_cache(
  async () =>
    await prisma.upazilla.findMany({
      select: {
        id: true,
        name: true,
        zilla: {
          select: {
            name: true,
            division: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    }),
  undefined,
  {
    tags: ['upazilla'],
  }
)

const getAllUnion = unstable_cache(
  async () =>
    await prisma.union.findMany({
      select: {
        id: true,
        name: true,
        upazilla: {
          select: {
            id: true,
            name: true,
            zilla: {
              select: {
                name: true,
                division: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  undefined,
  {
    tags: ['union'],
  }
)

const DataUnion = async () => {
  const [count, allUpazilla, allUnion] = await Promise.all([
    getCountUnion(),
    getAllUpazilla(),
    getAllUnion(),
  ])

  return (
    <ContentLayout title="Add Union">
      <div className="flex items-center justify-between">
        <p className="font-bold">{count} Unions</p>
        <AddUnion allUpazilla={allUpazilla} />
      </div>
      <div className="mt-10">
        <h1 className="text-center">All Unions</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Upazilla</TableHead>
              <TableHead>Zilla</TableHead>
              <TableHead>Division</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUnion.map((unionItem) => (
              <TableRow key={unionItem.id}>
                <TableCell className="w-[100px]">{unionItem.id}</TableCell>
                <TableCell>{unionItem.name}</TableCell>
                <TableCell>{unionItem.upazilla.name}</TableCell>
                <TableCell>{unionItem.upazilla.zilla.name}</TableCell>
                <TableCell>{unionItem.upazilla.zilla.division.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditUnion
                    allUpazilla={allUpazilla}
                    id={unionItem.id}
                    n={unionItem.name}
                    upId={unionItem.upazilla.id}
                  />
                  <DeleteUnion id={unionItem.id} name={unionItem.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default DataUnion