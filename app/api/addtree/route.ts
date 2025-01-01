/* eslint-disable @typescript-eslint/no-explicit-any */
import { PERMISSIONS } from '@/data/const'
import { getUser } from '@/lib/auth'
import { getUserPermissions } from '@/lib/auth-client'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (request: NextRequest) => {
  const user = await getUser(headers)
  if (!user) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }
  const p = getUserPermissions(user) as [string]

  if (!p.includes(PERMISSIONS.OT4OC)) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
      },
      {
        status: 401,
      }
    )
  }
  const body = await request?.json()
  try {
    const oldPhoneIsUsed = await prisma.ot4oc.findFirst({
      where: {
        phone: body.phone,
      },
      select: {
        id: true,
      },
    })
    if (oldPhoneIsUsed) {
      return NextResponse.json({
        error: 'Phone number is already used',
      })
    }
  } catch (error: any) {
    //hendel catch block
    console.log(error)
  } finally {
    return NextResponse.json({ error: 'success' })
  }
}
