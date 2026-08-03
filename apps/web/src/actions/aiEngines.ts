"use server";

import OpenAI from 'openai';
import type { Property } from "@land-intelligence/database";
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

// Phase 10: Industry-Specific AI Engines

export async function generateInvestmentAssessment(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    // In a real app, this would query OpenAI. For the prototype, we simulate the ML engine.
    const flipScore = Math.min(100, Math.round((property.dealScore || 50) * 1.3));
    const wholesaleMargin = property.askingPrice ? (property.askingPrice * 0.65) : (property.acreage * 8000);
    
    return {
      flipScore,
      wholesaleMargin,
      velocity: "High (14 Days)",
      riskProfile: "Low Risk",
      narrative: `Based on the ${property.acreage} acres in ${property.county} county, the AI predicts strong flip potential due to recent market velocity in this zip code.`
    };
  } catch (error) {
    console.error("Investment Engine Error:", error);
    return null;
  }
}

export async function generateRentalAssessment(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    const capRate = 8.2 + (Math.random() * 2);
    const occupancy = 92 + (Math.random() * 5);
    const grossRent = property.acreage > 10 ? 250000 : 85000;

    return {
      capRate: capRate.toFixed(1),
      occupancy: occupancy.toFixed(1),
      grossRent,
      tenantQuality: "High (A-Class)",
      narrative: `Rental demand in ${property.county} is trending upward. We project a ${capRate.toFixed(1)}% cap rate assuming standard multifamily operating expenses.`
    };
  } catch (error) {
    console.error("Rental Engine Error:", error);
    return null;
  }
}

export async function generateDevelopmentAssessment(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    const maxDensity = Math.floor(property.acreage * 4.5);
    const estCost = maxDensity * 125000;

    return {
      maxDensity,
      estCost,
      zoningFriction: "Low (By Right)",
      utilities: "Extension Required",
      narrative: `Highest and Best Use (HBU) analysis indicates ${maxDensity} units. Water and sewer lines are approximately 500ft away, requiring a minor utility extension.`
    };
  } catch (error) {
    console.error("Development Engine Error:", error);
    return null;
  }
}
