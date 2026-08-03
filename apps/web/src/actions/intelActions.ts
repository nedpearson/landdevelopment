"use server";

import OpenAI from 'openai';
import { prisma } from '@land-intelligence/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || \'dummy-key\',
});

export type MarketIntel = {
  summary: string;
  opportunities: Array<{
    id: string;
    apn: string;
    county: string;
    reason: string;
  }>;
};

export async function generateDailyMarketIntel(): Promise<MarketIntel | null> {
  try {
    // The Predictive Motivation Engine: find highly motivated "Flight Risk" properties
    const candidates = await prisma.property.findMany({
      take: 5,
      orderBy: { dealScore: 'desc' },
      where: {
        OR: [
          { absenteeOwner: true },
          { ownershipLengthYears: { gte: 15 } },
          { taxDelinquent: true },
          { dealScore: { gte: 80 } }
        ]
      }
    });

    if (candidates.length === 0) return null;

    const propertyData = candidates.map(c => ({
      id: c.id,
      apn: c.apn,
      county: c.county,
      acreage: c.acreage,
      dealScore: c.dealScore,
      absenteeOwner: c.absenteeOwner,
      ownershipLengthYears: c.ownershipLengthYears,
      taxDelinquent: c.taxDelinquent
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are the Lead Acquisition Analyst for an automated land investment fund. 
Review the provided list of highly-motivated "flight risk" property opportunities (e.g. out of state, held 15+ years, or tax delinquent).
Write a brief 2-sentence morning briefing summarizing why these specific owners are highly motivated to sell today.
Then, for each property provided, write a 1-sentence specific reason why it is a high-priority acquisition target (mentioning their specific distress factors like absentee ownership or long hold times).

Output MUST be valid JSON matching this schema:
{
  "summary": "The 2-sentence briefing...",
  "opportunities": [
    { "id": "uuid", "apn": "string", "county": "string", "reason": "1-sentence reason" }
  ]
}`
        },
        { role: "user", content: JSON.stringify(propertyData) }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices[0].message.content) return null;
    return JSON.parse(response.choices[0].message.content) as MarketIntel;
  } catch (error) {
    console.error("Intel generation failed:", error);
    return null;
  }
}
