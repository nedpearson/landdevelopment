'use server';

import { prisma } from '@land-intelligence/database';

export type SearchResult = {
  id: string;
  type: 'PROPERTY' | 'OWNER' | 'OFFER' | 'SELLER' | 'AI_FILTER';
  title: string;
  subtitle: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    const q = query.toLowerCase();
    
    // Phase 12: Natural Language Universal Search (Simulated NLP)
    let isNaturalLanguage = false;
    const propertyWhere: any = { OR: [] };
    
    // Simple NLP heuristic rules
    if (q.includes("large") || q.includes("big")) {
      isNaturalLanguage = true;
      propertyWhere.acreage = { gte: 10 }; // 10+ acres
    }
    if (q.includes("texas") || q.includes(" tx")) {
      isNaturalLanguage = true;
      propertyWhere.state = "TX";
    }
    if (q.includes("florida") || q.includes(" fl")) {
      isNaturalLanguage = true;
      propertyWhere.state = "FL";
    }
    if (q.includes("multifamily") || q.includes("multi-family")) {
      isNaturalLanguage = true;
      propertyWhere.propertyClass = "RESIDENTIAL_MULTI_FAMILY";
    }
    if (q.includes("commercial")) {
      isNaturalLanguage = true;
      propertyWhere.propertyClass = { in: ["COMMERCIAL_RETAIL", "COMMERCIAL_OFFICE"] };
    }
    if (q.includes("vacant") || q.includes("land")) {
      isNaturalLanguage = true;
      propertyWhere.propertyClass = "VACANT_LAND";
    }

    // If no NLP keywords triggered, use standard literal search
    if (!isNaturalLanguage) {
      propertyWhere.OR = [
        { apn: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
        { ownerName: { contains: query, mode: 'insensitive' } }
      ];
    } else {
      // If NLP triggered, remove the empty OR array so Prisma doesn't fail
      delete propertyWhere.OR;
    }

    // Run all queries in parallel for maximum performance
    const [properties, sellers] = await Promise.all([
      // 1. Search Properties (NLP or Literal)
      prisma.property.findMany({
        where: propertyWhere,
        take: 10
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
        take: 5
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

    return results;

  } catch (error) {
    console.error("Global search failed:", error);
    return [];
  }
}
