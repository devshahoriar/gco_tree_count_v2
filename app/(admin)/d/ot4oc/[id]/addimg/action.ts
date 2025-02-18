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
      treePlantDate: true,
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
    orderBy:{
      id: 'asc'
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

export const getLocationById = async (id: number | string) =>
  await prisma.ot4oc.findUnique({
    where: {
      id: Number(id),
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

    // Add validation for image files
    if (!isNotPhoto && (!Array.isArray(imgs) || !imgs.every(img => img instanceof Blob || img instanceof File))) {
      console.error('Invalid image data received:', imgs)
      return { error: 'Invalid image format received' }
    }

    const dbIds = []
    if (!isNotPhoto) {
      if (imgs.length === 0 || !location) {
        return { error: 'Please add a image with location' }
      }
      const locations = await getLocationById(ot4ocId)

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
        if (!(img instanceof Blob || img instanceof File)) {
          console.error('Invalid image object:', img)
          continue
        }
        
        const { fileId, url } = await UploadFile(img, uploadFolder)
        // Create file record with auto-increment id
        const fileRecord = await prisma.file.create({
          data: {
            fileId: fileId,
            url: url,
            fileType: FILETYPE.TREEPHOTOINITIAL,
          },
          select: {
            id: true
          }
        })
        dbIds.push(fileRecord.id)
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
      // Modified create logic with retries
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          tree = await prisma.tree.create({
            data: {
              treeTypeId: Number(treeTypeId),
              treeFormId: Number(ot4ocId),
              images: dbIds.length > 0 ? {
                connect: dbIds.map((id) => ({ id }))
              } : undefined,
              lat: location?.lat ? location?.lat + '' : null,
              lon: location?.lon ? location?.lon + '' : null,
              imageDate: dbIds.length > 0 ? new Date() : null,
              addById: user.id,
              remarkOfImg: remark || null,
              replaced: replaced || false
            },
            select: {
              id: true,
              replaced: true,
            },
          });
          
          console.log('new tree added = ', tree.id);
          break; 
          
        } catch (createError: any) {
          console.error(`Creation attempt ${retryCount + 1} failed:`, JSON.stringify(createError, null, 2));
          
          if (createError.code === 'P2002' && retryCount < maxRetries - 1) {
   
            await prisma.$executeRaw`
              SELECT setval(pg_get_serial_sequence('tree', 'id'), 
                COALESCE((SELECT MAX(id) FROM tree), 0) + 1, false);
            `;
            retryCount++;
            continue;
          }
          
          throw createError;
        }
      }
    }

    if (replaced && tree) {
      // Modified replace logic with better error handling
      try {
        await prisma.tree.update({
          where: {
            id: Number(tree.id),
          },
          data: {
            replacedAt: new Date(),
            replaceReason: replaceReason || null,
            replacedById: user.id,
          },
        })

        if (!update) {
          await prisma.$transaction([
            prisma.ot4oc.update({
              where: {
                id: Number(ot4ocId),
              },
              data: {
                tree_count: {
                  increment: 1,
                },
              },
            }),
            prisma.tree.create({
              data: {
                treeFormId: Number(ot4ocId),
                treeTypeId: Number(treeTypeId),
                thisForReplached: true,
                addById: user.id,
              },
            })
          ])
        }
      } catch (replaceError: any) {
        console.error('Tree replacement error:', replaceError)
        return { error: 'Error during tree replacement process' }
      }
    }

    return { success: true }
  } catch (error) {
    console.error('General error:', error);
    return { error: 'Server error.' };
  }
}

export const deleteTree = async (treeId: number | string) => {
  await prisma.tree.delete({
    where: {
      id: Number(treeId),
    },
  })
  return { success: true }
}
