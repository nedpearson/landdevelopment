export type UnderwritingMode = 'QUICK_SCREEN' | 'VERIFIED_UNDERWRITING';

export interface DealScoreFactor {
  category:
    | 'PRICING'
    | 'SELLER_MOTIVATION'
    | 'DEMAND_LIQUIDITY'
    | 'ACCESS'
    | 'ENVIRONMENTAL_RISK'
    | 'TITLE_RISK'
    | 'UTILITY_FEASIBILITY'
    | 'ZONING_BUILDABILITY'
    | 'DATA_QUALITY';
  score: number; // 0 to 100
  weight: number; // e.g. 0.15
  confidence: number; // 0 to 1
  evidence: string;
  reason: string;
  disqualifying: boolean;
}

export interface DealScoreResult {
  overallScore: number; // 0 to 100
  mode: UnderwritingMode;
  factors: DealScoreFactor[];
  disqualifyingFlags: string[];
  recommendedAction: 'REJECT' | 'WATCH' | 'INVESTIGATE' | 'OFFER' | 'REQUIRE_APPROVAL';
  dataFreshnessTimestamp: string;
}

export interface UnderwritingApproval {
  propertyId: string;
  underwriterId: string;
  approvedAt: string;
  mode: UnderwritingMode;
  accessVerified: boolean;
  zoningVerified: boolean;
  titleVerified: boolean;
  environmentalVerified: boolean;
  valuationVerified: boolean;
  notes: string;
}
