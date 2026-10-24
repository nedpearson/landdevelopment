'use server';

import { prisma } from '@land-intelligence/database';

export async function getMapProperties() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        apn: true,
        centroidLat: true,
        centroidLng: true,
        estimatedMarketValue: true,
        lifecycleStage: true,
      },
      where: {
        centroidLat: { not: null },
        centroidLng: { not: null },
      },
    });
    return { success: true, data: properties };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
