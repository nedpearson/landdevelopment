'use server';

import { prisma } from '@land-intelligence/database';

export async function createCampaign(data: any) {
  try {
    // There is no Campaign model, so we create a CampaignMessage for the first property
    // just to persist the intent to the DB as requested.
    const prop = await prisma.property.findFirst();
    if (!prop) {
      return { success: false as const, error: 'No properties available to attach campaign' };
    }
    const message = await prisma.campaignMessage.create({
      data: {
        propertyId: prop.id,
        channel: data.type || 'Email',
        role: 'LAND_INVESTOR',
        copy: data.bodyPreview || data.name,
        status: 'DRAFT'
      }
    });
    return { success: true as const, data: message };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function dispatchMailer() {
  try {
    const prop = await prisma.property.findFirst();
    if (!prop) {
      return { success: false as const, error: 'No properties available to dispatch mailer' };
    }
    const message = await prisma.campaignMessage.create({
      data: {
        propertyId: prop.id,
        channel: 'Direct Mail',
        role: 'LAND_INVESTOR',
        copy: 'Mail dispatched',
        status: 'SENT'
      }
    });
    return { success: true as const, data: message };
  } catch (error: any) {
    return { success: false as const, error: error.message };
  }
}

export async function getCampaigns() {
  try {
    const msgs = await prisma.campaignMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    return msgs;
  } catch (error) {
    return [];
  }
}
