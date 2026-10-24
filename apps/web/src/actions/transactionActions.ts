'use server';

import { prisma } from '@land-intelligence/database';

export async function getTransactions() {
  try {
    const transactions = await prisma.portfolioHolding.findMany({
      where: {
        status: {
          in: ['OWNED', 'LISTED', 'UNDER_CONTRACT', 'SOLD']
        }
      },
      include: {
        property: true
      },
      orderBy: { updatedAt: 'desc' }
    });
    return transactions;
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
}

export async function recordClosingTransaction(data: {
  propertyId: string;
  purchasePrice: number;
  closingCosts?: number;
  holdingCosts?: number;
  estimatedCurrentValue?: number;
}) {
  try {
    const prop = await prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!prop) throw new Error('Property not found');

    const totalCostBasis = data.purchasePrice + (data.closingCosts || 0) + (data.holdingCosts || 0);
    const estimatedCurrentValue = data.estimatedCurrentValue || prop.estimatedMarketValue || (data.purchasePrice * 1.3);
    const unrealizedProfit = estimatedCurrentValue - totalCostBasis;

    const holding = await prisma.portfolioHolding.create({
      data: {
        propertyId: prop.id,
        apn: prop.apn,
        address: prop.address,
        county: prop.county,
        state: prop.state,
        acreage: prop.acreage,
        acquisitionDate: new Date(),
        purchasePrice: data.purchasePrice,
        closingCosts: data.closingCosts || 0,
        holdingCosts: data.holdingCosts || 0,
        totalCostBasis,
        estimatedCurrentValue,
        unrealizedProfit,
        holdingDays: 0,
        status: 'OWNED'
      }
    });

    // Advance property stage to OWNED
    await prisma.property.update({
      where: { id: prop.id },
      data: { lifecycleStage: 'OWNED' }
    });

    return { success: true, data: holding };
  } catch (error: any) {
    console.error('Failed to record closing:', error);
    return { success: false, error: error.message || 'Failed to record transaction' };
  }
}

export async function updateTransactionStatus(id: string, status: any) {
  try {
    const holding = await prisma.portfolioHolding.update({
      where: { id },
      data: { status }
    });
    return { success: true, data: holding };
  } catch (error: any) {
    console.error('Failed to update transaction status:', error);
    return { success: false, error: error.message || 'Failed to update transaction status' };
  }
}
