import React from 'react';
import { cn } from '../utils/cn';

import { RationalFraction, rationalToDecimal } from '@land-intelligence/domain';

export interface FractionBadgeProps {
  fraction: RationalFraction;
  label?: string;
  className?: string;
}

export const FractionBadge: React.FC<FractionBadgeProps> = ({ fraction, label, className }) => {
  const decimal = rationalToDecimal(fraction);
  const percentage = (decimal * 100).toFixed(4);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm',
        className
      )}
    >
      <span className="font-bold text-white">
        {fraction.numerator.toString()}/{fraction.denominator.toString()}
      </span>
      <span className="text-[10px] text-emerald-400">({percentage}%)</span>
      {label && <span className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>}
    </span>
  );
};
