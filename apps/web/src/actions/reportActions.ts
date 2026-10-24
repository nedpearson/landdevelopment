'use server';

import { prisma } from '@land-intelligence/database';

export async function getReportData() {
  try {
    const [properties, sellers, buyers, holdings, offers] = await Promise.all([
      prisma.property.findMany({
        select: { id: true, apn: true, county: true, state: true, acreage: true, lifecycleStage: true, estimatedMarketValue: true, dealScore: true }
      }),
      prisma.seller.count(),
      prisma.buyer.count(),
      prisma.portfolioHolding.findMany({
        select: { id: true, apn: true, purchasePrice: true, totalCostBasis: true, estimatedCurrentValue: true, unrealizedProfit: true, holdingDays: true, status: true }
      }),
      prisma.offer.findMany({
        select: { id: true, status: true, propertyId: true, selectedScenarioKey: true, scenarios: true }
      })
    ]);

    // Stage Distribution
    const stageMap: Record<string, number> = {};
    properties.forEach(p => {
      stageMap[p.lifecycleStage] = (stageMap[p.lifecycleStage] || 0) + 1;
    });

    // County Distribution
    const countyMap: Record<string, { count: number; acreage: number; totalValue: number }> = {};
    properties.forEach(p => {
      const key = `${p.county}, ${p.state}`;
      if (!countyMap[key]) {
        countyMap[key] = { count: 0, acreage: 0, totalValue: 0 };
      }
      countyMap[key].count++;
      countyMap[key].acreage += p.acreage;
      countyMap[key].totalValue += (p.estimatedMarketValue || 0);
    });

    const totalPortfolioBasis = holdings.reduce((sum, h) => sum + (h.totalCostBasis || h.purchasePrice || 0), 0);
    const totalPortfolioValue = holdings.reduce((sum, h) => sum + (h.estimatedCurrentValue || 0), 0);
    const totalUnrealizedGain = totalPortfolioValue - totalPortfolioBasis;

    return {
      success: true,
      data: {
        totalProperties: properties.length,
        totalSellers: sellers,
        totalBuyers: buyers,
        stageDistribution: stageMap,
        countyBreakdown: countyMap,
        portfolioMetrics: {
          totalBasis: totalPortfolioBasis,
          totalValue: totalPortfolioValue,
          unrealizedGain: totalUnrealizedGain,
          totalHoldings: holdings.length
        },
        offersSummary: {
          total: offers.length,
          accepted: offers.filter(o => o.status === 'ACCEPTED').length,
          sent: offers.filter(o => o.status === 'SENT').length
        }
      }
    };
  } catch (error: any) {
    console.error('Report query error:', error);
    return { success: false, error: error.message };
  }
}

export async function exportReportCSV(type: string) {
  try {
    if (type === 'portfolio') {
      const holdings = await prisma.portfolioHolding.findMany();
      const headers = ['APN', 'County', 'State', 'Acreage', 'Cost Basis', 'Current Value', 'Unrealized Gain', 'Status'];
      const rows = holdings.map(h => [
        h.apn,
        h.county,
        h.state,
        h.acreage.toString(),
        h.totalCostBasis.toString(),
        h.estimatedCurrentValue.toString(),
        h.unrealizedProfit.toString(),
        h.status
      ].join(','));
      return { success: true, data: [headers.join(','), ...rows].join('\n') };
    }

    // Default: properties report
    const properties = await prisma.property.findMany();
    const headers = ['APN', 'County', 'State', 'Acreage', 'Owner', 'Stage', 'EMV', 'Deal Score'];
    const rows = properties.map(p => [
      p.apn,
      p.county,
      p.state,
      p.acreage.toString(),
      `"${p.ownerName}"`,
      p.lifecycleStage,
      (p.estimatedMarketValue || 0).toString(),
      (p.dealScore || 0).toString()
    ].join(','));
    return { success: true, data: [headers.join(','), ...rows].join('\n') };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
