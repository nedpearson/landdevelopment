'use server';

import { prisma } from '@land-intelligence/database';

export async function getReportData() {
  try {
    const totalProperties = await prisma.property.count();
    const totalSellers = await prisma.seller.count();
    const totalBuyers = await prisma.buyer.count();
    
    // Deals by stage
    const dealsByStage = await prisma.property.groupBy({
      by: ['lifecycleStage'],
      _count: { lifecycleStage: true }
    });

    const formattedDeals = dealsByStage.map(d => ({
      stage: d.lifecycleStage.replace(/_/g, ' '),
      count: d._count.lifecycleStage
    }));

    return {
      success: true,
      data: {
        totalProperties,
        totalSellers,
        totalBuyers,
        dealsByStage: formattedDeals
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
