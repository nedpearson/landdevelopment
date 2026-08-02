'use server';

import { prisma } from '@land-intelligence/database';

export type SearchResult = {
  id: string;
  type: 'PROPERTY' | 'OWNER' | 'OFFER' | 'SELLER';
  title: string;
  subtitle: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  try {
    // Run all queries in parallel for maximum performance
    const [properties, sellers] = await Promise.all([
      // 1. Search Properties (APN, Address, Owner Name)
      prisma.property.findMany({
        where: {
          OR: [
            { apn: { contains: query, mode: 'insensitive' } },
            { address: { contains: query, mode: 'insensitive' } },
            { ownerName: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: 5
      }),
      
      // 2. Search Sellers (Name, Email, Phone)
      prisma.seller.findMany({
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

    properties.forEach(p => {
      results.push({
        id: p.id,
        type: 'PROPERTY',
        title: p.apn,
        subtitle: p.address || p.ownerName || 'Unknown Address'
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
