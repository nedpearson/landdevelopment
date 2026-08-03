"use server";

import { prisma } from '@land-intelligence/database';
import { revalidatePath } from 'next/cache';

export async function getLandProjects() {
  return await prisma.landProject.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      tracts: {
        select: { id: true },
      },
    },
  });
}

export async function createLandProject(data: {
  projectName: string;
  clientName: string;
  projectType: any;
  targetNetMineralAcres: number;
  budgetUsd: number;
}) {
  const project = await prisma.landProject.create({
    data: {
      projectName: data.projectName,
      clientName: data.clientName,
      projectType: data.projectType,
      state: 'TX',
      county: 'TBD',
      targetGrossAcres: data.targetNetMineralAcres * 2,
      targetNetMineralAcres: data.targetNetMineralAcres,
      budgetUsd: data.budgetUsd,
      status: 'ACTIVE',
    },
  });

  revalidatePath('/projects');
  return project;
}
