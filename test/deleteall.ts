import { PrismaClient } from '@/prisma/out'

const prisma = new PrismaClient()

await prisma.ot4oc.deleteMany()
await prisma.tree.deleteMany()
await prisma.file.deleteMany()
await prisma.treeInvolved.deleteMany()
await prisma.treeType.deleteMany()