'use server';
import { prisma } from '@land-intelligence/database';

export async function getSellers() {
  return prisma.seller.findMany({
    where: { organizationId: 'org_default' },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createSeller(data: {
  name: string; email?: string; phone?: string; askingPrice?: number; motivationLevel?: any;
}) {
  try {
    const seller = await prisma.seller.create({
      data: {
        ...data,
        organizationId: 'org_default'
      }
    });
    return { success: true as const, data: seller };
  } catch(e) {
    return { success: false as const, error: 'Failed to create seller' };
  }
}
