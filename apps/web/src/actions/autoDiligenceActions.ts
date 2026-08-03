"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export type DiligenceGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export type DiligenceAssessment = {
  wetlandsPercentage: number;
  floodZone: string;
  roadAccess: string;
  zoning: string;
  buildableAcreage: number;
  overallGrade: DiligenceGrade;
  redFlags: string[];
};

export async function runAutoDiligence(propertyId: string): Promise<DiligenceAssessment | null> {
  try {
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) return null;

    const propertyData = {
      apn: property.apn,
      county: property.county,
      state: property.state,
      acreage: property.acreage
    };

    const prompt = `
      You are an expert AI Geospatial Analyst.
      I will give you a property's APN, County, State, and Acreage.
      I want you to simulate running a geospatial and public records analysis on this parcel.
      
      Output a highly realistic due diligence assessment.
      
      Requirements:
      1. Assign a realistic wetlands percentage (0 to 100).
      2. Identify a FEMA flood zone (e.g., Zone X, Zone AE).
      3. Identify road access type (Paved, Dirt, Landlocked).
      4. Suggest a likely Zoning code (e.g., A-1 Agricultural, R-1 Residential).
      5. Calculate the buildable acreage (Acreage minus wetlands/setbacks).
      6. Assign an overall grade (A, B, C, D, or F).
      7. List 1-3 specific Red Flags if the grade is B or worse.
      
      Property: ${JSON.stringify(propertyData)}
      
      Return ONLY JSON matching this exact schema:
      {
        "wetlandsPercentage": number,
        "floodZone": "string",
        "roadAccess": "string",
        "zoning": "string",
        "buildableAcreage": number,
        "overallGrade": "A" | "B" | "C" | "D" | "F",
        "redFlags": ["flag 1", "flag 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI Geospatial Analyst. Return strict JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) return null;

    const parsed = JSON.parse(response.choices[0].message.content) as DiligenceAssessment;

    // Save back to Property model JSON fields
    await prisma.property.update({
      where: { id: propertyId },
      data: {
        environmentalAssessment: { wetlands: parsed.wetlandsPercentage, floodZone: parsed.floodZone },
        accessAssessment: { roadType: parsed.roadAccess },
        zoningAssessment: { code: parsed.zoning },
        usableAcreage: parsed.buildableAcreage
      }
    });

    return parsed;

  } catch (error) {
    console.error("Auto-Diligence engine failed:", error);
    return null;
  }
}
