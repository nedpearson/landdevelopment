"use client";

import React from "react";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { ArrowRight, Sun, Zap } from "lucide-react";
import { useDrilldown } from "../providers/DrilldownProvider";

export function RenewableDashboard() {
  const { activeWorkspace } = useWorkspace();
  const { push } = useDrilldown();

  return (
    <div className="space-y-8 max-w-5xl mx-auto mt-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-4xl font-light text-slate-100 tracking-tight">
          Good Morning, <span className="font-semibold text-white">Developer</span>.
        </h1>
        <p className="text-lg text-slate-400">Here is your {activeWorkspace.label} briefing for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Target Megawatts</p>
          <p className="text-2xl font-bold text-lime-400">450 MW</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Acres Under Control</p>
          <p className="text-2xl font-bold text-emerald-400">12,500</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Option Deadlines</p>
          <p className="text-2xl font-bold text-rose-400">3 (Next 30d)</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Interconnection</p>
          <p className="text-2xl font-bold text-indigo-400">2 Pending</p>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800/80 pb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-lime-400" /> Interconnection & Site Control
        </h2>
        
        <ul className="space-y-5">
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <button onClick={() => push({ id: "prop-ren-1", type: "PROPERTY", label: "Option Expiring" })} className="hover:text-white transition-colors text-left text-lg group flex items-center gap-2">
              <span><strong className="text-white font-medium">1 Option Agreement</strong> covering 400 acres expires next week.</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </button>
          </li>
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-lg"><strong className="text-white font-medium">1 Interconnection Queue</strong> study result has been published.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
