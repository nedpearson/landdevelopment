'use server';

import { prisma } from '@land-intelligence/database';

const ORG_ID = 'org_default';

export async function getPipelineDeals() {
  try {
    const deals = await prisma.property.findMany({
      where: {
        organizationId: ORG_ID,
        lifecycleStage: {
          in: [
            'PROSPECT',
            'CONTACTED',
            'QUALIFIED',
            'UNDERWRITING',
            'DUE_DILIGENCE',
            'OFFER_DRAFTED',
            'OFFER_SENT',
            'NEGOTIATION',
            'CONTRACTED'
          ]
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return deals;
  } catch (error) {
    console.error('Failed to get pipeline deals:', error);
    return [];
  }
}

export async function updateDealStage(id: string, stage: any) {
  try {
    const deal = await prisma.property.update({
      where: { id },
      data: { lifecycleStage: stage },
    });
    return { success: true as const, data: deal };
  } catch (error: any) {
    console.error('Failed to update deal stage:', error);
    return { success: false as const, error: error.message || 'Failed to update deal stage' };
  }
}

export async function createDeal(data: any) {
  try {
    const deal = await prisma.property.create({
      data: {
        ...data,
        organizationId: ORG_ID,
        lifecycleStage: 'PROSPECT',
      },
    });
    return { success: true as const, data: deal };
  } catch (error: any) {
    console.error('Failed to create deal:', error);
    return { success: false as const, error: error.message || 'Failed to create deal' };
  }
}
