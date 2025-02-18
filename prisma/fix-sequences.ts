import prisma from "./db"


async function fixSequences() {
  try {
    // Get the maximum ID from the tree table
    const result = await prisma.$queryRaw`
      SELECT setval(pg_get_serial_sequence('tree', 'id'), 
        COALESCE((SELECT MAX(id) FROM tree), 0) + 1, false);
    `
    console.log('Sequence reset result:', result)
  } catch (error) {
    console.error('Error resetting sequence:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixSequences()
