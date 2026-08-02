import React from 'react';
import { cn } from '../utils/cn';

export type EstateCategory =
  | 'SURFACE_ESTATE'
  | 'MINERAL_ESTATE'
  | 'EXECUTIVE_RIGHTS'
  | 'ROYALTY_INTEREST'
  | 'NPRI'
  | 'ORRI'
  | 'WORKING_INTEREST'
  | 'LEASEHOLD'
  | 'PORE_SPACE'
  | 'SOLAR_RIGHTS'
  | 'WIND_RIGHTS'
  | 'RIGHT_OF_WAY';

export interface EstateBadgeProps {
  category: EstateCategory;
  ownerName?: string;
  name?: string;
  className?: string;
}

export const EstateBadge: React.FC<EstateBadgeProps> = ({ category, ownerName, name, className }) => {
  const displayOwner = ownerName || name;
  const styles: Record<EstateCategory, { label: string; style: string }> = {
    SURFACE_ESTATE: { label: 'Surface Estate', style: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
    MINERAL_ESTATE: { label: 'Mineral Estate', style: 'bg-amber-950/80 text-amber-300 border-amber-800' },
    EXECUTIVE_RIGHTS: { label: 'Executive Rights', style: 'bg-purple-950/80 text-purple-300 border-purple-800' },
    ROYALTY_INTEREST: { label: 'Royalty Interest', style: 'bg-sky-950/80 text-sky-300 border-sky-800' },
    NPRI: { label: 'NPRI (Non-Part Royalty)', style: 'bg-blue-950/80 text-blue-300 border-blue-800' },
    ORRI: { label: 'ORRI (Overriding Royalty)', style: 'bg-teal-950/80 text-teal-300 border-teal-800' },
    WORKING_INTEREST: { label: 'Working Interest (WI)', style: 'bg-indigo-950/80 text-indigo-300 border-indigo-800' },
    LEASEHOLD: { label: 'Leasehold Estate', style: 'bg-rose-950/80 text-rose-300 border-rose-800' },
    PORE_SPACE: { label: 'Pore Space (CCS)', style: 'bg-slate-900 text-slate-300 border-slate-700' },
    SOLAR_RIGHTS: { label: 'Solar Energy Rights', style: 'bg-amber-900/60 text-amber-200 border-amber-700' },
    WIND_RIGHTS: { label: 'Wind Energy Rights', style: 'bg-cyan-950/80 text-cyan-300 border-cyan-800' },
    RIGHT_OF_WAY: { label: 'Right-of-Way / Easement', style: 'bg-emerald-900/60 text-emerald-200 border-emerald-700' },
  };

  const item = styles[category] || { label: category, style: 'bg-slate-800 text-slate-200 border-slate-700' };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border transition-colors gap-1',
        item.style,
        className
      )}
    >
      <span>{item.label}</span>
      {displayOwner && <span className="opacity-80 font-normal">({displayOwner})</span>}
    </span>
  );
};
