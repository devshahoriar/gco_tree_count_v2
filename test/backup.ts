/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { PrismaClient } from '@/prisma/out'
import * as fs from 'fs'
import * as path from 'path'

// Initialize PrismaClient with correct configuration
const prisma = new PrismaClient({
  log: ['warn', 'error']
})

// Configure connection pool using environment variable
process.env.DATABASE_POOL_SIZE = '5'

interface TreeImage {
  id: number
  createdAt: string
  updatedAt: string
  imageUrl: string
  treeId: number
  replacedTreeId: number | null
}

interface Tree {
  id: number
  createdAt: string
  updatedAt: string
  treeType: string
  lat: string | null
  lon: string | null
  userId: number
  ot4ocId: number
  replaced: boolean | null
  replacedCoz: string | null
  replacedTreeId: number | null
  TreeImage: TreeImage[]
  OditImage: any[]
  ReplacedTree: any | null
}

interface BackupData {
  id: number
  createdAt: string
  updatedAt: string
  childName: string | null
  childBirthDate: string | null
  childGender: string | null
  fatherName: string | null
  fatherBirthDate: string | null
  fatherNid: string | null
  fatherJob: string | null
  fatherEdu: string | null
  motherName: string | null
  motherBirthDate: string | null
  motherNid: string | null
  motherJob: string | null
  motherEdu: string | null
  religion: string | null
  delevaryInfo: string | null
  delevaryChildHelth: string | null
  famelyIncome: string | null
  village: string | null
  postOffice: string | null
  area: string | null
  word: string | null
  upZilla: string | null 
  zilla: string | null
  division: string | null
  phone: string | null
  email: string | null
  treePlantDate: string | null
  tree_count: string | null
  treeType: string | null
  whoPlanName: string | null
  trees: Tree[]
  deleted: boolean
  userId: number | null
  childMemberShipId: number | null
}

// Cache maps to avoid repeated DB lookups
const divisionCache = new Map<string, any>()
const zillaCache = new Map<string, any>()
const upazillaCache = new Map<string, any>()
const postOfficeCache = new Map<string, any>()
const treeTypeCache = new Map<string, any>()

async function getOrCreateDivision(name: string | null) {
  if (!name) return null
  if (divisionCache.has(name)) return divisionCache.get(name)

  const division = await prisma.division.findFirst({
    where: { name }
  })
  
  if (division) {
    divisionCache.set(name, division)
    return division
  }
  
  const newDivision = await prisma.division.create({
    data: { name }
  })
  divisionCache.set(name, newDivision)
  return newDivision
}

async function getOrCreateZilla(name: string | null, divisionId: number) {
  if (!name) return null
  const key = `${name}-${divisionId}`
  if (zillaCache.has(key)) return zillaCache.get(key)

  const zilla = await prisma.zilla.findFirst({
    where: { 
      name,
      divisionId 
    }
  })

  if (zilla) {
    zillaCache.set(key, zilla)
    return zilla
  }

  const newZilla = await prisma.zilla.create({
    data: { name, divisionId }
  })
  zillaCache.set(key, newZilla)
  return newZilla
}

async function getOrCreateUpazilla(name: string | null, zillaId: number) {
  if (!name) return null
  const key = `${name}-${zillaId}`
  if (upazillaCache.has(key)) return upazillaCache.get(key)

  const upazilla = await prisma.upazilla.findFirst({
    where: {
      name,
      zillaId
    }
  })

  if (upazilla) {
    upazillaCache.set(key, upazilla)
    return upazilla
  }

  const newUpazilla = await prisma.upazilla.create({
    data: { name, zillaId }
  })
  upazillaCache.set(key, newUpazilla)
  return newUpazilla
}

async function getOrCreatePostOffice(areaName: string | null, postCode: string | null, upazillaId: number) {
  if (!areaName || !postCode) return null
  const key = `${areaName}-${postCode}-${upazillaId}`
  if (postOfficeCache.has(key)) return postOfficeCache.get(key)

  const postOffice = await prisma.postOffice.findFirst({
    where: {
      name: areaName,
      postCode,
      upZillaId: upazillaId
    }
  })

  if (postOffice) {
    postOfficeCache.set(key, postOffice)
    return postOffice
  }

  const newPostOffice = await prisma.postOffice.create({
    data: {
      name: areaName,
      postCode,
      upZillaId: upazillaId
    }
  })
  postOfficeCache.set(key, newPostOffice)
  return newPostOffice
}

async function getOrCreateTreeType(name: string) {
  if (!name) return null
  if (treeTypeCache.has(name)) return treeTypeCache.get(name)

  try {
    // Convert name to lowercase for consistent comparison
    const normalizedName = name.toLowerCase()
    
    // First try to find it
    const treeType = await prisma.treeType.findFirst({
      where: { 
        name: normalizedName
      }
    })

    if (treeType) {
      treeTypeCache.set(name, treeType)
      return treeType
    }

    // If not found, try to create it with normalized name
    const newTreeType = await prisma.treeType.create({
      data: { name: normalizedName }
    })
    
    treeTypeCache.set(name, newTreeType)
    return newTreeType

  } catch (error:any) {
    // If there's a unique constraint error, try to find it one more time
    if (error.code === 'P2002') {
      const existing = await prisma.treeType.findFirst({
        where: { name: name.toLowerCase() }
      })
      if (existing) {
        treeTypeCache.set(name, existing)
        return existing
      }
    }
    throw error
  }
}

// Add transaction timeout options
const TX_TIMEOUT = 30000 // 30 seconds

// Bulk create helper function
async function bulkCreateTrees(tx: any, ot4ocId: number, trees: Tree[], treeTypes: Map<string, any>) {
  const treeData = trees.map(tree => ({
    treeFormId: ot4ocId,
    treeTypeId: treeTypes.get(tree.treeType)?.id,
    lat: tree.lat || undefined,
    lon: tree.lon || undefined,
    replaced: tree.replaced || false,
    replaceReason: tree.replacedCoz || undefined,
    replaceTreeId: tree.replacedTreeId || undefined
  }))

  return await tx.tree.createMany({
    data: treeData,
    skipDuplicates: true
  })
}

async function bulkCreateImages(tx: any, treeId: number, images: TreeImage[]) {
  for (const img of images) {
    // 1) create a File record
    const fileRec = await tx.file.create({
      data: {
        url: img.imageUrl
        // ... any other File fields you may have
      }
    })

    // 2) Use backticks to quote the table and columns
    await tx.$executeRaw`
      INSERT IGNORE INTO \`_TreeImages\` (\`A\`, \`B\`)
      VALUES (${treeId}, ${fileRec.id})
    `
  }
}

async function restoreRecord(record: BackupData) {
  return await prisma.$transaction(async (tx) => {
    try {
      console.log(`Processing record for: ${record.childName}`)

      // Get location hierarchy
      const division = await getOrCreateDivision(record.division)
      if (!division) {
     
        console.log('Missing division, skipping record')
        return false
      }

      const zilla = await getOrCreateZilla(record.zilla, division.id)
      if (!zilla) {
        console.log('Missing zilla, skipping record')
        return false
      }

      const upazilla = await getOrCreateUpazilla(record.upZilla, zilla.id)
      if (!upazilla) {
        console.log('Missing upazilla, skipping record')
        return false
      }

      const postOffice = await getOrCreatePostOffice(record.area, record.postOffice, upazilla.id)

      // Create Ot4oc record
      const ot4oc = await tx.ot4oc.create({
        data: {
          childName: record.childName || undefined,
          childBirthDate: record.childBirthDate ? new Date(record.childBirthDate) : null,
          childGender: record.childGender || undefined,
          fatherName: record.fatherName || undefined,
          fatherBirthDate: record.fatherBirthDate ? new Date(record.fatherBirthDate) : null,
          fatherNid: record.fatherNid || undefined,
          fatherJob: record.fatherJob || undefined,
          fatherEdu: record.fatherEdu || undefined,
          motherName: record.motherName || undefined,
          motherBirthDate: record.motherBirthDate ? new Date(record.motherBirthDate) : null,
          motherNid: record.motherNid || undefined,
          motherJob: record.motherJob || undefined,
          motherEdu: record.motherEdu || undefined,
          religion: record.religion || undefined,
          deliveryInfo: record.delevaryInfo || undefined,
          deliveryChildHealth: record.delevaryChildHelth || undefined,
          familyIncome: record.famelyIncome || undefined,
          village: record.village || undefined,
          wordNo: record.word || undefined,
          phone: record.phone || undefined,
          email: record.email || undefined,
          treePlantDate: record.treePlantDate ? new Date(record.treePlantDate) : null,
          tree_count: record.tree_count ? parseInt(record.tree_count) : null,
          whoPlanName: record.whoPlanName || undefined,
          divisionId: division.id,
          zillaId: zilla.id,
          upZillaId: upazilla.id,
          postId: postOffice?.id || undefined,
          deleted: record.deleted,
          createdAt: record?.createdAt || new Date(),
        }
      })

      // Pre-fetch all tree types needed
      const uniqueTreeTypes = [...new Set(record.trees.map(t => t.treeType))]
      const treeTypeMap = new Map()
      
      await Promise.all(
        uniqueTreeTypes.map(async (typeName) => {
          const treeType = await getOrCreateTreeType(typeName)
          if (treeType) treeTypeMap.set(typeName, treeType)
        })
      )

      // Bulk create trees
      await bulkCreateTrees(tx, ot4oc.id, record.trees, treeTypeMap)

      // Process images in batches
      const imageChunks = []
      for (const tree of record.trees) {
        if (tree.TreeImage?.length) {
          imageChunks.push(...tree.TreeImage)
        }
      }

      // Process image chunks
      const CHUNK_SIZE = 100
      for (let i = 0; i < imageChunks.length; i += CHUNK_SIZE) {
        const chunk = imageChunks.slice(i, i + CHUNK_SIZE)
        await bulkCreateImages(tx, ot4oc.id, chunk)
      }

      console.log(`Successfully restored record for: ${record.childName}`)
      return true
    } catch (error) {
      console.error(`Failed to restore record for: ${record.childName}`)
      console.error(error)
      return false
    }
  }, {
    timeout: TX_TIMEOUT,
    maxWait: 10000
  })
}

function storeFailedRecord(record: BackupData) {
  const failPath = path.join(__dirname, 'failedRecords.json')
  let failedData: BackupData[] = []
  try {
    if (fs.existsSync(failPath)) {
      failedData = JSON.parse(fs.readFileSync(failPath, 'utf-8'))
    }
  } catch {
    // Ignore read errors, use empty array
  }
  failedData.push(record)
  fs.writeFileSync(failPath, JSON.stringify(failedData, null, 2))
}

// Modify batch size and add delay between batches
async function processRecordBatch(records: BackupData[], batchSize: number = 5) {
  // Process in smaller chunks to avoid memory issues
  const batches = []
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize))
  }

  let successCount = 0
  let failureCount = 0

  for (const batch of batches) {
    // Process each record sequentially
    for (const record of batch) {
      const success = await restoreRecord(record).catch((e) => {
        console.error(`Failed record for ${record.childName}:`, e)
        return false
      })
      if (!success) {
        storeFailedRecord(record)
        failureCount++
      } else {
        successCount++
      }
    }

    // Smaller delay between batches
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return { successCount, failureCount }
}

async function restore(b:number) {
  try {
    const backupDir = path.join(__dirname)
    const files = fs.readdirSync(backupDir).filter(f => f.match(/.*\.json$/))
    
    let totalRecords = 0
    let totalSuccess = 0
    let totalFailure = 0

    // Process files sequentially instead of concurrently
    for (const file of files) {
      console.log(`\nProcessing file: ${file}`)
      const data: BackupData[] = JSON.parse(
        fs.readFileSync(path.join(backupDir, file), 'utf-8')
      )
      
      totalRecords += data.length
      console.log(`Found ${data.length} records in file`)

      const { successCount, failureCount } = await processRecordBatch(data,b)
      totalSuccess += successCount
      totalFailure += failureCount

      // Clear caches periodically
      if (totalRecords % 2000 === 0) {
        divisionCache.clear()
        zillaCache.clear()
        upazillaCache.clear()
        postOfficeCache.clear()
        treeTypeCache.clear()
      }
    }

    console.log('\nRestore Complete!')
    console.log(`Total Records: ${totalRecords}`)
    console.log(`Successfully Restored: ${totalSuccess}`)
    console.log(`Failed to Restore: ${totalFailure}`)

  } catch (error) {
    console.error('Restoration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Execute restoration with connection pooling
const batchSize = 200 // Adjust based on your system's capabilities
restore(batchSize)
