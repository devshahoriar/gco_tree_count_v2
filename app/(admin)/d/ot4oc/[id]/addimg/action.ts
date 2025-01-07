/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { FILETYPE } from '@/data/const'
import { getUser } from '@/lib/auth'
import { getUserPermissions } from '@/lib/auth-client'
import { FileDelete, UploadFile } from '@/lib/fileMeneger'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'

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

export const removeImage = async (
  treeId: number | string,
  fileId: number | string,
  imageId: number | string
) => {
  await FileDelete(fileId + '')
  await prisma.tree.update({
    where: {
      id: Number(treeId),
    },
    data: {
      images: {
        delete: {
          id: Number(imageId),
        },
      },
    },
    select: {
      id: true,
    },
  })
  return { success: true }
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
      remarkOfImg: true,
      lat: true,
      lon: true,
      replaced: true,
      replacedAt: true,
      replaceReason: true,
      thisForReplached: true,
    },
  })
}
export type Tree_Type = Awaited<ReturnType<typeof getTreesByOt4ocId>>[number]

export const updateTree = async (data: any) => {
  try {
    const user = await getUser(headers)
    if (!user) {
      return { error: 'User not found' }
    }
    const permissions = getUserPermissions(user)
    if (!permissions.includes('OT4OC')) {
      return { error: 'You do not have permission to add image' }
    }

    // logic start here

    const {
      treeTypeId,
      ot4ocId,
      imgs,
      location,
      treeId,
      update,
      remark,
      replaced,
      replaceReason,
    } = data

    const isNotPhoto = Boolean(remark) || Boolean(replaced)


    const dbIds = []
    if (!isNotPhoto) {
      if (imgs.length === 0 || !location) {
        return { error: 'Please add a image with location' }
      }
      const locations = await prisma.ot4oc.findUnique({
        where: {
          id: Number(ot4ocId),
        },
        select: {
          division: {
            select: {
              name: true,
            },
          },
          zilla: {
            select: {
              name: true,
            },
          },
          upZilla: {
            select: {
              name: true,
            },
          },
          union: {
            select: {
              name: true,
            },
          },
          wordNo: true,
        },
      })

      if (
        !locations ||
        !locations.division ||
        !locations.zilla ||
        !locations.upZilla ||
        !locations.union ||
        !locations.wordNo
      ) {
        return {
          error: 'First select word no, union, up-zilla, zilla, division.',
        }
      }

      const uploadFolder =
        `${locations?.division?.name}/${locations?.zilla?.name}/${locations?.upZilla?.name}/${locations?.union?.name}/${locations?.wordNo}`
          .toLocaleLowerCase()
          .replaceAll(' ', '_')

      for (const img of imgs) {
        const { fileId, url } = await UploadFile(img, uploadFolder)
        const d = await prisma.file.create({
          data: {
            fileId: fileId,
            url: url,
            fileType: FILETYPE.TREEPHOTOINITIAL,
          },
        })
        dbIds.push(d.id)
      }
    }
    let tree = null
    if (update) {
      tree = await prisma.tree.update({
        where: {
          id: Number(treeId),
        },
        data: {
          treeTypeId: Number(treeTypeId),
          images: {
            connect: dbIds.map((id) => ({ id })),
          },
          imageDate: new Date(),
          lat: location?.lat ? location?.lat + '' : undefined,
          lon: location?.lon ? location?.lon + '' : undefined,
          addById: user.id,
          remarkOfImg: remark,
          replaced: replaced,
        },
        select: {
          id: true,
          replaced: true,
        },
      })
      console.log('tree updated = ', tree.id)
    } else {
      tree = await prisma.tree.create({
        data: {
          treeTypeId: Number(treeTypeId),
          images: {
            connect: dbIds.map((id) => ({ id })),
          },
          lat: location?.lat ? location?.lat + '' : undefined,
          lon: location?.lon ? location?.lon + '' : undefined,
          imageDate: new Date(),
          treeFormId: Number(ot4ocId),
          addById: user.id,
          remarkOfImg: remark,
          replaced: replaced,
        },
        select: {
          id: true,
          replaced: true,
        },
      })
      console.log('new tree added = ', tree.id)
    }

    if (replaced) {
      await prisma.tree.update({
        where: {
          id: Number(tree.id),
        },
        data: {
          replacedAt: new Date(),
          replaceReason: replaceReason,
          replacedById: user.id,
        },
      })
      if (!update) {
        await prisma.ot4oc.update({
          where: {
            id: Number(ot4ocId),
          },
          data: {
            tree_count: {
              increment: 1,
            },
          },
        })
        await prisma.tree.create({
          data: {
            treeFormId: Number(ot4ocId),
            treeTypeId: Number(treeTypeId),
            thisForReplached: true,
            addById: user.id,
          },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.log(error)
    return { error: 'Server error.' }
  }
}
