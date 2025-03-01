'use server'


import prisma from '@/prisma/db'

export const getDevision = async (x: string) => {
  const allDevision = await prisma.division.findMany({
    where: {
      name: {
        contains: x,
      },
    },
    take: 5,
  })

  return allDevision
}

export const getZilla = async (x: string | undefined, y: string) => {
  const allZilla = await prisma.zilla.findMany({
    where: {
      name: {
        contains: x,
      },
      divisionId: Number(y),
    },
    take: 5,
  })

  return allZilla
}

export const getUpZilla = async (x: string | undefined, y: string) => {
  const allUpZilla = await prisma.upazilla.findMany({
    where: {
      name: {
        contains: x,
      },
      zillaId: Number(y),
    },
    take: 5,
  })

  return allUpZilla
}

export const getUnion = async (x: string | undefined, y: string) => {
  const allUnion = await prisma.union.findMany({
    where: {
      name: {
        contains: x,
      },
      upazillaId: Number(y),
    },
    take: 5,
  })

  return allUnion
}