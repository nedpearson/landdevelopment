export interface BuyerCriteria {
  states: string[];
  counties: string[];
  minAcreage: number;
  maxAcreage: number;
  maxPrice: number;
  preferredUses: string[];
  financingTypePreference: 'CASH' | 'OWNER_FINANCING' | 'ANY';
  requiredUtilities?: string[];
  requiredAccessType?: string;
}

export interface BuyerProfile {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  phone?: string;
  verifiedBuyer: boolean;
  proofOfFundsVerified: boolean;
  criteria: BuyerCriteria;
  purchasedPropertiesCount: number;
  unsubscribed: boolean;
  createdAt: string;
}

export interface BuyerMatchResult {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  propertyId: string;
  matchScore: number; // 0 to 100
  matchedFactors: string[];
  mismatchedFactors: string[];
  confidence: number;
  recommendedAction: 'IMMEDIATE_OUTREACH' | 'SUGGEST_LISTING' | 'LOW_MATCH';
}

export function matchBuyerToProperty(buyer: BuyerProfile, property: {
  id: string;
  state: string;
  county: string;
  acreage: number;
  askingPrice?: number;
  suggestedOfferPrice?: number;
  zoningCode?: string;
}): BuyerMatchResult {
  const matched: string[] = [];
  const mismatched: string[] = [];
  let score = 50;

  // Location check
  if (buyer.criteria.states.length === 0 || buyer.criteria.states.includes(property.state)) {
    matched.push(`State matches (${property.state})`);
    score += 15;
  } else {
    mismatched.push(`State mismatch (${property.state})`);
    score -= 25;
  }

  if (buyer.criteria.counties.length === 0 || buyer.criteria.counties.includes(property.county)) {
    matched.push(`County matches (${property.county})`);
    score += 15;
  } else {
    mismatched.push(`County mismatch (${property.county})`);
    score -= 15;
  }

  // Acreage check
  if (property.acreage >= buyer.criteria.minAcreage && property.acreage <= buyer.criteria.maxAcreage) {
    matched.push(`Acreage (${property.acreage} ac) within range [${buyer.criteria.minAcreage}-${buyer.criteria.maxAcreage}]`);
    score += 15;
  } else {
    mismatched.push(`Acreage (${property.acreage} ac) outside range`);
    score -= 10;
  }

  // Price check
  const price = property.askingPrice || property.suggestedOfferPrice || 0;
  if (price > 0 && price <= buyer.criteria.maxPrice) {
    matched.push(`Price ($${price.toLocaleString()}) below max ($${buyer.criteria.maxPrice.toLocaleString()})`);
    score += 10;
  } else if (price > buyer.criteria.maxPrice) {
    mismatched.push(`Price ($${price.toLocaleString()}) exceeds budget`);
    score -= 15;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    buyerId: buyer.id,
    buyerName: buyer.name,
    buyerEmail: buyer.email,
    propertyId: property.id,
    matchScore: finalScore,
    matchedFactors: matched,
    mismatchedFactors: mismatched,
    confidence: buyer.verifiedBuyer ? 0.95 : 0.8,
    recommendedAction: finalScore >= 75 ? 'IMMEDIATE_OUTREACH' : finalScore >= 50 ? 'SUGGEST_LISTING' : 'LOW_MATCH',
  };
}
