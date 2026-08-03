"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || \'dummy-key\',
});

export type NegotiationResult = {
  success: boolean;
  aiResponse: string;
  extractedData?: {
    askingPrice?: number;
    desiredTiming?: string;
    reasonForSelling?: string;
    motivationLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
};

export async function processInboundSellerMessage(
  propertyId: string, 
  sellerId: string, 
  messageContent: string
): Promise<NegotiationResult> {
  try {
    // 1. Log the inbound message
    await prisma.communicationLog.create({
      data: {
        sellerId,
        propertyId,
        channel: "SMS",
        direction: "INBOUND",
        content: messageContent,
        status: "RECEIVED"
      }
    });

    // 2. AI Extraction and Response Generation
    const prompt = `
      You are an expert AI Acquisition Negotiator acting on behalf of a land investment firm.
      The seller has just sent the following message: "${messageContent}"
      
      Your tasks:
      1. Extract any negotiation data from the message (Asking Price, Timing, Reason, Motivation).
         - If they mention a dollar amount, parse it to a number.
         - Motivation level must be LOW, MEDIUM, HIGH, or URGENT.
      2. Generate a professional, conversational text message response to the seller.
         - Keep it under 2 sentences.
         - Try to move the negotiation forward (e.g. if they didn't give a price, ask for one).
      
      Return ONLY JSON matching this schema:
      {
        "aiResponse": "The exact text message to send back",
        "askingPrice": 50000, // or null
        "desiredTiming": "ASAP", // or null
        "reasonForSelling": "Needs cash for medical bills", // or null
        "motivationLevel": "HIGH" // or LOW/MEDIUM/URGENT
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a land acquisition AI negotiator. Return strict JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("No AI response");

    const parsed = JSON.parse(resultText);

    // 3. Update Seller and Property data if extracted
    const updateData: any = {};
    if (parsed.askingPrice) updateData.askingPrice = parsed.askingPrice;
    if (parsed.desiredTiming) updateData.desiredTiming = parsed.desiredTiming;
    if (parsed.reasonForSelling) updateData.reasonForSelling = parsed.reasonForSelling;
    if (parsed.motivationLevel) updateData.motivationLevel = parsed.motivationLevel;

    if (Object.keys(updateData).length > 0) {
      await prisma.seller.update({
        where: { id: sellerId },
        data: updateData
      });

      // Also sync asking price to property
      if (parsed.askingPrice) {
        await prisma.property.update({
          where: { id: propertyId },
          data: { askingPrice: parsed.askingPrice }
        });
      }
    }

    // 4. Log the outbound AI response
    await prisma.communicationLog.create({
      data: {
        sellerId,
        propertyId,
        channel: "SMS",
        direction: "OUTBOUND",
        content: parsed.aiResponse,
        status: "SENT"
      }
    });

    return {
      success: true,
      aiResponse: parsed.aiResponse,
      extractedData: updateData
    };

  } catch (error) {
    console.error("Negotiation engine failed:", error);
    return { success: false, aiResponse: "System Error." };
  }
}
