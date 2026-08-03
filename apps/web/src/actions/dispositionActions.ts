"use server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export type BuyerMatch = {
  buyerId: string;
  buyerName: string;
  matchScore: number;
  matchReason: string;
  draftEmail: string;
};

export async function runPredictiveMatchmaking(
  propertyDetails: { apn: string; county: string; state: string; acreage: number; type: string }
): Promise<BuyerMatch[] | null> {
  try {
    // In a real scenario, this would query the DB for buyers. We will simulate a pool.
    const prompt = `
      You are an expert real estate dispositions director.
      We just acquired this property: ${propertyDetails.acreage} acres of ${propertyDetails.type} in ${propertyDetails.county} County, ${propertyDetails.state} (APN: ${propertyDetails.apn}).
      
      Simulate searching our internal "Buyer CRM" and identify the top 3 best buyers for this asset.
      For each buyer, provide:
      - buyerName: (invent a realistic institutional or developer name)
      - buyerId: (uuid)
      - matchScore: (percentage match 0-100 based on their simulated buying criteria)
      - matchReason: (e.g. "They bought 500 acres of timberland in the adjacent county last year.")
      - draftEmail: (A highly personalized, aggressive outbound pitch email to this specific buyer from our acquisitions team, selling them on the deal).

      Return ONLY JSON matching this schema:
      {
        "matches": [
          {
            "buyerId": "string",
            "buyerName": "string",
            "matchScore": number,
            "matchReason": "string",
            "draftEmail": "string"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI Dispositions Engine. Return strict JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    const data = JSON.parse(content);
    return data.matches as BuyerMatch[];

  } catch (error) {
    console.error("Matchmaking engine failed:", error);
    return null;
  }
}
