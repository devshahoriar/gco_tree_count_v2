import prisma from '@/prisma/db'

const df = {
  page: '1',
  limit: '20',
  orderBy: 'id',
}

export const getListOfOt4oc = async (x: {
  page: string
  limit?: string
  orderBy?: string
}) => {
  const { page, limit, orderBy } = { ...df, ...x }
  const list = await prisma.ot4oc.findMany({
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
    orderBy: {
      [orderBy]: 'asc',
    },
    select: {
      id: true,
      childName: true,
      fatherName: true,
      village: true,
      phone: true,
      tree_count: true,
      createdAt: true,
      masterId: true,
    },
  })
  return list
}

export const countOt4oc = async () => await prisma.ot4oc.count()