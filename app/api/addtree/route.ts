/* eslint-disable @typescript-eslint/no-explicit-any */
import { PERMISSIONS } from '@/data/const'
import { getUser } from '@/lib/auth'
import { haveUserPermission } from '@/lib/auth-client'
import prisma from '@/prisma/db'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const formatDate = (date: string | null | undefined) => {
  if (!date) return null
  return new Date(date).toISOString()
}

export const POST = async (request: NextRequest) => {
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

  const body = await request?.json()
  //update tree
  if (body?.id) {
    try {
      const updatedOt4oc = await prisma.ot4oc.update({
        where: { id: body.id },
        data: {
          // Basic info
          childName: body.childName,
          childGender: body.childGender,
          childBirthDate: new Date(body.childBirthDate),

          // Father info
          fatherName: body.fatherName,
          fatherBirthDate: formatDate(body.fatherBirthDate),
          fatherNid: body.fatherNid,
          fatherJob: body.fatherJob,
          fatherEdu: body.fatherEdu,

          // Mother info
          motherName: body.motherName,
          motherBirthDate: formatDate(body.motherBirthDate),
          motherNid: body.motherNid,
          motherJob: body.motherJob,
          motherEdu: body.motherEdu,

          // Other details
          religion: body.religion,
          deliveryInfo: body.deliveryInfo,
          deliveryChildHealth: body.deliveryChildHealth,
          familyIncome: body.familyIncome,

          // Location info
          divisionId: body.divisionId ? Number(body.divisionId) : null,
          zillaId: body.zillaId ? Number(body.zillaId) : null,
          upZillaId: body.upZillaId ? Number(body.upZillaId) : null,
          unionId: body.unionId ? Number(body.unionId) : null,
          postId: body.postId ? Number(body.postId) : null,
          wordNo: body.wordNo,

          // Contact info
          village: body.village,
          phone: body.phone,
          email: body.email,
          
          // Tree info
          tree_count: Number(body.tree_count),
          masterId: body.masterId,
          treePlantDate: formatDate(body.treePlantDate),
          whoPlanName: body.whoPlanName,

          // Additional medical info
          bornWeek: body.bornWeek,
          bornWeight: body.bornWeight,
          thChild: body.thChild,
          childBornPlace: body.childBornPlace,
          motherContractExpart: body.motherContractExpart,
          howManyTimeContractExpart: body.howManyTimeContractExpart,
          isMotherFreedomToGoExpart: body.motherFreedomVisitExpert,
          motherSeriousSick: body.motherSeriousSick,
          preventCozToGoExpert: body.preventCozToGoExpert,
          whereIsMotherWhenPregnant: body.whereIsMotherWhenPregnant,
          
        },
        select: {
          id: true,
        },
      })

      if (body.childBirthDate) {
        console.log("this is deteils")
      }

      if (body.wordNo) {
        console.log("this is contact info")
      }

      if (body.bornWeek) {
        console.log("this is medical info")
      }

      return NextResponse.json({
        success: true,
        data: updatedOt4oc.id,
      })
    } catch (error: any) {
      console.log(JSON.stringify(error, null, 2))
      return NextResponse.json({
        error: 'Contact with developer. Not saved!',
      })
    }
  }

  //new tree
  try {
    if (!body?.subNumber) {
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
          type: 'DUPLICATE_PHONE',
        })
      }
    }

    const newOt4oc = await prisma.ot4oc.create({
      data: {
        childName: body.childName,
        childGender: body.childGender,
        childBirthDate: formatDate(body.childBirthDate),
        fatherName: body.fatherName,
        fatherBirthDate: formatDate(body.fatherBirthDate),
        motherBirthDate: formatDate(body.motherBirthDate),
        village: body.village,
        phone: body.phone,
        tree_count: Number(body.tree_count),
        masterId: body.masterId,
        userId: user.id,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: newOt4oc.id,
    })
  } catch (error: any) {
    console.log(JSON.stringify(error, null, 2))
    if (error?.code === 'P2002') {
      return NextResponse.json({
        error: 'Master roll ID is already used',
        type: 'DUPLICATE_MASTER_ID',
      })
    }
    return NextResponse.json({
      error: 'Contact with developer.Not saved!',
    })
  }
}
