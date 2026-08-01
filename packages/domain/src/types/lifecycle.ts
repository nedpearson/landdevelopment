export type PropertyLifecycleStage =
  | 'MARKET_DISCOVERY'
  | 'PARCEL_DISCOVERY'
  | 'PROSPECT'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'UNDERWRITING'
  | 'DUE_DILIGENCE'
  | 'OFFER_DRAFTED'
  | 'OFFER_SENT'
  | 'NEGOTIATION'
  | 'CONTRACTED'
  | 'CLOSING'
  | 'OWNED'
  | 'LISTED'
  | 'UNDER_CONTRACT_DISPOSITION'
  | 'SOLD'
  | 'ARCHIVED';

export const LIFECYCLE_STAGES_ORDERED: PropertyLifecycleStage[] = [
  'MARKET_DISCOVERY',
  'PARCEL_DISCOVERY',
  'PROSPECT',
  'CONTACTED',
  'QUALIFIED',
  'UNDERWRITING',
  'DUE_DILIGENCE',
  'OFFER_DRAFTED',
  'OFFER_SENT',
  'NEGOTIATION',
  'CONTRACTED',
  'CLOSING',
  'OWNED',
  'LISTED',
  'UNDER_CONTRACT_DISPOSITION',
  'SOLD',
  'ARCHIVED',
];

export const STAGE_LABELS: Record<PropertyLifecycleStage, string> = {
  MARKET_DISCOVERY: 'Market Discovery',
  PARCEL_DISCOVERY: 'Parcel Discovery',
  PROSPECT: 'Prospect',
  CONTACTED: 'Contacted',
  QUALIFIED: 'Qualified',
  UNDERWRITING: 'Underwriting',
  DUE_DILIGENCE: 'Due Diligence',
  OFFER_DRAFTED: 'Offer Drafted',
  OFFER_SENT: 'Offer Sent',
  NEGOTIATION: 'Negotiation',
  CONTRACTED: 'Contracted',
  CLOSING: 'Closing',
  OWNED: 'Owned',
  LISTED: 'Listed',
  UNDER_CONTRACT_DISPOSITION: 'Under Contract (Disposition)',
  SOLD: 'Sold',
  ARCHIVED: 'Archived',
};

export function isValidStageTransition(current: PropertyLifecycleStage, next: PropertyLifecycleStage): boolean {
  if (next === 'ARCHIVED') return true;
  const currentIndex = LIFECYCLE_STAGES_ORDERED.indexOf(current);
  const nextIndex = LIFECYCLE_STAGES_ORDERED.indexOf(next);
  if (currentIndex === -1 || nextIndex === -1) return false;
  // Allow moving forward or backwards one step, or jumping back to Prospect/Underwriting
  return nextIndex >= currentIndex || next === 'PROSPECT' || next === 'UNDERWRITING';
}
