import { PERMISSIONS } from '@/data/const'
import { getSession } from '@/lib/auth-client'
import prisma from '@/prisma/db'
import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export const POST = async (req: NextRequest) => {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })
  if (!data) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const userPermissions = data?.user?.permissions?.split(',')
  if (!userPermissions?.includes(PERMISSIONS.DATA)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const { name, type, pId, postCode } = await req.json()
  if (!name) {
    return Response.json({ message: 'Name is required' }, { status: 400 })
  }
  if (type === 'division') {
    await prisma.division.create({
      data: {
        name,
      },
    })
  }
  if (type === 'zilla') {
    await prisma.zilla.create({
      data: {
        name,
        divisionId: pId,
      },
    })
  }
  if (type === 'upzilla') {
    await prisma.upazilla.create({
      data: {
        name,
        zillaId: pId,
      },
    })
  }
  if (type === 'postOffice') {
    await prisma.postOffice.create({
      data: {
        name,
        postCode,
        upZillaId: pId,
      },
    })
  }
  if (type === 'union') {
    await prisma.union.create({
      data: {
        name,
        upazillaId: pId,
      },
    })
  }
  revalidateTag('zilla')
  revalidateTag('division')
  revalidateTag('upazilla')
  revalidateTag('postOffice')
  revalidateTag('union')
  return Response.json({ message: 'ok' })
}

export const PATCH = async (req: NextRequest) => {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })
  if (!data) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const userPermissions = data?.user?.permissions?.split(',')
  if (!userPermissions?.includes(PERMISSIONS.DATA)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { name, type, id, pId, postCode } = await req.json()
  if (!name || !id) {
    return Response.json(
      { message: 'Name and ID are required' },
      { status: 400 }
    )
  }
  if (type === 'division') {
    await prisma.division.update({
      where: {
        id,
      },
      data: {
        name,
      },
    })
  }
  if (type === 'zilla') {
    await prisma.zilla.update({
      where: {
        id,
      },
      data: {
        name,
        divisionId: pId,
      },
    })
  }
  if (type === 'upzilla') {
    await prisma.upazilla.update({
      where: {
        id,
      },
      data: {
        name,
        zillaId: pId,
      },
    })
  }
  if (type === 'postOffice') {
    await prisma.postOffice.update({
      where: {
        id,
      },
      data: {
        name,
        postCode,
        upZillaId: pId,
      },
    })
  }
  if (type === 'union') {
    await prisma.union.update({
      where: {
        id,
      },
      data: {
        name,
        upazillaId: pId,
      },
    })
  }
  revalidateTag('zilla')
  revalidateTag('division')
  revalidateTag('upazilla')
  revalidateTag('postOffice')
  revalidateTag('union')
  return Response.json({ message: 'ok' })
}

export const DELETE = async (req: NextRequest) => {


  return Response.json({ message: 'This opration destroy database!' }, { status: 401 })


  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })
  if (!data) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }
  const userPermissions = data?.user?.permissions?.split(',')
  if (!userPermissions?.includes(PERMISSIONS.DATA)) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id, type } = await req.json()
  if (!id) {
    return Response.json({ message: 'ID is required' }, { status: 400 })
  }
  if (type === 'division') {
    await prisma.division.delete({
      where: {
        id,
      },
    })
  }
  if (type === 'zilla') {
    await prisma.zilla.delete({
      where: {
        id,
      },
    })
  }
  if (type === 'upzilla') {
    await prisma.upazilla.delete({
      where: {
        id,
      },
    })
  }
  if (type === 'postOffice') {
    await prisma.postOffice.delete({
      where: {
        id,
      },
    })
  }
  if (type === 'union') {
    await prisma.union.delete({
      where: {
        id,
      },
    })
  }
  revalidateTag('zilla')
  revalidateTag('division')
  revalidateTag('upazilla')
  revalidateTag('postOffice')
  revalidateTag('union')
  return Response.json({ message: 'ok' })
}
