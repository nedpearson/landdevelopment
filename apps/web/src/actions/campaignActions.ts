'use server';

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCampaignCopy(propertyId: string, role: string, channel: string = "Email") {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing.");
    }

    const property = await prisma.property.findUnique({ 
      where: { id: propertyId },
      include: {
        sellers: true
      }
    });
    
    if (!property) throw new Error("Property not found");

    const prompt = `
      You are an expert real estate copywriter. 
      Draft a highly personalized outreach message for the following property.
      
      Property Info:
      APN: ${property.apn}
      Acreage: ${property.acreage} acres
      County/State: ${property.county}, ${property.state}
      Zoning/Class: ${property.propertyClass}
      Asking Price: $${property.askingPrice || 'Unlisted'}
      Owner Name: ${property.ownerName}
      
      Sender Role: ${role}
      Channel: ${channel}
      
      Instructions:
      - If channel is SMS, keep it extremely brief (under 160 characters) and casual.
      - If channel is Email, be professional but concise (2-3 short paragraphs).
      - If channel is Direct Mail, format it as a formal letter.
      - Use the specific property details (acreage, county) to prove we are looking at their specific parcel.
      - If Sender Role is INVESTOR or BROKER, focus on an all-cash quick close.
      - If Sender Role is DEVELOPER, focus on purchasing subject to entitlements/zoning.
      - Do not use placeholders like [Your Name]. Use generic sign-offs like "Acquisitions Team" or "Development Director".
      - Return ONLY the raw text copy, no markdown formatting or extra conversational text.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a specialized land acquisition copywriter." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    const copy = response.choices[0]?.message?.content?.trim();
    if (!copy) throw new Error("No response from OpenAI");

    const message = await prisma.campaignMessage.create({
      data: {
        propertyId,
        channel,
        role,
        copy,
        status: "DRAFT"
      }
    });

    return { success: true, copy, messageId: message.id };
  } catch (error: any) {
    console.error("Failed to generate campaign copy:", error);
    return { success: false, copy: "Failed to generate copy. Please try again later.", error: error.message };
  }
}

export async function getCampaignMessages(propertyId: string) {
  try {
    const messages = await prisma.campaignMessage.findMany({
      where: { propertyId },
      orderBy: { createdAt: 'desc' }
    });
    return messages;
  } catch (error) {
    console.error("Failed to fetch campaign messages:", error);
    return [];
  }
}
