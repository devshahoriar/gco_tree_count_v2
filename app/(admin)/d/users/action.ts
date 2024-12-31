'use server'

import prisma from "@/prisma/db";

export const getAllUser = async () =>
  await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      permissions: true,
      image: true,
      active: true,
    },
  })

export const updateUser = async (userId: string, data: { 
  permissions?: string[], 
  role?: string,
  active?: boolean 
}) => {
  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.permissions && { permissions: data.permissions.join(',') }),
        ...(data.role && { role: data.role }),
        ...(typeof data.active === 'boolean' && { active: data.active })
      },
    })
    return { success: true, data: updated }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update user' }
  }
}
