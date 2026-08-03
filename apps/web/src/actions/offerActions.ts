'use server';

import { prisma } from '@land-intelligence/database';

export async function getOffers() {
  try {
    const offers = await prisma.offer.findMany({
      include: {
        property: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    return offers;
  } catch (error) {
    console.error('Failed to get offers:', error);
    return [];
  }
}

export async function createOffer(data: any) {
  try {
    const offer = await prisma.offer.create({
      data,
    });
    return { success: true as const, data: offer };
  } catch (error: any) {
    console.error('Failed to create offer:', error);
    return { success: false as const, error: error.message || 'Failed to create offer' };
  }
}

export async function updateOfferStatus(id: string, status: any) {
  try {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status },
    });
    return { success: true as const, data: offer };
  } catch (error: any) {
    console.error('Failed to update offer status:', error);
    return { success: false as const, error: error.message || 'Failed to update offer status' };
  }
}

export async function getDropdownData() {
  try {
    const properties = await prisma.property.findMany({ take: 20, select: { id: true, apn: true, county: true } });
    const sellers = await prisma.seller.findMany({ take: 20, select: { id: true, name: true } });
    return { properties, sellers };
  } catch (error) {
    return { properties: [], sellers: [] };
  }
}
