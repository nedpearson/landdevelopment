'use server';
import { prisma } from '@land-intelligence/database';

export async function getComps(propertyId?: string) {
  return prisma.comp.findMany({ where: propertyId ? { propertyId } : {}, orderBy: { saleDate: 'desc' } });
}

export async function createComp(data: {
  apn: string; county: string; state: string; acreage: number;
  salePrice: number; saleDate: Date; pricePerAcre: number; distanceMiles: number;
  propertyId?: string; address?: string;
}) {
  try {
    const comp = await prisma.comp.create({ data });
    return { success: true as const, data: comp };
  } catch(e) {
    return { success: false as const, error: 'Failed to create comp' };
  }
}
