'use server';

import { prisma } from '@land-intelligence/database';

export async function logCommunication(sellerId: string, type: 'EMAIL' | 'SMS' | 'CALL', content: string) {
  try {
    // In a real production scenario, this is where we'd invoke the Twilio or Resend SDKs
    // await twilioClient.messages.create({ body: content, to: sellerPhone, from: ourPhone });
    
    console.log(`[SIMULATED ${type}] To Seller ${sellerId}: ${content}`);

    // Update the seller's last contact date
    await prisma.seller.update({
      where: { id: sellerId },
      data: {
        updatedAt: new Date()
      }
    });

    return { success: true, message: `Successfully sent ${type} to seller.` };
  } catch (error) {
    console.error('Error logging communication:', error);
    return { success: false, error: 'Failed to log communication' };
  }
}
