'use server';

import { prisma } from '@land-intelligence/database';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

export type SearchResult = {
  id: string;
  type: 'PROPERTY' | 'OWNER' | 'OFFER' | 'SELLER' | 'AI_FILTER' | 'TRACT' | 'LEASE' | 'DOCUMENT';
  title: string;
  subtitle: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const q = query.toLowerCase();
    
    // Phase 26: True NLP Universal Search
    let isNaturalLanguage = false;
    let propertyWhere: any = {};
    
    // Determine if the query is conversational/NLP
    if (q.split(' ').length > 2 || q.includes('over') || q.includes('under') || q.includes('in') || q.includes('acres')) {
      isNaturalLanguage = true;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You convert user natural language search queries into a Prisma where object for a Property model. Fields available: acreage (float), askingPrice (float), state (string code, e.g. 'TX'), county (string), propertyClass (enum: RESIDENTIAL_SINGLE_FAMILY, RESIDENTIAL_MULTI_FAMILY, COMMERCIAL_RETAIL, COMMERCIAL_OFFICE, VACANT_LAND, INDUSTRIAL)." },
          { role: "user", content: query }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "build_prisma_where",
              description: "Builds a prisma where clause",
              parameters: {
                type: "object",
                properties: {
                  acreage: {
                    type: "object",
                    properties: { gte: { type: "number" }, lte: { type: "number" } }
                  },
                  askingPrice: {
                    type: "object",
                    properties: { gte: { type: "number" }, lte: { type: "number" } }
                  },
                  state: { type: "string" },
                  county: { type: "string" },
                  propertyClass: { type: "string" }
                }
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "build_prisma_where" } }
      });
      
      const toolCall = response.choices[0].message.tool_calls?.[0];
      if (toolCall && toolCall.type === "function") {
        propertyWhere = JSON.parse(toolCall.function.arguments);
      }
    } else {
      propertyWhere = {
        OR: [
          { apn: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { ownerName: { contains: query, mode: 'insensitive' } }
        ]
      };
    }

    // Run all queries in parallel for maximum performance
    const [properties, sellers, tracts, leases] = await Promise.all([
      // 1. Search Properties (NLP or Literal)
      prisma.property.findMany({
        where: propertyWhere,
        take: 5
      }),
      
      // 2. Search Sellers (Name, Email, Phone) - Literal only
      isNaturalLanguage ? Promise.resolve([]) : prisma.seller.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 3
      }),

      // 3. Search Tracts
      isNaturalLanguage ? Promise.resolve([]) : prisma.landTract.findMany({
        where: {
          OR: [
            { tractNumber: { contains: query, mode: 'insensitive' } },
            { surfaceOwnerName: { contains: query, mode: 'insensitive' } },
            { mineralOwnerName: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 3
      }),

      // 4. Search Leases
      isNaturalLanguage ? Promise.resolve([]) : prisma.leaseRecord.findMany({
        where: {
          OR: [
            { leaseNumber: { contains: query, mode: 'insensitive' } },
            { lessorName: { contains: query, mode: 'insensitive' } },
            { lesseeName: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 3
      })
    ]);

    const results: SearchResult[] = [];

    // Add a natural language hint card if NLP was used
    if (isNaturalLanguage) {
      results.push({
        id: "nlp-hint",
        type: "AI_FILTER",
        title: `AI Filter Applied: ${query}`,
        subtitle: `Found ${properties.length} matching properties based on your natural language request.`
      });
    }

    properties.forEach(p => {
      results.push({
        id: p.id,
        type: 'PROPERTY',
        title: p.apn,
        subtitle: p.address || p.ownerName || `${p.acreage} Acres in ${p.county}, ${p.state}`
      });
    });

    sellers.forEach(s => {
      results.push({
        id: s.id,
        type: 'SELLER',
        title: s.name,
        subtitle: s.email || s.phone || 'No Contact Info'
      });
    });

    tracts.forEach(t => {
      results.push({
        id: t.id,
        type: 'TRACT',
        title: `Tract ${t.tractNumber}`,
        subtitle: `${t.surfaceOwnerName} - ${t.grossAcres} Acres`
      });
    });

    leases.forEach(l => {
      results.push({
        id: l.id,
        type: 'LEASE',
        title: `Lease ${l.leaseNumber}`,
        subtitle: `${l.lessorName} to ${l.lesseeName}`
      });
    });

    return results;

  } catch (error) {
    console.error("Global search failed:", error);
    return [];
  }
}
