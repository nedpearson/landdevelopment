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
