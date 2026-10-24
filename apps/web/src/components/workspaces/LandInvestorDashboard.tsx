"use client";

import React from "react";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { ArrowRight, TrendingUp, DollarSign, Target, Activity } from "lucide-react";
import { MarketIntelDashboard } from "../ui/MarketIntelDashboard";
import { useDrilldown } from "../providers/DrilldownProvider";

export function LandInvestorDashboard() {
  const { activeWorkspace } = useWorkspace();
  const { push } = useDrilldown();

  return (
    <div className="space-y-5 sm:space-y-8 max-w-5xl mx-auto mt-1 sm:mt-6 animate-fade-in">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-4xl font-light text-slate-100 tracking-tight">
          Good Morning, <span className="font-semibold text-white">Investor</span>.
        </h1>
        <p className="text-sm sm:text-lg text-slate-400">Here is your {activeWorkspace.label} briefing for today.</p>
      </div>

      <MarketIntelDashboard />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">New Deals</p>
          <p className="text-xl sm:text-2xl font-bold text-white">24</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Responses</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400">3</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Under Contract</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-400">2</p>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-xl">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Projected</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-400">$340K</p>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 shadow-2xl">
        <h2 className="text-base sm:text-xl font-medium text-slate-200 border-b border-slate-800/80 pb-3 sm:pb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" /> AI Recommended Actions
        </h2>
        
        <ul className="space-y-3.5 sm:space-y-5">
          <li className="flex items-start sm:items-center gap-3 sm:gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] shrink-0 mt-1.5 sm:mt-0" />
            <button onClick={() => push({ id: "prop-101", type: "PROPERTY", label: "Due Diligence" })} className="hover:text-white transition-colors text-left text-sm sm:text-lg group flex items-center gap-2">
              <span><strong className="text-white font-medium">1 property</strong> has a major flood zone risk blocking acquisition.</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 shrink-0" />
            </button>
          </li>
          <li className="flex items-start sm:items-center gap-3 sm:gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] shrink-0 mt-1.5 sm:mt-0" />
            <span className="text-sm sm:text-lg"><strong className="text-white font-medium">3 sellers</strong> replied to the latest mailer campaign.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
