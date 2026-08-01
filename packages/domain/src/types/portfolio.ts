import { SellerFinancingTerms } from './offers';

export interface OwnerFinanceNote {
  id: string;
  propertyId: string;
  buyerName: string;
  buyerEmail: string;
  terms: SellerFinancingTerms;
  startDate: string;
  nextPaymentDueDate: string;
  currentBalance: number;
  status: 'ACTIVE' | 'PAID_IN_FULL' | 'DELINQUENT' | 'DEFAULTED';
  paymentsReceivedCount: number;
  totalInterestCollected: number;
  totalPrincipalCollected: number;
}

export interface PortfolioHolding {
  id: string;
  propertyId: string;
  apn: string;
  address: string;
  county: string;
  state: string;
  acreage: number;
  acquisitionDate: string;
  purchasePrice: number;
  closingCosts: number;
  holdingCosts: number;
  totalCostBasis: number;
  estimatedCurrentValue: number;
  unrealizedProfit: number;
  holdingDays: number;
  note?: OwnerFinanceNote;
  status: 'OWNED' | 'LISTED' | 'UNDER_CONTRACT' | 'SOLD';
}

export interface PortfolioSummary {
  totalPropertiesOwned: number;
  totalAcreageOwned: number;
  totalCapitalInvested: number;
  totalEstimatedPortfolioValue: number;
  totalUnrealizedProfit: number;
  totalRealizedProfitYTD: number;
  activeNotesCount: number;
  monthlyNoteCashFlow: number;
  averageHoldingPeriodDays: number;
  cashOnCashReturnPercentage: number;
  irrPercentage: number;
}
