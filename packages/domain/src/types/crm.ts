export type CommunicationChannel = 'EMAIL' | 'SMS' | 'PHONE' | 'DIRECT_MAIL';

export interface ConsentRecord {
  contactPoint: string; // phone or email
  channel: CommunicationChannel;
  optedIn: boolean;
  dncStatus: boolean;
  consentSource: string;
  timestamp: string;
}

export interface SellerRecord {
  id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  mailingAddress?: string;
  motivationLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  askingPrice?: number;
  reasonForSelling?: string;
  desiredTiming?: string;
  notes: string[];
  consent: ConsentRecord[];
  associatedPropertyIds: string[];
  campaignId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationLog {
  id: string;
  sellerId: string;
  propertyId?: string;
  channel: CommunicationChannel;
  direction: 'INBOUND' | 'OUTBOUND';
  content: string;
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'FAILED' | 'RECEIVED';
  providerMessageId?: string;
  sentByUserId?: string;
  timestamp: string;
}
