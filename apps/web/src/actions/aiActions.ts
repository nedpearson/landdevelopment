"use server";

import OpenAI from "openai";
import { prisma } from "@land-intelligence/database";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function askPortfolioAssistant(query: string) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "OpenAI API Key is missing. Please set OPENAI_API_KEY in your .env.local file to use the AI Assistant.";
    }

    // Fetch some basic portfolio stats to inject as context
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        lifecycleStage: true,
        acreage: true,
        county: true,
        state: true,
        askingPrice: true
      }
    });

    const activeProperties = properties.filter(p => p.lifecycleStage !== "ARCHIVED");
    const totalAcreage = activeProperties.reduce((sum, p) => sum + p.acreage, 0);

    const contextMessage = `
    System Context: You are the 'Land Intelligence OS' AI Portfolio Assistant. You help real estate developers and landmen understand their portfolio.
    Current Portfolio Stats:
    - Active Properties: ${activeProperties.length}
    - Total Acreage: ${totalAcreage.toFixed(2)} acres
    
    Answer the user's question concisely and professionally.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: contextMessage },
        { role: "user", content: query }
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return "An error occurred while connecting to the AI service. Please try again.";
  }
}
