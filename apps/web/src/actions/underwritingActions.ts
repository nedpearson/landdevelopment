'use server';

import { prisma } from '@land-intelligence/database';
import { revalidatePath } from 'next/cache';

/**
 * Calculates a Deal Score (0-100) based on Property attributes.
 * This is a simplified proxy for a real underwriting algorithm.
 */
export async function calculateDealScore(propertyId: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) throw new Error("Property not found");

    let score = 50; // Base average score

    // Acreage Factor: Larger parcels generally have better economies of scale
    if (property.acreage > 100) score += 15;
    else if (property.acreage > 20) score += 10;
    else if (property.acreage < 1) score -= 10;

    // Price Factor: Cheaper price per acre is better (assuming $1000/acre as baseline)
    if (property.askingPrice && property.askingPrice > 0) {
      const ppa = property.askingPrice / property.acreage;
      if (ppa < 500) score += 20;
      else if (ppa < 1000) score += 10;
      else if (ppa > 5000) score -= 15;
    }

    // Constraints & Flags
    const zoningStr = JSON.stringify(property.zoningAssessment || {});
    const envStr = JSON.stringify(property.environmentalAssessment || {});
    const utilStr = JSON.stringify(property.utilityAssessment || {});

    if (zoningStr.includes("Commercial")) score += 10;
    if (envStr.includes("Wetland")) score -= 25;
    if (utilStr.includes("Sewer")) score += 15;

    // Normalize 0-100
    score = Math.max(0, Math.min(100, score));

    // Persist score
    await prisma.property.update({
      where: { id: propertyId },
      data: { dealScore: score } 
    });

    revalidatePath('/properties');
    revalidatePath(`/properties/${propertyId}`);

    return { success: true, score };
  } catch (error) {
    console.error("Underwriting Error:", error);
    return { success: false, error: "Failed to calculate deal score" };
  }
}
