/**
 * rationalMath.ts
 * Core engine for resolving Fractional Ownership using pure BigInt rational arithmetic
 * to prevent floating-point drift when summing Granting Clauses and Reservations.
 */

export interface RationalFraction {
  numerator: bigint;
  denominator: bigint;
}

/**
 * Normalizes a fraction by simplifying it based on the greatest common divisor (GCD).
 */
export function simplify(fraction: RationalFraction): RationalFraction {
  if (fraction.numerator === 0n) {
    return { numerator: 0n, denominator: 1n };
  }
  const divisor = gcd(abs(fraction.numerator), abs(fraction.denominator));
  return {
    numerator: fraction.numerator / divisor,
    denominator: fraction.denominator / divisor,
  };
}

/**
 * Adds two rational fractions.
 */
export function addFractions(a: RationalFraction, b: RationalFraction): RationalFraction {
  const numerator = (a.numerator * b.denominator) + (b.numerator * a.denominator);
  const denominator = a.denominator * b.denominator;
  return simplify({ numerator, denominator });
}

/**
 * Subtracts rational fraction b from a (a - b).
 */
export function subtractFractions(a: RationalFraction, b: RationalFraction): RationalFraction {
  const numerator = (a.numerator * b.denominator) - (b.numerator * a.denominator);
  const denominator = a.denominator * b.denominator;
  return simplify({ numerator, denominator });
}

/**
 * Multiplies two rational fractions.
 */
export function multiplyFractions(a: RationalFraction, b: RationalFraction): RationalFraction {
  const numerator = a.numerator * b.numerator;
  const denominator = a.denominator * b.denominator;
  return simplify({ numerator, denominator });
}

/**
 * Converts a RationalFraction to a Javascript decimal number.
 * Note: Only for display purposes. Financial/Title calculations should remain as RationalFractions.
 */
export function rationalToDecimal(fraction: RationalFraction): number {
  if (fraction.denominator === 0n) return 0;
  return Number(fraction.numerator) / Number(fraction.denominator);
}

export function decimalToRational(decimal: number, precision: number = 1000000): RationalFraction {
  const num = BigInt(Math.round(decimal * precision));
  const den = BigInt(precision);
  return simplify({ numerator: num, denominator: den });
}

// --- Helpers ---

function gcd(a: bigint, b: bigint): bigint {
  return b === 0n ? a : gcd(b, a % b);
}

function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}
