'use server'

import prisma from '@/prisma/db'

export const getOt4ocById = async (id: string) => {
  try {
    const ot4oc = await prisma.ot4oc.findUnique({
      where: {
        id: Number(id),
      },
      
      select: {
        Tree: {
          select: {
            id: true,
            addBy: {
              select: {
                name: true,
                id: true
              }
            },
            images: {
              select: {
                url: true,
                fileType: true,
                createdAt: true
              }
            },
            auditImages: {
              select: {
                url: true,
                fileType: true,
                createdAt: true
              }
            },
            lat: true,
            lon: true,
            replaced: true,
            treeType: {
              select: {
                name: true,
                id: true
              }
            },
            thisForReplached: true,
            replaceReason: true,
            imageDate: true,
            remarkOfImg: true,
            auditDate: true,
            createdAt: true,
            replacedAt: true,
            replacedBy: {
              select: {
                name: true,
                id: true
              }
            }
          },
        },
        id: true,
        childName: true,
        tree_count: true,
        bornWeek: true,
        bornWeight: true,
        childBirthDate: true,
        motherNid: true,
        motherName: true,
        childBornPlace: true,
        childGender: true,
        createdAt: true,
        deliveryChildHealth: true,
        deliveryInfo: true,
        division: true,
        email: true,
        familyIncome: true,
        fatherBirthDate: true,
        fatherEdu: true,
        fatherName: true,
        fatherJob: true,
        howManyTimeContractExpart: true,
        isMotherFreedomToGoExpart: true,
        fatherNid: true,
        masterId: true,
        motherContractExpart: true,
        motherEdu: true,
        motherJob: true,
        motherBirthDate: true,
        motherSeriousSick: true,
        phone: true,
        thChild: true,
        religion: true,
        wordNo: true,
        preventCozToGoExpert: true,
        village: true,
        whoPlanName: true,
        whereIsMotherWhenPregnant: true,
        treePlantDate: true,
        postOffice: {
          select: {
            name: true,
          },
        },
        union: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            name: true,
            id: true,
          },
        },
        TreeInvolved: {
          select: {
            contactInfoBy: {
              select: {
                name: true,
                id: true,
              },
            },
            contactInfoDate: true,
            detailsBy: {
              select: {
                name: true,
                id: true,
              },
            },
            detailsDate: true,
            id: true,
            motherInfoBy: {
              select: {
                name: true,
                id: true,
              },
            },
            motherInfoDate: true,
          },
        },
      },
    })

    return ot4oc
  } catch (error) {
    console.log(JSON.stringify(error, null, 2))
    return { error: "Can't find the data" }
  }
}
