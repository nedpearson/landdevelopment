"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || \'dummy-key\',
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

    if (!response.choices[0].message.content) return null;
    
    const analysis = JSON.parse(response.choices[0].message.content) as UnderwritingAnalysis;
    
    // Optionally update the DB with the new suggested offer price
    await prisma.property.update({
      where: { id: propertyId },
      data: { suggestedOfferPrice: analysis.maxAllowableOffer }
    });
    
    return analysis;
  } catch (error) {
    console.error("Underwriting generation failed:", error);
    return null;
  }
}
