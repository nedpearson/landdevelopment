"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type GeneratedDocument = {
  title: string;
  content: string;
  clauses: string[];
};

export async function generatePSA(propertyId: string): Promise<GeneratedDocument | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        sellers: {
          include: { seller: true }
        }
      }
    });

    if (!property) return null;

    const sellerName = property.sellers[0]?.seller?.name || property.ownerName || "SELLER NAME";
    
    const prompt = `
      You are an expert Real Estate Attorney.
      Generate a realistic Purchase and Sale Agreement (PSA) for a land acquisition.
      
      Property details:
      - APN: ${property.apn}
      - County/State: ${property.county}, ${property.state}
      - Acreage: ${property.acreage}
      - Seller: ${sellerName}
      - Offer Price: $${property.suggestedOfferPrice || 50000}
      
      Requirements:
      1. Include standard real estate PSA language.
      2. Include a specific clause about a 30-day feasibility/due diligence period.
      3. Format the document nicely with clear headings.
      
      Return ONLY a JSON object matching this exact schema:
      {
        "title": "Document Title",
        "content": "The full text of the agreement (use markdown formatting)",
        "clauses": ["Key Clause 1 summary", "Key Clause 2 summary"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a legal document generator. Return strict JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) return null;

    return JSON.parse(response.choices[0].message.content) as GeneratedDocument;
  } catch (error) {
    console.error("Failed to generate PSA:", error);
    return null;
  }
}
