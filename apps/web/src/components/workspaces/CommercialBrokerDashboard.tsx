"use client";

import React from "react";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { ArrowRight, Building2, Briefcase } from "lucide-react";
import { useDrilldown } from "../providers/DrilldownProvider";

export function CommercialBrokerDashboard() {
  const { activeWorkspace } = useWorkspace();
  const { push } = useDrilldown();

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-light text-slate-100 tracking-tight">
          Good Morning, <span className="font-semibold text-white">Broker</span>.
        </h1>
        <p className="text-lg text-slate-400">Here is your {activeWorkspace.label} briefing for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Active Listings</p>
          <p className="text-2xl font-bold text-indigo-400">14</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Upcoming Tours</p>
          <p className="text-2xl font-bold text-amber-400">6</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">LOIs in Negotiation</p>
          <p className="text-2xl font-bold text-rose-400">4</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">YTD Commissions</p>
          <p className="text-2xl font-bold text-emerald-400">$840K</p>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800/80 pb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-500" /> Active Deals
        </h2>
        
        <ul className="space-y-5">
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <button onClick={() => push({ id: "prop-comm-1", type: "PROPERTY", label: "Deal Pending" })} className="hover:text-white transition-colors text-left text-lg group flex items-center gap-2">
              <span><strong className="text-white font-medium">1 Class A Office</strong> has an expiring LOI deadline today.</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </button>
          </li>
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-lg"><strong className="text-white font-medium">2 new tenant matches</strong> identified for your retail strip center.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
