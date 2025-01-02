import prisma from '@/prisma/db'

export const df = {
  page: '1',
  limit: '10',
  sortBy: 'id',
  orderBy: 'desc',
}

export const getListOfOt4oc = async (x: {
  page: string
  limit?: string
  sortBy?: string
  orderBy? : string
  q?: string
}) => {
  const page = x.page || df.page;
  const limit = x.limit || df.limit;
  const sortBy = x.sortBy || df.sortBy;
  const orderBy = x.orderBy || df.orderBy;

  const list = await prisma.ot4oc.findMany({
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
    orderBy: {
      [sortBy]: orderBy,
      
    },
    select: {
      id: true,
      childName: true,
      fatherName: true,
      village: true,
      phone: true,
      postOffice: {
        select: {
          name: true,
        },
      },
      union: {
        select: {
          name: true,
        },
      },
      upZilla: {
        select: {
          name: true,
        },
      },
      zilla: {
        select: {
          name: true,
        },
      },
      User: { select: { name: true } },

      tree_count: true,
      createdAt: true,
      masterId: true,
    },
    where: x.q
      ? {
          OR: [
            { id: parseInt(x.q) || undefined },
            { phone: { contains: x.q } },
            { childName: { contains: x.q } },
            { masterId: { contains: x.q } },
          ]
        }
      : undefined
  })
  return list
}

export const countOt4oc = async () => await prisma.ot4oc.count()
