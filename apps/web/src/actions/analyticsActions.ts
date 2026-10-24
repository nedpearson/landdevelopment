'use server';

import { prisma } from '@land-intelligence/database';

export async function getDashboardAnalytics() {
  try {
    const totalProperties = await prisma.property.count();
    
    const activeProjects = await prisma.landProject.count({
      where: {
        status: { not: 'COMPLETED' }
      }
    });

    // Approximate total value
    const valResult = await prisma.property.aggregate({
      _sum: {
        estimatedMarketValue: true
      }
    });
    
    // Recent properties
    const recentProperties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, apn: true, estimatedMarketValue: true, lifecycleStage: true, createdAt: true }
    });

    return {
      success: true,
      data: {
        totalProperties,
        activeProjects,
        totalValue: valResult._sum.estimatedMarketValue || 0,
        recentProperties
      }
    };
  } catch (error: any) {
    console.error('Analytics Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getAnalyticsData() {
  try {
    const propertiesCount = await prisma.property.count();
    const compsCount = await prisma.comp.count();
    const agg = await prisma.property.aggregate({
      _sum: { acreage: true, estimatedMarketValue: true },
      _avg: { askingPrice: true }
    });
    const totalAcreage = agg._sum.acreage || 0;
    const totalValue = agg._sum.estimatedMarketValue || 0;
    const avgPricePerAcre = totalAcreage > 0 ? Math.round(totalValue / totalAcreage) : 0;

    return {
      propertiesCount,
      totalAcreage,
      compsCount,
      avgPricePerAcre,
    };
  } catch (error) {
    return { propertiesCount: 0, totalAcreage: 0, compsCount: 0, avgPricePerAcre: 0 };
  }
}
