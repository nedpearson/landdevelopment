'use server';
import { prisma } from '@land-intelligence/database';

export async function getBuyers() {
  return prisma.buyer.findMany({
    where: { organizationId: 'org_default' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createBuyer(data: {
  name: string; email: string; phone?: string; criteria?: any;
}) {
  try {
    const buyer = await prisma.buyer.create({
      data: {
        ...data,
        organizationId: 'org_default'
      }
    });
    return { success: true as const, data: buyer };
  } catch(e) {
    return { success: false as const, error: 'Failed to create buyer' };
  }
}
