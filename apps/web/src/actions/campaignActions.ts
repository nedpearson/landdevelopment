'use server';

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCampaignCopy(propertyId: string, role: string) {
  try {
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    // We simulate OpenAI latency here for the prototype. In production, we'd actually prompt GPT-4o.
    await new Promise(res => setTimeout(res, 1500));

    let copy = "";
    if (role === "LAND_INVESTOR" || role === "BROKER") {
      const offerPrice = property.askingPrice ? (property.askingPrice * 0.65) : (property.acreage * 8000);
      copy = `Dear ${property.ownerName},\n\nWe are actively buying land in ${property.county} County and are interested in your ${property.acreage} acre property (APN: ${property.apn}).\n\nWe can offer a fast cash closing of $${offerPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} and will cover all closing costs.\n\nPlease call us if you are interested in selling.\n\nBest,\nAcquisitions Team`;
    } else if (role === "DEVELOPER" || role === "RENEWABLE_DEVELOPER") {
      copy = `Hello ${property.ownerName},\n\nOur firm specializes in land development in ${property.county}. We have identified your ${property.acreage} acre site as a prime location for our next project.\n\nWe are interested in submitting a formal Letter of Intent (LOI) to acquire the property subject to standard entitlement contingencies.\n\nLet's schedule a time to discuss.\n\nRegards,\nDevelopment Director`;
    } else if (role === "PROPERTY_MANAGER") {
      copy = `Hi ${property.ownerName},\n\nI noticed you own the multifamily asset at ${property.address || property.apn}. Our property management firm has successfully increased Net Operating Income (NOI) for similar properties in ${property.state} by optimizing expenses and tenant retention.\n\nI'd love to share our free market rent analysis with you.\n\nBest,\nManagement Team`;
    } else {
      copy = `Dear ${property.ownerName},\n\nWe are reaching out regarding your property in ${property.county}. Please contact us at your earliest convenience to discuss a potential transaction.\n\nThank you,\nThe Team`;
    }

    return { success: true, copy };
  } catch (error) {
    console.error("Failed to generate campaign copy:", error);
    return { success: false, copy: "" };
  }
}
