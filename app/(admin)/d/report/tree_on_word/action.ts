'use server'

import prisma from '@/prisma/db'

export const getDevision = async (x: string) => {
  const allDevision = await prisma.division.findMany({
    where: {
      name: {
        contains: x,
      },
    },
    take: 5,
  })

  return allDevision
}

export const getZilla = async (x: string | undefined, y: string) => {
  const allZilla = await prisma.zilla.findMany({
    where: {
      name: {
        contains: x,
      },
      divisionId: Number(y),
    },
    take: 5,
  })

  return allZilla
}

export const getUpZilla = async (x: string | undefined, y: string) => {
  const allUpZilla = await prisma.upazilla.findMany({
    where: {
      name: {
        contains: x,
      },
      zillaId: Number(y),
    },
    take: 5,
  })

  return allUpZilla
}

export const getUnion = async (x: string | undefined, y: string) => {
  const allUnion = await prisma.union.findMany({
    where: {
      name: {
        contains: x,
      },
      upazillaId: Number(y),
    },
    take: 5,
  })

  return allUnion
}

type TreeWordInput = {
  startDate?: Date
  endDate?: Date
  division?: string
  zilla?: string
  upZilla?: string
  union?: string
}

interface TreeByWordData {
  treeType: {
    name: string;
    id: number;
  };
  wordCounts: {
    [key: string]: number;
  };
}

export const getTreeCountByWord = async (input: TreeWordInput) => {
  const { division, zilla, upZilla, union, startDate, endDate } = input;
  
  try {
    // Get all tree types to ensure we have complete data even for empty counts
    const treeTypes = await prisma.treeType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    
    // Get all possible word numbers in the selected area
    const wordNumbers = await prisma.ot4oc.findMany({
      where: {
        divisionId: division ? Number(division) : undefined,
        zillaId: zilla ? Number(zilla) : undefined,
        upZillaId: upZilla ? Number(upZilla) : undefined,
        unionId: union ? Number(union) : undefined,
        treePlantDate: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
        wordNo: {
          not: null,
        },
      },
      select: {
        wordNo: true,
      },
      distinct: ['wordNo'],
    });
    
    // Sort word numbers numerically
    const sortedWordNumbers = wordNumbers
      .map(w => w.wordNo)
      .filter(Boolean)
      .sort((a, b) => Number(a) - Number(b));
    
    // Get all trees with their forms that match the criteria
    const forms = await prisma.ot4oc.findMany({
      where: {
        divisionId: division ? Number(division) : undefined,
        zillaId: zilla ? Number(zilla) : undefined,
        upZillaId: upZilla ? Number(upZilla) : undefined,
        unionId: union ? Number(union) : undefined,
        treePlantDate: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
        wordNo: {
          not: null,
        },
      },
      select: {
        id: true,
        wordNo: true,
        Tree: {
          select: {
            treeTypeId: true,
          }
        }
      },
    });
    
    // Create a map to hold the counts
    const countMap: Record<number, Record<string, number>> = {};
    
    // Initialize the count map for all tree types and word numbers
    treeTypes.forEach(treeType => {
      countMap[treeType.id] = {};
      sortedWordNumbers.forEach(wordNo => {
        if (wordNo) countMap[treeType.id][wordNo] = 0;
      });
    });
    
    // Count the trees by tree type and word number
    forms.forEach(form => {
      const wordNo = form.wordNo;
      if (!wordNo) return;
      
      form.Tree.forEach(tree => {
        if (countMap[tree.treeTypeId] && countMap[tree.treeTypeId][wordNo] !== undefined) {
          countMap[tree.treeTypeId][wordNo]++;
        }
      });
    });
    
    // Convert the count map to the required format
    const treeByWordData: TreeByWordData[] = treeTypes.map(treeType => {
      return {
        treeType,
        wordCounts: countMap[treeType.id] || {},
      };
    });
    
    // Filter out tree types with no trees
    const filteredData = treeByWordData.filter(data => 
      Object.values(data.wordCounts).some(count => count > 0)
    );
    
    // Return both the data and the word numbers for building the table
    return {
      treeData: filteredData,
      wordNumbers: sortedWordNumbers,
      locationInfo: {
        division: division ? await prisma.division.findUnique({
          where: { id: Number(division) },
          select: { name: true }
        }) : null,
        zilla: zilla ? await prisma.zilla.findUnique({
          where: { id: Number(zilla) },
          select: { name: true }
        }) : null,
        upZilla: upZilla ? await prisma.upazilla.findUnique({
          where: { id: Number(upZilla) },
          select: { name: true }
        }) : null,
        union: union ? await prisma.union.findUnique({
          where: { id: Number(union) },
          select: { name: true }
        }) : null,
      }
    };
  } catch (error) {
    console.error("Error fetching tree data:", error);
    throw new Error("Failed to fetch tree data. Please try again later.");
  }
}