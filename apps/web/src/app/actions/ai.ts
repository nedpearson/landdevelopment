"use server";

import OpenAI from 'openai';

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

  // In a real application, you would fetch the full database object here:
  // const data = await db.property.findUnique({ where: { id: entityId } })
  
  // For the sake of this prompt, we provide generic context about the entity type.
  const prompt = `
    You are an expert land development AI analyst. 
    Review the following ${entityType} (ID: ${entityId}). 
    Generate a precise executive summary assessing its potential for development or investment.
    
    Return the response strictly as a JSON object matching this schema:
    {
      "summary": "2-3 sentences of overarching analysis",
      "positiveIndicators": ["point 1", "point 2"],
      "concerns": ["risk 1", "risk 2"],
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
