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
  } catch(e: any) {
    console.error(e);
    return { success: false, error: e.message || 'Failed to create diligence item' };
  }
}

export async function updateDiligenceStatus(id: string, status: any, evidenceNotes?: string) {
  try {
    const item = await prisma.dueDiligenceItem.update({
      where: { id },
      data: {
        status,
        evidenceNotes: evidenceNotes !== undefined ? evidenceNotes : undefined,
        reviewedAt: status === 'VERIFIED' ? new Date() : undefined,
        reviewedBy: status === 'VERIFIED' ? 'Lead Underwriter' : undefined
      }
    });
    return { success: true, data: item };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'Failed to update diligence status' };
  }
}

export async function deleteDiligenceItem(id: string) {
  try {
    await prisma.dueDiligenceItem.delete({ where: { id } });
    return { success: true };
  } catch (e: any) {
    console.error(e);
    return { success: false, error: e.message || 'Failed to delete diligence item' };
  }
}

