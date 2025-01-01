import prisma from '@/prisma/db'
import { unstable_cache } from 'next/cache'

export const allDivision = unstable_cache(
  async () =>
    await prisma.division.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
  undefined,
  {
    tags: ['division'],
  }
)
