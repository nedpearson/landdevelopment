"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIAnalysisResult {
  summary: string;
  positiveIndicators: string[];
  concerns: string[];
  recommendedSteps: string[];
  confidence: number;
}

export async function generateExecutiveSummary(entityId: string, entityType: string): Promise<AIAnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing. Please add OPENAI_API_KEY to your environment variables.");
  }

  let entityData = null;
  
  try {
    if (entityType === "PROPERTY") {
      entityData = await prisma.property.findUnique({
        where: { id: entityId },
        include: {
          tracts: true,
          sellers: true,
          offers: true,
        }
      });
    } else if (entityType === "OWNER" || entityType === "SELLER") {
      entityData = await prisma.seller.findUnique({
        where: { id: entityId },
        include: { properties: true }
      });
    }
  } catch (err) {
    console.error("Database fetch failed:", err);
  }

  if (!entityData) {
    throw new Error(`Could not locate ${entityType} record with ID: ${entityId}`);
  }

  const prompt = `
    You are an expert land development AI analyst. 
    Review the following real data for a ${entityType} (ID: ${entityId}). 
    
    DATA:
    ${JSON.stringify(entityData, null, 2)}
    
    Generate a precise executive summary assessing its potential for development, investment, or acquisition.
    
    Return the response strictly as a JSON object matching this schema:
    {
      "summary": "2-3 sentences of overarching analysis based on the actual data provided.",
      "positiveIndicators": ["point 1 based on data", "point 2 based on data"],
      "concerns": ["risk 1 based on data", "risk 2 based on data"],
      "recommendedSteps": ["step 1", "step 2"],
      "confidence": 85
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a specialized land intelligence AI. Return strictly JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("No response from OpenAI");

    return JSON.parse(resultText) as AIAnalysisResult;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to generate AI executive summary.");
  }
}
