'use server';

import { prisma } from '@land-intelligence/database';

export async function getCommunicationLogs() {
  return await prisma.communicationLog.findMany({
    orderBy: { timestamp: 'desc' },
  });
}

export async function createCommunicationLog(data: any) {
  try {
    const log = await prisma.communicationLog.create({
      data: {
        sellerId: data.sellerId, // Need a valid seller ID here usually
        propertyId: data.propertyId,
        channel: data.channel,
        direction: data.direction,
        content: data.content,
        status: data.status || 'SENT',
      },
    });
    return { success: true as const, data: log };
  } catch (e: any) {
    console.error('Error creating communication log:', e);
    return { success: false as const, error: 'Failed to create log' };
  }
}
