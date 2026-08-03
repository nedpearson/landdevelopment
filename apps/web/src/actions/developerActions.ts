'use server';
import { prisma } from '@land-intelligence/database';

export async function getDeveloperSites() {
  return prisma.property.findMany({
    where: { organizationId: 'org_default' },
    select: { id: true, apn: true, address: true, county: true, state: true,
              acreage: true, zoningAssessment: true, environmentalAssessment: true,
              lifecycleStage: true }
  });
}

export async function updatePropertyZoning(id: string, zoningData: any) {
  try {
    const prop = await prisma.property.update({
      where: { id },
      data: { zoningAssessment: zoningData }
    });
    return { success: true as const, data: prop };
  } catch(e) {
    return { success: false as const, error: 'Failed to update zoning' };
  }
}

export async function updatePropertyEnvironmental(id: string, environmentalData: any) {
  try {
    const prop = await prisma.property.update({
      where: { id },
      data: { environmentalAssessment: environmentalData }
    });
    return { success: true as const, data: prop };
  } catch(e) {
    return { success: false as const, error: 'Failed to update environmental' };
  }
}
