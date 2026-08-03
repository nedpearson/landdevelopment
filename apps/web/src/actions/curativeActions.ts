'use server';

import { prisma } from '@land-intelligence/database';

export async function getCurativeItems(tractId?: string) {
  const where = tractId ? { tractId } : {};
  return await prisma.curativeItem.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createCurativeItem(data: any) {
  try {
    const item = await prisma.curativeItem.create({
      data: {
        tractId: data.tractId,
        titleRequirement: data.titleRequirement,
        defectCategory: data.defectCategory,
        severity: data.severity,
        assignedTo: data.assignedTo,
        targetCompletionDate: data.targetCompletionDate ? new Date(data.targetCompletionDate) : undefined,
      },
    });
    return { success: true as const, data: item };
  } catch (e: any) {
    console.error('Error creating curative item:', e);
    return { success: false as const, error: 'Failed to create curative item' };
  }
}

export async function updateCurativeStatus(id: string, status: any) {
  try {
    const item = await prisma.curativeItem.update({
      where: { id },
      data: { status },
    });
    return { success: true as const, data: item };
  } catch (e: any) {
    console.error('Error updating curative status:', e);
    return { success: false as const, error: 'Failed to update curative status' };
  }
}
