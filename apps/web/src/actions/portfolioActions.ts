'use server';

import { prisma } from '@land-intelligence/database';

export async function getPortfolioHoldings() {
  try {
    const holdings = await prisma.portfolioHolding.findMany({
      include: { property: true },
      orderBy: { acquisitionDate: 'desc' }
    });
    return holdings;
  } catch (error) {
    console.error('Failed to get portfolio holdings:', error);
    return [];
  }
}

export async function createPortfolioHolding(data: any) {
  try {
    const holding = await prisma.portfolioHolding.create({
      data,
    });
    return { success: true as const, data: holding };
  } catch (error: any) {
    console.error('Failed to create portfolio holding:', error);
    return { success: false as const, error: error.message || 'Failed to create portfolio holding' };
  }
}

export async function updateHoldingValue(id: string, estimatedCurrentValue: number) {
  try {
    const holding = await prisma.portfolioHolding.update({
      where: { id },
      data: { estimatedCurrentValue },
    });
    return { success: true as const, data: holding };
  } catch (error: any) {
    console.error('Failed to update holding value:', error);
    return { success: false as const, error: error.message || 'Failed to update holding value' };
  }
}

export async function getPropertiesForDropdown() {
  try {
    return await prisma.property.findMany({ take: 50, select: { id: true, apn: true, county: true, state: true } });
  } catch (error) {
    return [];
  }
}
