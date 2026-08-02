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
    <div className="glass-panel rounded-2xl overflow-hidden relative group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="p-5 border-b border-white/[0.04] flex justify-between items-center relative z-10">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          Investment Intelligence
        </h3>
        <span className="text-[10px] font-mono font-medium tracking-widest text-slate-500 uppercase px-2 py-1 bg-white/[0.02] border border-white/[0.04] rounded-md">
          Model: INV-01
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Flip Score</div>
          <div className="text-3xl font-semibold tracking-tight text-white mb-2">{data.flipScore}<span className="text-sm text-slate-500 font-medium ml-1">/100</span></div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${data.flipScore}%` }} />
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Wholesale Max</div>
          <div className="text-3xl font-semibold tracking-tight text-white text-gradient">${data.wholesaleMargin.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Market Velocity</div>
          <div className="text-lg font-medium text-slate-200">{data.velocity}</div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Risk Profile</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${data.riskProfile === 'Low' ? 'bg-emerald-400 text-emerald-400' : data.riskProfile === 'Medium' ? 'bg-amber-400 text-amber-400' : 'bg-rose-400 text-rose-400'}`} />
            <span className="text-lg font-medium text-slate-200">{data.riskProfile}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.04] relative z-10 flex gap-4">
        <div className="w-1 h-full min-h-[40px] bg-gradient-to-b from-emerald-500 to-transparent rounded-full opacity-50 shrink-0" />
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          <span className="text-emerald-400 font-semibold mr-2">AI Insight:</span>
          {data.narrative}
        </p>
      </div>
    </div>
  );
}
