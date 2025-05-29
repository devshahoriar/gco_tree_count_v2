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
import { AddPostOffice, DeletePostOffice, EditPostOffice } from './c'

const getCountPostOffice = unstable_cache(
  async () => await prisma.postOffice.count(),
  undefined,
  {
    tags: ['postOffice'],
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

const getAllPostOffice = unstable_cache(
  async () =>
    await prisma.postOffice.findMany({
      select: {
        id: true,
        name: true,
        postCode: true,
        upZilla: {
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
    tags: ['postOffice'],
  }
)

const DataPost = async () => {
  const [count, allUpazilla, allPostOffice] = await Promise.all([
    getCountPostOffice(),
    getAllUpazilla(),
    getAllPostOffice(),
  ])

  return (
    <ContentLayout title="Add Post Office">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold">{count} Post Offices</p>
          <p className="text-xs text-red-600">
            Ones add you can't <b>delete</b> or <b>Remove</b>.
          </p>
          <p className="text-xs text-red-600"> Only you can edit.</p>
        </div>
        <AddPostOffice allUpazilla={allUpazilla} />
      </div>
      <div className="mt-10">
        <h1 className="text-center">All Post Offices</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Post Code</TableHead>
              <TableHead>Upazilla</TableHead>
              <TableHead>Zilla</TableHead>
              <TableHead>Division</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPostOffice.map((postOffice) => (
              <TableRow key={postOffice.id}>
                <TableCell className="w-[100px]">{postOffice.id}</TableCell>
                <TableCell>{postOffice.name}</TableCell>
                <TableCell>{postOffice.postCode}</TableCell>
                <TableCell>{postOffice?.upZilla?.name}</TableCell>
                <TableCell>{postOffice?.upZilla?.zilla?.name}</TableCell>
                <TableCell>{postOffice?.upZilla?.zilla?.division?.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <EditPostOffice
                    allUpazilla={allUpazilla}
                    id={postOffice.id}
                    n={postOffice?.name as string}
                    pc={postOffice?.postCode as string}
                    upId={postOffice?.upZilla?.id as number}
                  />
                  <DeletePostOffice id={postOffice.id} name={postOffice?.name as string} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  )
}

export default DataPost
