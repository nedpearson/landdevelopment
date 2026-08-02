"use client";

import React, { useMemo } from "react";
import { evaluateNextBestAction } from "@/lib/nextBestAction";
import { ArrowRight, Lightbulb, Zap } from "lucide-react";
import type { Property } from "@land-intelligence/database";

interface Props {
  entityType: string;
  entityId: string;
  propertyData?: Property | null;
}

export function NextBestAction({ entityType, entityId, propertyData }: Props) {
  const action = useMemo(() => evaluateNextBestAction(entityType, entityId, propertyData), [entityType, entityId, propertyData]);

  if (!action) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <Zap className="w-32 h-32 text-indigo-400 blur-2xl transform rotate-12" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-widest text-xs mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Next Best Action
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{action.title}</h3>
        <p className="text-sm text-indigo-200/80 mb-6 max-w-lg leading-relaxed">
          {action.description}
        </p>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/50 group">
          {action.actionText}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
