import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma/db' 

export async function POST(req: NextRequest) {
  try {
    const {
      reportType,
      startDate,
      endDate,
      divisionId,
      zillaId,
      upZillaId,
      unionId,
      postId,
      wordNo,
      withImage,
    } = await req.json()

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const whereClause = {
      treePlantDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      divisionId:Number(divisionId) || undefined,
      zillaId: Number(zillaId) || undefined,
      upZillaId: Number(upZillaId) || undefined,
      unionId: Number(unionId) || undefined,
      postId: Number(postId) || undefined,
      wordNo: wordNo || undefined,
      deleted: false,
      ...(withImage === 'with' && {
        Tree: {
          some: {
            images: { some: {} },
          },
        },
      }),
    }

    if (reportType === 'master') {
      const reportData = await prisma.ot4oc.findMany({
        where: whereClause,
        select: {
          id: true,
          childName: true,
          childBirthDate: true,
          fatherName: true,
          motherName: true,
          village: true,
          wordNo: true,
          phone: true,
          tree_count: true,
          treePlantDate: true,
          division: {
            select: { name: true },
          },
          zilla: {
            select: { name: true },
          },
          upZilla: {
            select: { name: true },
          },
          union: {
            select: { name: true },
          },
          postOffice: {
            select: { name: true, postCode: true },
          },
          Tree: {
            select: {
              treeType: {
                select: { name: true },
              },
              images: true,
              lat: true,
              lon: true,
              imageDate: true,
              auditDate: true,
              replaced: true,
            },
          },
        },
      })

      return NextResponse.json({ success: true, data: reportData })
    } else if (reportType === 'reg') {
      // Registration report with basic details
      const reportData = await prisma.ot4oc.findMany({
        where: whereClause,
        select: {
          id: true,
          childName: true,
          fatherName: true,
          motherName: true,
          treePlantDate: true,
          Tree: {
            select: {
              treeType: {
                select: { name: true },
              },
            },
          },
        },
      })

      return NextResponse.json({ success: true, data: reportData })
    }

    return NextResponse.json(
      { error: 'Invalid report type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}
