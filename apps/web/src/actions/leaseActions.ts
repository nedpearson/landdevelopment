'use server';

import { prisma } from '@land-intelligence/database';

export async function getLeases(tractId?: string) {
  const where = tractId ? { tractId } : {};
  return await prisma.leaseRecord.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
}

export async function createLease(data: any) {
  try {
    const lease = await prisma.leaseRecord.create({
      data: {
        tractId: data.tractId,
        leaseNumber: data.leaseNumber,
        lessorName: data.lessorName,
        lesseeName: data.lesseeName,
        effectiveDate: new Date(data.effectiveDate),
        primaryTermYears: Number(data.primaryTermYears),
        expirationDate: new Date(data.expirationDate),
        bonusPerNma: Number(data.bonusPerNma),
        royaltyNumerator: data.royaltyNumerator ? BigInt(data.royaltyNumerator) : undefined,
        royaltyDenominator: data.royaltyDenominator ? BigInt(data.royaltyDenominator) : undefined,
        depthSeveranceTop: data.depthSeveranceTop,
        depthSeveranceBottom: data.depthSeveranceBottom,
      },
    });
    // Serialize BigInt for client
    return { 
      success: true as const, 
      data: {
        ...lease,
        royaltyNumerator: lease.royaltyNumerator ? Number(lease.royaltyNumerator) : undefined,
        royaltyDenominator: lease.royaltyDenominator ? Number(lease.royaltyDenominator) : undefined,
        nriNumerator: lease.nriNumerator ? Number(lease.nriNumerator) : undefined,
        nriDenominator: lease.nriDenominator ? Number(lease.nriDenominator) : undefined,
      } 
    };
  } catch (e: any) {
    console.error('Error creating lease:', e);
    return { success: false as const, error: 'Failed to create lease' };
  }
}

export async function updateLease(id: string, data: any) {
  try {
    const updateData = { ...data };
    if (updateData.effectiveDate) updateData.effectiveDate = new Date(updateData.effectiveDate);
    if (updateData.expirationDate) updateData.expirationDate = new Date(updateData.expirationDate);
    if (updateData.primaryTermYears) updateData.primaryTermYears = Number(updateData.primaryTermYears);
    if (updateData.bonusPerNma) updateData.bonusPerNma = Number(updateData.bonusPerNma);
    
    const lease = await prisma.leaseRecord.update({
      where: { id },
      data: updateData,
    });
    return { 
      success: true as const, 
      data: {
        ...lease,
        royaltyNumerator: lease.royaltyNumerator ? Number(lease.royaltyNumerator) : undefined,
        royaltyDenominator: lease.royaltyDenominator ? Number(lease.royaltyDenominator) : undefined,
        nriNumerator: lease.nriNumerator ? Number(lease.nriNumerator) : undefined,
        nriDenominator: lease.nriDenominator ? Number(lease.nriDenominator) : undefined,
      }
    };
  } catch (e: any) {
    console.error('Error updating lease:', e);
    return { success: false as const, error: 'Failed to update lease' };
  }
}
