/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import prisma from '@/prisma/db'

export const getAllTreeTypes = async () => {
  return await prisma.treeType.findMany({
    select: {
      id: true,
      name: true,
    },
  })
}

export const getOt4ocById = async (id: string | number) => {
  return await prisma.ot4oc.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      masterId: true,
      childName: true,
      village: true,
      tree_count: true,
      phone: true,
      fatherName: true,
    },
  })
}

export type OT4OCTYPE = {
  id: number
  childName: string | null
  fatherName: string | null
  village: string | null
  phone: string | null
  tree_count: number | null
  masterId: string | null
}

export const getTreesByOt4ocId = async (id: string | number) => {
  return await prisma.tree.findMany({
    where: {
      treeFormId: Number(id),
    },
    select: {
      id: true,
      treeType: { select: { id: true } },
      images: {
        select: {
          id: true,
          fileId: true,
          url: true,
        },
      },
      lat: true,
      lon: true,
      replaced: true,
      replacedAt: true,
    },
  })
}

export type Tree_Type = Awaited<ReturnType<typeof getTreesByOt4ocId>>[number]

export const updateTree = async (data: any) => {
  try {
    const { treeTypeId, ot4ocId, imgs, location, treeId, update } = data
    let imageIds: number[] = []
    return { success: true }
  } catch (error) {
    console.log(error)
    return { error: 'Server error.' }
  }
}
