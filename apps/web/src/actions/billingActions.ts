'use server';

import { prisma } from '@land-intelligence/database';

export async function getBillingEntries(projectId?: string) {
  const where = projectId ? { projectId } : {};
  return await prisma.landmanBillingEntry.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function createBillingEntry(data: any) {
  try {
    const entry = await prisma.landmanBillingEntry.create({
      data: {
        projectId: data.projectId,
        landmanName: data.landmanName,
        date: new Date(data.date),
        hoursWorked: Number(data.hoursWorked || 0),
        hourlyRateUsd: Number(data.hourlyRateUsd || 0),
        mileageMiles: Number(data.mileageMiles || 0),
        mileageRateUsd: Number(data.mileageRateUsd || 0),
        perDiemUsd: Number(data.perDiemUsd || 0),
        outOfPocketExpensesUsd: Number(data.outOfPocketExpensesUsd || 0),
        expenseCategory: data.expenseCategory || 'General',
        totalBilledUsd: (Number(data.hoursWorked || 0) * Number(data.hourlyRateUsd || 0)) + 
                        (Number(data.mileageMiles || 0) * Number(data.mileageRateUsd || 0)) + 
                        Number(data.perDiemUsd || 0) + 
                        Number(data.outOfPocketExpensesUsd || 0)
      },
    });
    return { success: true as const, data: entry };
  } catch (e: any) {
    console.error('Error creating billing entry:', e);
    return { success: false as const, error: 'Failed to create billing entry' };
  }
}

export async function getBillingTotals(projectId: string) {
  const entries = await getBillingEntries(projectId);
  let totalHours = 0;
  let totalBillable = 0;
  let totalMileage = 0;
  let totalPerDiem = 0;
  
  entries.forEach(e => {
    totalHours += e.hoursWorked;
    totalBillable += e.totalBilledUsd;
    totalMileage += e.mileageMiles;
    totalPerDiem += e.perDiemUsd;
  });
  
  return { totalHours, totalBillable, totalMileage, totalPerDiem };
}
