'use server'

import prisma from "@/prisma/db"

export const getAllTree = async () => {
  return prisma.treeType.findMany({})
}

export const addNewTree = async (name: string) => {
  try {
    return await prisma.treeType.create({
      data: {
        name,
      },
    })
  } catch (error) {
    console.log(error)
    throw new Error('Failed to add tree')
  }
}

export const updateTree = async (id: number, name: string) => {
  try {
    return await prisma.treeType.update({
      where: { id },
      data: { name },
    })
  } catch (error) {
    console.log(error)
    throw new Error('Failed to update tree')
  }
}