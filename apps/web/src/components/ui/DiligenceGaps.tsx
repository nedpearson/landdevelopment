"use client";

import React, { useMemo } from "react";
import { AlertCircle, FileWarning, SearchX } from "lucide-react";
import { evaluateDiligenceGaps } from "@/lib/diligenceRules";

import type { Property } from "@land-intelligence/database";

interface Props {
  entityId: string;
  entityType: string;
  propertyData?: Property | null; 
}

export function DiligenceGaps({ entityType, entityId, propertyData }: Props) {
  const gaps = useMemo(() => evaluateDiligenceGaps(entityType, entityId, propertyData), [entityType, entityId, propertyData]);

  if (gaps.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-400">
          <SearchX className="w-5 h-5" />
          <h3 className="font-bold text-white">What Am I Missing?</h3>
        </div>
        <span className="bg-rose-950 text-rose-400 text-xs px-2 py-1 rounded-md font-mono border border-rose-900/50">
          {gaps.length} Gaps Detected
        </span>
      </div>
      
      <div className="p-2 space-y-2">
        {gaps.map((gap) => (
          <div key={gap.id} className="flex gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors group">
            <div className="mt-0.5">
              {gap.severity === "HIGH" ? (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              ) : (
                <FileWarning className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">{gap.field}</h4>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                  {gap.severity}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{gap.description}</p>
              {gap.actionUrl && (
                <a href={gap.actionUrl} className="inline-block mt-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded">
                  Take Action &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
