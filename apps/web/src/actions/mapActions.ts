'use server';

import { prisma } from '@land-intelligence/database';

export async function getMapProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        centroidLat: { not: null },
        centroidLng: { not: null }
      },
      select: {
        id: true,
        apn: true,
        address: true,
        county: true,
        state: true,
        acreage: true,
        askingPrice: true,
        dealScore: true,
        centroidLat: true,
        centroidLng: true,
        propertyClass: true
      },
      take: 200 // Limit for prototype performance
    });

    return properties;
  } catch (error) {
    console.error("Failed to fetch map properties:", error);
    return [];
  }
}
