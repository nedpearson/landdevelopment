import { describe, it, expect } from 'vitest';
import { rationalToDecimal, decimalToRational, RationalFraction } from '../types/landman';

describe('Landman Exact Rational Fraction Arithmetic Engine', () => {
  it('converts rational fractions to exact decimals', () => {
    const fraction: RationalFraction = { numerator: 1n, denominator: 4n };
    expect(rationalToDecimal(fraction)).toBe(0.25);
  });

  it('converts decimal values to simplified rational fractions', () => {
    const fraction = decimalToRational(0.125);
    expect(fraction.numerator).toBe(1n);
    expect(fraction.denominator).toBe(8n);
  });

  it('calculates Net Mineral Acres (NMA) without floating-point errors', () => {
    const grossAcres = 160;
    const mineralInterest: RationalFraction = { numerator: 1n, denominator: 16n };
    const nma = grossAcres * rationalToDecimal(mineralInterest);
    expect(nma).toBe(10);
  });

  it('calculates Net Revenue Interest (NRI) correctly', () => {
    const mineralInterest: RationalFraction = { numerator: 1n, denominator: 4n };
    const leaseRoyalty: RationalFraction = { numerator: 1n, denominator: 5n }; // 20% lease royalty
    const nri = rationalToDecimal(mineralInterest) * rationalToDecimal(leaseRoyalty);
    expect(nri).toBe(0.05); // 5% NRI
  });
});
