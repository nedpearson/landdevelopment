"use server";

import { prisma } from "@land-intelligence/database";

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        comps: true,
        sellers: {
          include: {
            seller: true
          }
        },
        dueDiligenceItems: true,
      }
    });
    
    if (!property) return null;
    
    // We need to parse JSON fields safely if they aren't typed properly, 
    // but Prisma should return them as JS objects or arrays if using Json type.
    return property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export async function getAllProperties() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        apn: true,
        county: true,
        state: true,
        acreage: true,
        lifecycleStage: true,
        ownerName: true,
        rawGeometry: true,
        centroidLat: true,
        centroidLng: true
      }
    });
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}
