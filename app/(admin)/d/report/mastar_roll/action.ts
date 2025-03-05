/* eslint-disable @typescript-eslint/no-explicit-any */
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

type INPUT = {
  fileType?: string
  imgType?: string
  startDate?: Date
  endDate?: Date
  division?: any
  zilla?: any
  upZilla?: any
  union?: any
  wordNo?: string
}

export const getData = async (input: INPUT) => {
  const {
    imgType,
    division,
    endDate,
    startDate,
    union,
    upZilla,
    wordNo,
    zilla,
  } = input || {}

  const mastHaveImage = imgType === 'withImg'
  const mastDonthaveImage = imgType === 'withOutImg'

  const datas = await prisma.ot4oc.findMany({
    where: {
      treePlantDate: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
      divisionId: division ? Number(division) : undefined,
      zillaId: zilla ? Number(zilla) : undefined,
      upZillaId: upZilla ? Number(upZilla) : undefined,
      unionId: union ? Number(union) : undefined,
      wordNo: wordNo ? wordNo : undefined,
      Tree: {
        ...(mastHaveImage && {
          some: {
            lon: { not: null },
          },
        }),
        ...(mastDonthaveImage && {
          none: {
            lon: { not: null },
          },
        }),
      },
    },
    orderBy:{
      masterId: 'asc'
    },
    select: {
      id: true,
      masterId: true,
      childName: true,
      fatherName: true,
      village: true,
      wordNo: true,
      upZilla: true,
      phone: true,
      tree_count: true,
      treePlantDate: true,
      division: true,
      postOffice: true,
      zilla: true,
      union: true,
      Tree: {
        select: {
          treeType: true,
          images: {
            select: {
              url: true,
            },
          },
          lat: true,
          lon: true,
        },
      },
    },
  })

  return datas
}
