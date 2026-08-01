export interface PropertyComp {
  id: string;
  apn: string;
  address: string;
  county: string;
  state: string;
  acreage: number;
  salePrice: number;
  saleDate: string; // ISO String
  pricePerAcre: number;
  distanceMiles: number;
  roadAccess: string;
  utilities: string;
  wetlandsPercentage: number;
  floodPercentage: number;
  
  // Quality & Flagging
  isArmLengthTransaction: boolean;
  isDuplicate: boolean;
  isFamilyTransfer: boolean;
  isQuitclaim: boolean;
  isOutlier: boolean;
  exclusionReason?: string;
  includedInValuation: boolean;
  
  // Adjustments
  adjustments: {
    acreageAdjustment: number;
    timeAdjustment: number;
    accessAdjustment: number;
    utilityAdjustment: number;
    environmentalAdjustment: number;
    totalAdjustment: number;
  };
  adjustedPricePerAcre: number;
  adjustedSalePrice: number;
}

export interface ValuationScenario {
  name: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  estimatedResaleValue: number;
  suggestedMaxAllowableOffer: number;
  estimatedLiquidationValue: number;
  suggestedOwnerFinanceResalePrice: number;
  estimatedDaysOnMarket: number;
  targetProfitMargin: number; // e.g. 0.35 = 35%
}

export interface ValuationResult {
  propertyId: string;
  lowEstimate: number;
  baseEstimate: number;
  highEstimate: number;
  confidenceScore: number; // 0 to 100
  selectedCompsCount: number;
  averageAdjustedPricePerAcre: number;
  scenarios: Record<string, ValuationScenario>;
  missingDataWarnings: string[];
  contradictions: string[];
  humanVerificationRequired: boolean;
  calculatedAt: string;
}
