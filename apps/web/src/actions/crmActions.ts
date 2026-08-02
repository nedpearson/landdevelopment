"use server";

import { prisma } from "@land-intelligence/database";

export async function getPortfolioHoldings() {
  try {
    const holdings = await prisma.portfolioHolding.findMany({
      include: {
        property: true
      },
      orderBy: { acquisitionDate: 'desc' }
    });
    return holdings;
  } catch (error) {
    console.error("Error fetching portfolio holdings:", error);
    return [];
  }
}

export async function getBuyers() {
  try {
    const buyers = await prisma.buyer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return buyers;
  } catch (error) {
    console.error("Error fetching buyers:", error);
    return [];
  }
}

export async function getSellers() {
  try {
    const sellers = await prisma.seller.findMany({
      include: {
        properties: {
          include: {
            property: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return sellers;
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return [];
  }
}
