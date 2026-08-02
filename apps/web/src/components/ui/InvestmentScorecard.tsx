"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, Activity, DollarSign, Target, Loader2 } from "lucide-react";
import type { Property } from "@land-intelligence/database";
import { generateInvestmentAssessment } from "@/actions/aiEngines";

export function InvestmentScorecard({ propertyData }: { propertyData: Property }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInvestmentAssessment(propertyData.id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [propertyData.id]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-6 flex items-center justify-center text-emerald-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Running Investment Engine...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-emerald-900/50 rounded-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <TrendingUp className="w-24 h-24" />
      </div>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Investment Engine
        </h3>
        <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-900">
          ML MODEL: INV-01
        </span>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Flip Score</div>
          <div className="text-2xl font-black text-white">{data.flipScore}<span className="text-sm text-slate-500 font-medium">/100</span></div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Wholesale Max</div>
          <div className="text-2xl font-black text-white">${data.wholesaleMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Market Velocity</div>
          <div className="text-lg font-bold text-amber-400">{data.velocity}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Risk Profile</div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
            <Target className="w-4 h-4" /> {data.riskProfile}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 bg-emerald-950/30 border-t border-emerald-900/30 text-sm text-emerald-200/80">
        <strong>AI Insight:</strong> {data.narrative}
      </div>
    </div>
  );
}
