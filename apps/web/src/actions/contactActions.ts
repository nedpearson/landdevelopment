'use server';
import { prisma } from '@land-intelligence/database';
const ORG_ID = 'org_default';

// Contacts = combination of Sellers and Buyers
export async function getAllContacts() {
  const [sellers, buyers] = await Promise.all([
    prisma.seller.findMany({ where: { organizationId: ORG_ID } }),
    prisma.buyer.findMany({ where: { organizationId: ORG_ID } })
  ]);
  return [
    ...sellers.map(s => ({ ...s, role: 'Seller' })),
    ...buyers.map(b => ({ ...b, role: 'Buyer' }))
  ];
}

export async function createSeller(data: any) {
  try {
    const seller = await prisma.seller.create({
      data: { ...data, organizationId: ORG_ID }
    });
    return { success: true, data: seller };
  } catch(e) {
    return { success: false, error: 'Failed to create seller' };
  }
}

export async function createBuyer(data: any) {
  try {
    const buyer = await prisma.buyer.create({
      data: { ...data, organizationId: ORG_ID }
    });
    return { success: true, data: buyer };
  } catch(e) {
    return { success: false, error: 'Failed to create buyer' };
  }
}
