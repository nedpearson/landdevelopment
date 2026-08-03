"use client";

import React, { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Loader2, Target } from 'lucide-react';
import { generateDailyMarketIntel } from '@/actions/intelActions';
import type { MarketIntel } from '@/actions/intelActions';
import { useDrilldown } from '../providers/DrilldownProvider';

export function MarketIntelDashboard() {
  const [intel, setIntel] = useState<MarketIntel | null>(null);
  const [loading, setLoading] = useState(true);
  const { push, clear } = useDrilldown();

  useEffect(() => {
    generateDailyMarketIntel().then(data => {
      setIntel(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 border border-indigo-500/20 rounded-2xl p-6 mb-8 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3 text-indigo-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-sm font-medium tracking-wide uppercase">AI is analyzing overnight market data...</span>
        </div>
      </div>
    );
  }

  if (!intel) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl overflow-hidden mb-8 shadow-2xl relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          
          {/* Left Column: Briefing */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-sm font-bold uppercase tracking-wider">AI Morning Briefing</h2>
            </div>
            <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-light">
              {intel.summary}
            </p>
            <div className="pt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" /> Market Velocity: High
              </div>
              <div className="flex items-center gap-2 text-xs font-medium bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" /> 3 New Zoning Changes
              </div>
            </div>
          </div>

          {/* Right Column: High Priority Targets */}
          <div className="w-full md:w-96 shrink-0 bg-white/[0.02] border border-white/[0.05] rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" /> Hot Acquisitions
              </h3>
            </div>
            
            <div className="space-y-3">
              {intel.opportunities.slice(0, 3).map((opp, idx) => (
                <button
                  key={idx}
                  onClick={() => push({ id: opp.id, type: 'PROPERTY', label: 'Property Drilldown' })}
                  className="w-full text-left bg-slate-800/50 hover:bg-indigo-600/20 border border-slate-700/50 hover:border-indigo-500/50 transition-all p-3 rounded-lg group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{opp.apn}</span>
                    <span className="text-xs text-slate-500">{opp.county}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed group-hover:text-indigo-200 transition-colors">
                    {opp.reason}
                  </p>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => clear()}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View All Opportunities <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
