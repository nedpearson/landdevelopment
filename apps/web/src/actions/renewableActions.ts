'use server';
import { prisma } from '@land-intelligence/database';
const ORG_ID = 'org_default';

export async function getRenewableProjects() {
  return prisma.renewableProject.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createRenewableProject(data: {
  projectName: string;
  technologyType: string;
  targetControlAcres: number;
  signedControlAcres: number;
  siteControlPercentage: number;
  interconnectionSubstation: string;
  distanceToSubstationMiles: number;
  optionTermYears: number;
  optionRentPerAcYr: number;
  operatingRentPerAcYr: number;
}) {
  try {
    const project = await prisma.renewableProject.create({ data: { ...data, organizationId: ORG_ID } });
    return { success: true as const, data: project };
  } catch(e) {
    console.error(e);
    return { success: false as const, error: 'Failed to create project' };
  }
}

export async function getRenewableParcels() {
  return prisma.property.findMany({
    where: { organizationId: ORG_ID },
    select: { id: true, apn: true, county: true, state: true, acreage: true,
              ownerName: true, lifecycleStage: true, centroidLat: true, centroidLng: true }
  });
}

export async function getRenewableLandowners() {
  return prisma.seller.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createRenewableLandowner(data: {
  name: string; email?: string; phone?: string;
  mailingAddress?: string; motivationLevel?: any;
}) {
  try {
    const landowner = await prisma.seller.create({
      data: { name: data.name, email: data.email, phone: data.phone,
               mailingAddress: data.mailingAddress, organizationId: ORG_ID, motivationLevel: data.motivationLevel || 'MEDIUM' }
    });
    return { success: true as const, data: landowner };
  } catch(e) {
    return { success: false as const, error: 'Failed to create landowner' };
  }
}
