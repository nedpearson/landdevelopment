import { describe, it, expect } from 'vitest';
import { calculateSellerFinancing, matchBuyerToProperty, isValidStageTransition } from '../index';

describe('Financial & Domain Logic Unit Tests', () => {
  it('calculates seller financing terms correctly', () => {
    const terms = calculateSellerFinancing(14500, 10, 9.9, 5);
    expect(terms.purchasePrice).toBe(14500);
    expect(terms.downPaymentAmount).toBe(1450);
    expect(terms.financedAmount).toBe(13050);
    expect(terms.monthlyPayment).toBeGreaterThan(270);
    expect(terms.monthlyPayment).toBeLessThan(285);
    expect(terms.totalPaidToSeller).toBeGreaterThan(17000);
  });

  it('evaluates buyer matching scores explainably', () => {
    const buyer = {
      id: 'b-1',
      organizationId: 'org-demo',
      name: 'Mountain West Land',
      email: 'mwest@gmail.com',
      verifiedBuyer: true,
      proofOfFundsVerified: true,
      unsubscribed: false,
      purchasedPropertiesCount: 3,
      criteria: {
        states: ['CO'],
        counties: ['Costilla'],
        minAcreage: 2,
        maxAcreage: 10,
        maxPrice: 30000,
        preferredUses: ['Recreational'],
        financingTypePreference: 'ANY' as const,
      },
      createdAt: new Date().toISOString(),
    };

    const property = {
      id: 'prop-1',
      state: 'CO',
      county: 'Costilla',
      acreage: 5.2,
      askingPrice: 14500,
      suggestedOfferPrice: 10800,
    };

    const result = matchBuyerToProperty(buyer, property);
    expect(result.matchScore).toBeGreaterThanOrEqual(90);
    expect(result.recommendedAction).toBe('IMMEDIATE_OUTREACH');
    expect(result.matchedFactors.length).toBeGreaterThanOrEqual(3);
  });

  it('enforces canonical lifecycle state machine transition rules', () => {
    expect(isValidStageTransition('PROSPECT', 'QUALIFIED')).toBe(true);
    expect(isValidStageTransition('QUALIFIED', 'UNDERWRITING')).toBe(true);
    expect(isValidStageTransition('UNDERWRITING', 'ARCHIVED')).toBe(true);
  });
});
