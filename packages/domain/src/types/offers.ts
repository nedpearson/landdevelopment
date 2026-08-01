export type OfferType = 'CASH' | 'SELLER_FINANCING' | 'OPTION' | 'ASSIGNMENT';

export interface AmortizationPeriod {
  periodNumber: number;
  paymentAmount: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface SellerFinancingTerms {
  purchasePrice: number;
  downPaymentAmount: number;
  downPaymentPercentage: number;
  financedAmount: number;
  interestRateAnnual: number;
  amortizationYears: number;
  balloonTermMonths?: number;
  monthlyPayment: number;
  totalInterestPaid: number;
  totalPaidToSeller: number;
}

export interface OfferScenarioDetails {
  type: OfferType;
  offerPrice: number;
  earnestMoney: number;
  dueDiligenceDays: number;
  closingDays: number;
  sellerFinancing?: SellerFinancingTerms;
  projectedResalePrice: number;
  projectedProfit: number;
  projectedROI: number;
  projectedCashOnCash: number;
}

export interface OfferRecord {
  id: string;
  propertyId: string;
  sellerId: string;
  version: number;
  status: 'DRAFT' | 'AWAITING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED' | 'EXPIRED';
  scenarios: Record<string, OfferScenarioDetails>;
  selectedScenarioKey: string;
  approvedById?: string;
  approvedAt?: string;
  sentAt?: string;
  expiresAt?: string;
  documentUrl?: string;
  eSignatureStatus?: 'NOT_SENT' | 'SENT' | 'DELIVERED' | 'SIGNED' | 'DECLINED';
  createdAt: string;
  updatedAt: string;
}

export function calculateSellerFinancing(
  purchasePrice: number,
  downPaymentPercent: number,
  interestRateAnnual: number,
  amortizationYears: number,
  balloonTermMonths?: number
): SellerFinancingTerms {
  const downPaymentAmount = (purchasePrice * downPaymentPercent) / 100;
  const financedAmount = purchasePrice - downPaymentAmount;
  const monthlyRate = interestRateAnnual / 100 / 12;
  const totalPayments = amortizationYears * 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0) {
    monthlyPayment =
      (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);
  } else {
    monthlyPayment = financedAmount / totalPayments;
  }

  let remaining = financedAmount;
  let totalInterestPaid = 0;
  const actualMonths = balloonTermMonths && balloonTermMonths < totalPayments ? balloonTermMonths : totalPayments;

  for (let i = 1; i <= actualMonths; i++) {
    const interest = remaining * monthlyRate;
    const principal = monthlyPayment - interest;
    totalInterestPaid += interest;
    remaining -= principal;
  }

  return {
    purchasePrice,
    downPaymentAmount,
    downPaymentPercentage: downPaymentPercent,
    financedAmount,
    interestRateAnnual,
    amortizationYears,
    balloonTermMonths,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalInterestPaid: Math.round(totalInterestPaid * 100) / 100,
    totalPaidToSeller: Math.round((downPaymentAmount + monthlyPayment * actualMonths + (balloonTermMonths ? Math.max(0, remaining) : 0)) * 100) / 100,
  };
}
