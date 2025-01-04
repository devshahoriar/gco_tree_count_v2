/* eslint-disable @typescript-eslint/no-explicit-any */
import { PERMISSIONS } from '@/data/const'
import { getUser } from '@/lib/auth'
import { haveUserPermission } from '@/lib/auth-client'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const user = await getUser(headers)
  if (!user || !haveUserPermission(user, PERMISSIONS.OT4OC)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }
  const ot4ocId = req.nextUrl.searchParams.get('id')
  if (!ot4ocId) {
    return NextResponse.json(
      {
        error: 'Missing id',
      },
      {
        status: 400,
      }
    )
  }
  try {
    const otdata = await prisma.ot4oc.findUnique({
      where: {
        id: Number(ot4ocId),
      },
      select: {
        tree_count: true,
        childName: true,
        id: true,
      },
    })
    const trees = await prisma.tree.findMany({
      where: {
        treeFormId: Number(ot4ocId),
      },
      select: {
        id: true,
        treeType: true,
      },
    })
    const treeType = await prisma.treeType.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    return NextResponse.json({ fors: otdata, trees: trees, treeType: treeType })
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      {
        status: 500,
      }
    )
  }
}

export const POST = async (req: NextRequest) => {
  const user = await getUser(headers)
  if (!user || !haveUserPermission(user, PERMISSIONS.OT4OC)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }
  const ot4ocId = req.nextUrl.searchParams.get('id')
  if (!ot4ocId) {
    return NextResponse.json(
      {
        error: 'Missing id',
      },
      {
        status: 400,
      }
    )
  }
  try {
    const data = await req.json()
    const { updatedTrees, newCreatedTrees } = data
    if (newCreatedTrees && newCreatedTrees.length > 0) {
      for (const tree of newCreatedTrees) {
        await prisma.tree.create({
          data: {
            treeTypeId: Number(tree.treeTypeId),
            treeFormId: Number(ot4ocId),
          },
        })
      }
    }
    if (updatedTrees && updatedTrees.length > 0) {
      for (const tree of updatedTrees) {
        await prisma.tree.update({
          where: {
            id: Number(tree.id),
          },
          data: {
            treeTypeId: Number(tree.treeTypeId),
          },
        })
      }
    }
  
    return NextResponse.json({ message: 'ok' })
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    return NextResponse.json(
      {
        error: 'Internal Server Error',
      },
      {
        status: 500,
      }
    )
  }
}
