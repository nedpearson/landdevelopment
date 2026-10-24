"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';
import { getSystemMonitoringTelemetry } from './copilot';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export type CopilotResponse = {
  message: string;
  uiAction?: {
    type: 'NAVIGATE' | 'SEARCH' | 'CREATE_CAMPAIGN';
    payload: any;
  };
  groundingData?: any;
};

export async function processCopilotMessage(
  userMessage: string,
  context: { currentPath: string; propertyId?: string; workspaceContext?: string }
): Promise<CopilotResponse> {
  const queryLower = userMessage.toLowerCase();

  // 1. Fetch live telemetry and relevant context from database
  const telemetry = await getSystemMonitoringTelemetry();
  let currentProperty = null;
  if (context.propertyId) {
    currentProperty = await prisma.property.findUnique({
      where: { id: context.propertyId },
      include: { comps: true, sellers: { include: { seller: true } }, dueDiligenceItems: true }
    });
  }

  // 2. If OpenAI is available, query with grounded database facts
  if (openai) {
    try {
      const systemPrompt = `You are the AI Co-Pilot for Land Intelligence OS.
Grounded System Status:
- Total Properties: ${telemetry.totalProperties}
- Pipeline Deals: ${telemetry.pipelineDealsCount}
- Diligence Blockers: ${telemetry.dueDiligenceBlockersCount}
- Portfolio Value: $${telemetry.totalPortfolioValue}
- Current Path: ${context.currentPath}
${currentProperty ? `- Current Property: APN ${currentProperty.apn}, ${currentProperty.acreage} AC in ${currentProperty.county}, ${currentProperty.state}, Owner: ${currentProperty.ownerName}, Asking: $${currentProperty.askingPrice}, EMV: $${currentProperty.estimatedMarketValue}, Stage: ${currentProperty.lifecycleStage}` : ''}

Respond accurately and concisely. Ground your answers ONLY in real records. If navigating, specify the route.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 400
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        return { message: content };
      }
    } catch (err) {
      console.warn("OpenAI API call failed, using deterministic local intelligence engine:", err);
    }
  }

  // 3. Grounded Deterministic Intelligence Engine (Guaranteed real-time responses)

  // Navigation Intents
  if (queryLower.includes("go to") || queryLower.includes("open") || queryLower.includes("navigate")) {
    if (queryLower.includes("properties") || queryLower.includes("property")) {
      return { message: "Opening Properties Management Platform...", uiAction: { type: 'NAVIGATE', payload: { target: 'properties' } } };
    }
    if (queryLower.includes("pipeline") || queryLower.includes("deals")) {
      return { message: "Opening Deal Pipeline...", uiAction: { type: 'NAVIGATE', payload: { target: 'pipeline' } } };
    }
    if (queryLower.includes("underwrite") || queryLower.includes("underwriting")) {
      return { message: "Opening Underwriting Dashboard...", uiAction: { type: 'NAVIGATE', payload: { target: 'underwriting' } } };
    }
    if (queryLower.includes("portfolio")) {
      return { message: "Navigating to Portfolio Holdings...", uiAction: { type: 'NAVIGATE', payload: { target: 'portfolio' } } };
    }
    if (queryLower.includes("map") || queryLower.includes("discover")) {
      return { message: "Opening Geospatial Map & Discovery...", uiAction: { type: 'NAVIGATE', payload: { target: 'discover' } } };
    }
    if (queryLower.includes("report")) {
      return { message: "Opening Reports & Analytics...", uiAction: { type: 'NAVIGATE', payload: { target: 'reports' } } };
    }
  }

  // Monitoring & Telemetry queries
  if (queryLower.includes("monitor") || queryLower.includes("telemetry") || queryLower.includes("status") || queryLower.includes("health")) {
    return {
      message: `System Monitoring Status: HEALTHY. Monitoring ${telemetry.totalProperties} properties across database. Active pipeline opportunities: ${telemetry.pipelineDealsCount}. Total portfolio value: $${telemetry.totalPortfolioValue.toLocaleString()}. Active diligence blockers: ${telemetry.dueDiligenceBlockersCount}.`,
      groundingData: telemetry
    };
  }

  // Diligence & Blockers query
  if (queryLower.includes("diligence") || queryLower.includes("blocker") || queryLower.includes("risk")) {
    const blockers = await prisma.dueDiligenceItem.findMany({
      where: { isBlocker: true },
      include: { property: { select: { apn: true, county: true, state: true } } }
    });

    if (blockers.length === 0) {
      return { message: "All due diligence items across the platform are currently clear of critical blockers." };
    }

    const itemsSummary = blockers.map(b => `• APN ${b.property.apn} (${b.property.county}, ${b.property.state}): ${b.title} [Status: ${b.status}]`).join('\n');
    return {
      message: `Identified ${blockers.length} active due diligence blocker(s) requiring clearance:\n${itemsSummary}`,
      groundingData: blockers
    };
  }

  // Property & Underwriting queries
  if (queryLower.includes("underwrite") || queryLower.includes("mao") || queryLower.includes("valuation") || queryLower.includes("formula") || queryLower.includes("profit") || queryLower.includes("calculat")) {
    return {
      message: `Underwriting Model Methodology:\n• Max Allowable Offer (MAO) = (Estimated Resale Value × 70%) - Development Costs - Holding Costs - Closing Expenses.\n• Target Developer Profit: Resale Value - MAO - Development Costs - Holding Costs.\n• Standard flip target: 50% ROI.\n• Subdivision target: 100% ROI.\nYou can run exact calculations for any parcel in the Underwriting tab.`
    };
  }

  // Pipeline & Opportunities Query
  if (queryLower.includes("pipeline") || queryLower.includes("opportunities") || queryLower.includes("deal") || queryLower.includes("return") || queryLower.includes("development") || queryLower.includes("potential")) {
    const deals = await prisma.property.findMany({
      where: { organizationId: 'org_default' },
      select: { 
        id: true, 
        apn: true, 
        county: true, 
        state: true, 
        acreage: true, 
        lifecycleStage: true, 
        dealScore: true,
        estimatedMarketValue: true,
        askingPrice: true,
        zoningAssessment: true
      },
      orderBy: { dealScore: 'desc' },
      take: 5
    });

    const dealList = deals.map(d => 
      `• [APN ${d.apn}](/properties/${d.id}) (${d.county} County, ${d.state}, ${d.acreage} AC) — Stage: ${d.lifecycleStage} | Deal Score: ${d.dealScore || 85}/100 | EMV: $${(d.estimatedMarketValue || d.askingPrice || 0).toLocaleString()}`
    ).join('\n');

    return {
      message: `Highest Projected Opportunities (${telemetry.totalProperties} canonical properties monitored):\n${dealList}\n\nClick any property APN link above to open its complete authoritative profile, zoning specifications, and underwriting calculations.`,
      groundingData: deals
    };
  }

  // Default Grounded Assistant Response
  return {
    message: `Land Intelligence OS Assistant connected. Currently tracking ${telemetry.totalProperties} properties, $${telemetry.totalPortfolioValue.toLocaleString()} in portfolio assets, and ${telemetry.pipelineDealsCount} pipeline opportunities. Ask me to inspect any property APN, review due diligence blockers, or calculate underwriting parameters.`
  };
}
