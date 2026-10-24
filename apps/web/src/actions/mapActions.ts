'use server';

import { prisma } from '@land-intelligence/database';

export async function getMapProperties() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        apn: true,
        county: true,
        state: true,
        address: true,
        zipCode: true,
        acreage: true,
        usableAcreage: true,
        ownerName: true,
        propertyClass: true,
        askingPrice: true,
        estimatedMarketValue: true,
        suggestedOfferPrice: true,
        dealScore: true,
        lifecycleStage: true,
        centroidLat: true,
        centroidLng: true,
        rawGeometry: true,
        zoningAssessment: true,
        environmentalAssessment: true,
        accessAssessment: true,
        provenance: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    // Provide default fallback centroid coordinates by county if ever unassigned
    const countyCoordinates: Record<string, { lat: number; lng: number }> = {
      'Costilla': { lat: 37.2764, lng: -105.3886 },
      'Reeves': { lat: 31.4211, lng: -103.4932 },
      'Midland': { lat: 31.9974, lng: -102.0779 },
      'Mohave': { lat: 35.2215, lng: -114.1554 },
      'Valencia': { lat: 34.8211, lng: -106.9122 },
      'Brevard': { lat: 28.1432, lng: -80.6891 },
      'Elko': { lat: 40.8921, lng: -115.6543 },
    };

    const enriched = properties.map(p => {
      const fallback = countyCoordinates[p.county] || { lat: 31.5, lng: -100.0 };
      return {
        ...p,
        centroidLat: p.centroidLat ?? fallback.lat,
        centroidLng: p.centroidLng ?? fallback.lng,
      };
    });

    return { success: true, data: enriched };
  } catch (error: any) {
    console.error('Error fetching map properties:', error);
    return { success: false, error: error.message };
  }
}
