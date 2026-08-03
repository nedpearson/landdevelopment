"use server";

import OpenAI from 'openai';
import { prisma } from "@land-intelligence/database";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key"|| 'dummy_key', 
});

export async function askPortfolioAssistant(question: string) {
  try {
    if (process.env.OPENAI_API_KEY === 'dummy_key' || !process.env.OPENAI_API_KEY) {
      return "⚠️ **OpenAI API Key Not Found**\n\nI am currently running in offline mode. Please add `OPENAI_API_KEY` to your environment variables to enable the live Portfolio Assistant.";
    }

    const properties = await prisma.property.findMany();
    const holdings = await prisma.portfolioHolding.findMany({ include: { property: true }});
    const buyers = await prisma.buyer.findMany();
    const sellers = await prisma.seller.findMany();

    const systemPrompt = `You are the AI Chief Operations Officer for Land Intelligence OS.
Your job is to answer questions about the portfolio and perform tasks when requested.
Current Portfolio Context:
- Properties: ${properties.length}
- Portfolio Holdings: ${holdings.length}
- Buyers: ${buyers.length}
- Sellers: ${sellers.length}

Keep your answers concise, professional, and directly address the user's question.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "draft_offer",
            description: "Drafts a new purchase offer for a property.",
            parameters: {
              type: "object",
              properties: {
                propertyId: { type: "string", description: "The ID of the property." },
                amount: { type: "number", description: "The offer amount in dollars." },
              },
              required: ["propertyId", "amount"],
            }
          }
        }
      ],
      temperature: 0.3,
    });

    const message = response.choices[0].message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      for (const toolCall of message.tool_calls) {
        if (toolCall.type === 'function' && toolCall.function?.name === 'draft_offer') {
          const args = JSON.parse(toolCall.function.arguments);
          
          // Must find a seller for the property
          const propertySeller = await prisma.propertySeller.findFirst({
            where: { propertyId: args.propertyId }
          });
          
          if (!propertySeller) {
             return `Error: Could not draft offer because Property ${args.propertyId} has no associated Seller.`;
          }

          await prisma.offer.create({
            data: {
              propertyId: args.propertyId,
              sellerId: propertySeller.sellerId,
              status: 'DRAFT', 
              scenarios: { cash: { price: args.amount, notes: 'Drafted by AI Assistant' } }
            }
          });
          return `I have successfully drafted an offer for Property ID ${args.propertyId} in the amount of $${args.amount.toLocaleString()}. The offer is safely stored in DRAFT status awaiting your review.`;
        }
      }
    }

    return message.content || "I'm sorry, I couldn't process that request.";

  } catch (error: any) {
    console.error("AI Assistant Error:", error);
    return `An error occurred while consulting the AI Assistant: ${error.message}`;
  }
}
