import React from 'react';
import { cn } from '../utils/cn';
import { Badge } from './Badge';

export interface EvidenceBoxProps {
  source: string;
  retrievedAt: string;
  confidenceScore: number; // 0 to 1 or 0 to 100
  assumptions?: string[];
  missingData?: string[];
  contradictions?: string[];
  verificationState?: 'UNVERIFIED' | 'SELF_VERIFIED' | 'ATTORNEY_VERIFIED' | 'PLANNER_VERIFIED' | 'REJECTED';
  children?: React.ReactNode;
  className?: string;
}

export const EvidenceBox: React.FC<EvidenceBoxProps> = ({
  source,
  retrievedAt,
  confidenceScore,
  assumptions = [],
  missingData = [],
  contradictions = [],
  verificationState = 'UNVERIFIED',
  children,
  className,
}) => {
  const normConfidence = confidenceScore <= 1 ? Math.round(confidenceScore * 100) : Math.round(confidenceScore);
  const confidenceVariant = normConfidence >= 85 ? 'success' : normConfidence >= 65 ? 'warning' : 'danger';

  return (
    <div className={cn('rounded-lg border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Evidence Source:</span>
          <span className="text-slate-200 font-semibold">{source}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={confidenceVariant}>
            {normConfidence}% Confidence
          </Badge>
          <Badge variant={verificationState === 'UNVERIFIED' ? 'warning' : 'success'}>
            {verificationState.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {children && <div className="text-slate-300">{children}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
        <div>
          <span className="text-slate-500">Retrieved:</span> {new Date(retrievedAt).toLocaleString()}
        </div>
        {assumptions.length > 0 && (
          <div>
            <span className="text-slate-500">Assumptions:</span> {assumptions.join('; ')}
          </div>
        )}
      </div>

      {missingData.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-900/50 rounded p-2 text-amber-300 text-[11px]">
          <span className="font-semibold">⚠️ Missing Verification Data:</span> {missingData.join(', ')}
        </div>
      )}

      {contradictions.length > 0 && (
        <div className="bg-rose-950/40 border border-rose-900/50 rounded p-2 text-rose-300 text-[11px]">
          <span className="font-semibold">❌ Contradictions Exposed:</span> {contradictions.join(', ')}
        </div>
      )}
    </div>
  );
};
