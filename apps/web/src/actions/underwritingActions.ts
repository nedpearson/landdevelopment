"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export type UnderwritingAnalysis = {
  maxAllowableOffer: number;
  estimatedResaleValue: number;
  developmentCosts: number;
  holdingCosts: number;
  netProfit: number;
  projectedROI: number;
  recommendation: "STRONG BUY" | "BUY" | "HOLD" | "PASS";
  reasoning: string;
  riskFactors: string[];
};

export async function generateUnderwritingAnalysis(propertyId: string): Promise<UnderwritingAnalysis | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) return null;

    // We send a stripped down version of the property to the AI for analysis
    const propertyData = {
      apn: property.apn,
      county: property.county,
      acreage: property.acreage,
      askingPrice: property.askingPrice || (property.acreage * 10000), // fallback guess
      estimatedMarketValue: property.estimatedMarketValue || (property.acreage * 20000),
      zoningAssessment: property.zoningAssessment,
      utilityAssessment: property.utilityAssessment,
      dealScore: property.dealScore
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Lead Acquisition Underwriter for an automated land investment fund.
Your job is to analyze a property and calculate the exact financial viability and Max Allowable Offer (MAO).

RULES:
- A typical land flip requires a 50% ROI.
- A subdivision play requires a 100% ROI.
- Development costs generally run $5,000 per acre for raw land, more if utilities are missing.
- Holding costs are typically 5% of the purchase price per year, assume a 1-year hold.

Given the property data, calculate the numbers and provide a recommendation.
Return ONLY valid JSON matching this schema exactly:
{
  "maxAllowableOffer": number,
  "estimatedResaleValue": number,
  "developmentCosts": number,
  "holdingCosts": number,
  "netProfit": number,
  "projectedROI": number, // as a percentage, e.g., 55.5
  "recommendation": "STRONG BUY" | "BUY" | "HOLD" | "PASS",
  "reasoning": "2-3 sentence explanation of the math and strategy",
  "riskFactors": ["Risk 1", "Risk 2"]
}`
        },
        { role: "user", content: JSON.stringify(propertyData) }
      ],
      response_format: { type: "json_object" }
    });

    if (response.choices[0].message.content) {
      const analysis = JSON.parse(response.choices[0].message.content) as UnderwritingAnalysis;
      await prisma.property.update({
        where: { id: propertyId },
        data: { suggestedOfferPrice: analysis.maxAllowableOffer }
      });
      return analysis;
    }
  } catch (error) {
    console.warn("OpenAI Underwriting API call failed, using deterministic financial model:", error);
  }

  // Guaranteed Deterministic Mathematical Underwriting Model
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) return null;

    const emv = property.estimatedMarketValue || (property.acreage * 20000);
    const devCosts = Math.round(property.acreage * 3000);
    const holdingCosts = Math.round(emv * 0.05);
    const mao = Math.max(10000, Math.round((emv * 0.70) - devCosts - holdingCosts));
    const profit = Math.round(emv - mao - devCosts - holdingCosts);
    const roi = Number(((profit / mao) * 100).toFixed(1));

    await prisma.property.update({
      where: { id: propertyId },
      data: { suggestedOfferPrice: mao }
    });

    return {
      maxAllowableOffer: mao,
      estimatedResaleValue: emv,
      developmentCosts: devCosts,
      holdingCosts: holdingCosts,
      netProfit: profit,
      projectedROI: roi,
      recommendation: roi >= 50 ? "STRONG BUY" : "BUY",
      reasoning: `Mathematical Model: Resale Value $${emv.toLocaleString()} minus 30% margin, dev deductions of $${devCosts.toLocaleString()}, and holding costs of $${holdingCosts.toLocaleString()} yields MAO $${mao.toLocaleString()} at ${roi}% target ROI.`,
      riskFactors: ["Verify legal road access with county", "Confirm water well drilling depth & permit"]
    };
  } catch (err) {
    console.error("Underwriting generation failed:", err);
    return null;
  }
}
