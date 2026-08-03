'use server';

import { prisma } from '@land-intelligence/database';

export async function getTracts(projectId?: string) {
  const where = projectId ? { projectId } : {};
  return await prisma.landTract.findMany({
    where,
    orderBy: { tractNumber: 'asc' },
  });
}

export async function createTract(data: any) {
  try {
    const tract = await prisma.landTract.create({
      data: {
        projectId: data.projectId,
        tractNumber: data.tractNumber,
        county: data.county,
        state: data.state,
        legalDescription: data.legalDescription,
        grossAcres: data.grossAcres ? Number(data.grossAcres) : undefined,
        surfaceOwnerName: data.surfaceOwnerName,
        mineralOwnerName: data.mineralOwnerName,
        executiveRightsOwnerName: data.executiveRightsOwnerName,
        formationName: data.formationName,
        leaseholdStatus: data.leaseholdStatus,
        hbpStatus: data.hbpStatus,
      },
    });
    return { success: true as const, data: tract };
  } catch (e: any) {
    console.error('Error creating tract:', e);
    return { success: false as const, error: 'Failed to create tract' };
  }
}

export async function updateTract(id: string, data: any) {
  try {
    const tract = await prisma.landTract.update({
      where: { id },
      data,
    });
    return { success: true as const, data: tract };
  } catch (e: any) {
    console.error('Error updating tract:', e);
    return { success: false as const, error: 'Failed to update tract' };
  }
}
