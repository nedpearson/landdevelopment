"use server";

import { prisma } from "@land-intelligence/database";

// Temporary auth mock until auth provider is fully wired
const currentOrganizationId = "org_default";

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findFirst({
      where: { 
        id,
        organizationId: currentOrganizationId
      },
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
    
    return property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export async function getAllProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        organizationId: currentOrganizationId
      },
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
