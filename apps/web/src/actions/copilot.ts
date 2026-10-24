"use server";

import { prisma } from '@land-intelligence/database';

export interface SystemMonitoringTelemetry {
  timestamp: string;
  databaseStatus: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED';
  totalProperties: number;
  pipelineDealsCount: number;
  highScoreOpportunities: number;
  dueDiligenceBlockersCount: number;
  totalPortfolioValue: number;
  unrealizedProfit: number;
  recentAlerts: string[];
}

export async function getSystemMonitoringTelemetry(): Promise<SystemMonitoringTelemetry> {
  try {
    const [properties, diligenceBlockers, portfolio] = await Promise.all([
      prisma.property.findMany({
        where: { organizationId: 'org_default' },
        select: { id: true, apn: true, dealScore: true, lifecycleStage: true, estimatedMarketValue: true }
      }),
      prisma.dueDiligenceItem.count({
        where: { isBlocker: true, status: { in: ['PENDING', 'IN_PROGRESS', 'FAILED_BLOCKER'] } }
      }),
      prisma.portfolioHolding.findMany({
        select: { purchasePrice: true, estimatedCurrentValue: true, unrealizedProfit: true }
      })
    ]);

    const highScoreCount = properties.filter(p => (p.dealScore || 0) >= 80).length;
    const pipelineCount = properties.filter(p => 
      ['PROSPECT', 'QUALIFIED', 'UNDERWRITING', 'DUE_DILIGENCE', 'OFFER_SENT', 'CONTRACTED'].includes(p.lifecycleStage)
    ).length;

    const totalPortfolioValue = portfolio.reduce((sum, h) => sum + (h.estimatedCurrentValue || 0), 0);
    const unrealizedProfit = portfolio.reduce((sum, h) => sum + (h.unrealizedProfit || 0), 0);

    const alerts: string[] = [];
    if (diligenceBlockers > 0) {
      alerts.push(`${diligenceBlockers} active due diligence blocker(s) require clearance before closing.`);
    }
    if (highScoreCount > 0) {
      alerts.push(`${highScoreCount} high-conviction parcel(s) (Deal Score ≥ 80) identified for acquisition.`);
    }

    return {
      timestamp: new Date().toISOString(),
      databaseStatus: 'HEALTHY',
      totalProperties: properties.length,
      pipelineDealsCount: pipelineCount,
      highScoreOpportunities: highScoreCount,
      dueDiligenceBlockersCount: diligenceBlockers,
      totalPortfolioValue,
      unrealizedProfit,
      recentAlerts: alerts
    };
  } catch (error) {
    console.error('Telemetry query error:', error);
    return {
      timestamp: new Date().toISOString(),
      databaseStatus: 'DEGRADED',
      totalProperties: 0,
      pipelineDealsCount: 0,
      highScoreOpportunities: 0,
      dueDiligenceBlockersCount: 0,
      totalPortfolioValue: 0,
      unrealizedProfit: 0,
      recentAlerts: ['Database telemetry connection offline']
    };
  }
}

export async function getProactiveInsights(role: string): Promise<string> {
  const telemetry = await getSystemMonitoringTelemetry();

  if (telemetry.databaseStatus !== 'HEALTHY') {
    return "Telemetry status: Database connection currently disconnected or degraded. Real-time monitoring paused.";
  }

  if (role === 'LAND_INVESTOR') {
    return `System Telemetry Active: Monitoring ${telemetry.totalProperties} properties across ${telemetry.pipelineDealsCount} pipeline stages. ${telemetry.highScoreOpportunities} high-conviction deal(s) detected (Score ≥ 80). ${telemetry.dueDiligenceBlockersCount} due diligence blocker(s) pending.`;
  }

  if (role === 'DEVELOPER') {
    return `System Telemetry Active: Monitoring development opportunities. Total portfolio value evaluated at $${telemetry.totalPortfolioValue.toLocaleString()} with $${telemetry.unrealizedProfit.toLocaleString()} unrealized profit.`;
  }

  return `System Telemetry Active: ${telemetry.totalProperties} properties tracked. ${telemetry.recentAlerts.join(' ')}`;
}
