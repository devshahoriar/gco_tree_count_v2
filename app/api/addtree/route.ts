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
  
    if (body?.tree_count !== undefined) {

      const treeCount = await prisma.tree.count({
        where: {
          treeFormId: Number(body.id),
        },
      })
      console.log(body.tree_count, treeCount)
      if (treeCount > body.tree_count) {
        return NextResponse.json({
          error: `You can't reduce tree count, Already ${treeCount} tree added \n Please add more tree or keep same tree count`,
        })
      }
    }

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
        await prisma.treeInvolved.upsert({
          where: {
            formId: Number(body.id),
          },
          update: {
            detailsById: user.id,
            detailsDate: new Date(),
          },
          create: {
            detailsById: user.id,
            formId: Number(body.id),
            detailsDate: new Date(),
          },
        })
      }

      if (body.wordNo) {
        await prisma.treeInvolved.upsert({
          where: {
            formId: Number(body.id),
          },
          update: {
            contactInfoById: user.id,
            contactInfoDate: new Date(),
          },
          create: {
            contactInfoById: user.id,
            formId: Number(body.id),
            contactInfoDate: new Date(),
          },
        })
      }

      if (body.bornWeek) {
        await prisma.treeInvolved.upsert({
          where: {
            formId: Number(body.id),
          },
          update: {
            motherInfoById: user.id,
            motherInfoDate: new Date(),
          },
          create: {
            motherInfoById: user.id,
            formId: Number(body.id),
            motherInfoDate: new Date(),
          },
        })
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
