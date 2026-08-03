'use server';
import { prisma } from '@land-intelligence/database';
const ORG_ID = 'org_default';

export async function getDiligenceItems(propertyId?: string) {
  const where = propertyId ? { propertyId } : {};
  return prisma.dueDiligenceItem.findMany({
    where,
    include: { property: true },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createDiligenceItem(data: any) {
  try {
    const item = await prisma.dueDiligenceItem.create({
      data: {
        propertyId: data.propertyId,
        category: data.category,
        title: data.title,
        description: data.description,
        isBlocker: data.isBlocker || false,
        assignedToUser: data.assignedToUser,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      }
    });
    return { success: true, data: item };
  } catch(e) {
    console.error(e);
    return { success: false, error: 'Failed to create diligence item' };
  }
}
