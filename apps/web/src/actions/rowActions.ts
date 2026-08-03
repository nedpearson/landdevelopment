'use server';

import { prisma } from '@land-intelligence/database';

export async function getROWSegments(projectId?: string) {
  const where = projectId ? { projectId } : {};
  return await prisma.rightOfWaySegment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createROWSegment(data: any) {
  try {
    const segment = await prisma.rightOfWaySegment.create({
      data: {
        projectId: data.projectId,
        segmentName: data.segmentName,
        infrastructureType: data.infrastructureType,
        centerlineLengthRods: Number(data.centerlineLengthRods || 0),
        easementWidthFeet: Number(data.easementWidthFeet || 0),
        permanentAcres: Number(data.permanentAcres || 0),
        temporaryAcres: Number(data.temporaryAcres || 0),
        pricePerRodUsd: Number(data.pricePerRodUsd || 0),
        surfaceDamageUsd: Number(data.surfaceDamageUsd || 0),
        cropDamageUsd: Number(data.cropDamageUsd || 0),
        totalOfferUsd: Number(data.totalOfferUsd || 0),
      },
    });
    return { success: true as const, data: segment };
  } catch (e: any) {
    console.error('Error creating ROW segment:', e);
    return { success: false as const, error: 'Failed to create ROW segment' };
  }
}
