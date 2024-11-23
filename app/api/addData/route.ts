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
  const { name, type, pId } = await req.json()
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
  revalidateTag('zilla')
  revalidateTag('division')
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

  const { name, type, id ,pId} = await req.json()
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
  revalidateTag('zilla')
  revalidateTag('division')
  return Response.json({ message: 'ok' })
}

export const DELETE = async (req: NextRequest) => {
  const { data } = await getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })
  if (!data) {
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
  revalidateTag('zilla')
  revalidateTag('division')
  return Response.json({ message: 'ok' })
}
