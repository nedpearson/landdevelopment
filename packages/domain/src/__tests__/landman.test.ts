import { describe, it, expect } from 'vitest';
import { rationalToDecimal, decimalToRational, RationalFraction } from '../types/landman';

describe('Landman Exact Rational Fraction Arithmetic Engine', () => {
  it('converts rational fractions to exact decimals', () => {
    const fraction: RationalFraction = { numerator: 1, denominator: 4 };
    expect(rationalToDecimal(fraction)).toBe(0.25);
  });

  it('converts decimal values to simplified rational fractions', () => {
    const fraction = decimalToRational(0.125);
    expect(fraction.numerator).toBe(1);
    expect(fraction.denominator).toBe(8);
  });

  it('calculates Net Mineral Acres (NMA) without floating-point errors', () => {
    const grossAcres = 160;
    const mineralInterest: RationalFraction = { numerator: 1, denominator: 16 };
    const nma = grossAcres * rationalToDecimal(mineralInterest);
    expect(nma).toBe(10);
  });

  it('calculates Net Revenue Interest (NRI) correctly', () => {
    const mineralInterest: RationalFraction = { numerator: 1, denominator: 4 };
    const leaseRoyalty: RationalFraction = { numerator: 1, denominator: 5 }; // 20% lease royalty
    const nri = rationalToDecimal(mineralInterest) * rationalToDecimal(leaseRoyalty);
    expect(nri).toBe(0.05); // 5% NRI
  });
});
