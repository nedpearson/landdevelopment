'use server';

import { prisma } from '@land-intelligence/database';

const ORG_ID = 'org_default';

export async function getLandProjects() {
  return await prisma.landProject.findMany({
    where: { organizationId: ORG_ID },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createLandProject(data: any) {
  try {
    const project = await prisma.landProject.create({
      data: {
        organizationId: ORG_ID,
        projectName: data.projectName,
        clientName: data.clientName || 'Default Client',
        projectType: data.projectType,
        state: data.state,
        county: data.county,
        basin: data.basin,
        play: data.play,
        targetGrossAcres: data.targetGrossAcres ? Number(data.targetGrossAcres) : undefined,
        targetNetMineralAcres: data.targetNetMineralAcres ? Number(data.targetNetMineralAcres) : undefined,
        budgetUsd: data.budgetUsd ? Number(data.budgetUsd) : undefined,
      },
    });
    return { success: true as const, data: project };
  } catch (e: any) {
    console.error('Error creating land project:', e);
    return { success: false as const, error: 'Failed to create project' };
  }
}

export async function updateLandProject(id: string, data: any) {
  try {
    const project = await prisma.landProject.update({
      where: { id, organizationId: ORG_ID },
      data,
    });
    return { success: true as const, data: project };
  } catch (e: any) {
    console.error('Error updating land project:', e);
    return { success: false as const, error: 'Failed to update project' };
  }
}
