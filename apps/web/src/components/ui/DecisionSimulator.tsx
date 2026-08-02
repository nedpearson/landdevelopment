"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ChevronDown, ArrowRight, TrendingUp, AlertOctagon, CheckCircle2 } from "lucide-react";

import type { Property } from "@land-intelligence/database";

interface StrategyData {
  id: string;
  name: string;
  capRate: string;
  noi: string;
  requiredCapital: string;
  timeline: string;
  primaryRisk: string;
  status: "FEASIBLE" | "HIGH_RISK" | "UNPROFITABLE";
}

const BASE_STRATEGIES: StrategyData[] = [
  {
    id: "btr",
    name: "Build-to-Rent Community",
    capRate: "7.8%",
    noi: "$420,000 / yr",
    requiredCapital: "$4.5M", // We will overwrite this if askingPrice exists
    timeline: "18 Months to Cashflow",
    primaryRisk: "Requires re-zoning from Single-Family to Multi-Family/Planned Development.",
    status: "HIGH_RISK"
  },
  {
    id: "subdivide",
    name: "Subdivide & Sell (SFR)",
    capRate: "N/A (Yield: 22% ROI)",
    noi: "N/A",
    requiredCapital: "$1.2M",
    timeline: "12 Months to Exit",
    primaryRisk: "Utility tap availability is currently unverified.",
    status: "FEASIBLE"
  },
  {
    id: "solar",
    name: "Utility-Scale Solar Farm",
    capRate: "9.2%",
    noi: "$850,000 / yr",
    requiredCapital: "$12M",
    timeline: "36 Months to Cashflow",
    primaryRisk: "Distance to nearest heavy transmission line is >5 miles.",
    status: "UNPROFITABLE"
  },
  {
    id: "commercial",
    name: "Commercial Pad Site (Retail)",
    capRate: "6.5%",
    noi: "$180,000 / yr",
    requiredCapital: "$2.1M",
    timeline: "24 Months to Cashflow",
    primaryRisk: "Traffic counts (AADT) are slightly below retail tenant thresholds.",
    status: "HIGH_RISK"
  }
];

interface Props {
  propertyData?: Property | null;
}

export function DecisionSimulator({ propertyData }: Props) {
  const [activeStrategyId, setActiveStrategyId] = useState<string>("btr");
  const [isOpen, setIsOpen] = useState(false);

  // Dynamically calculate capital based on the LIVE asking price from Supabase
  const STRATEGIES = useMemo(() => {
    return BASE_STRATEGIES.map(strategy => {
      if (!propertyData?.askingPrice) return strategy;

      let devCost = 0;
      if (strategy.id === "btr") devCost = 3500000;
      if (strategy.id === "subdivide") devCost = 500000;
      if (strategy.id === "solar") devCost = 10000000;
      if (strategy.id === "commercial") devCost = 1500000;

      const totalCap = propertyData.askingPrice + devCost;
      const formattedCap = totalCap >= 1000000 
        ? `$${(totalCap / 1000000).toFixed(1)}M` 
        : `$${(totalCap / 1000).toFixed(0)}k`;

      return {
        ...strategy,
        requiredCapital: formattedCap
      };
    });
  }, [propertyData]);

  const activeStrategy = STRATEGIES.find(s => s.id === activeStrategyId) || STRATEGIES[0];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "FEASIBLE": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "HIGH_RISK": return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      case "UNPROFITABLE": return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      default: return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mt-6 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Calculator className="w-5 h-5" />
          <h3 className="font-bold text-white">Omni-Asset Decision Simulator</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Strategy Selector */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Simulate Strategy</label>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-slate-950 border border-slate-700 hover:border-indigo-500 rounded-xl px-4 py-3 text-left transition-colors"
          >
            <span className="font-semibold text-white text-lg">{activeStrategy.name}</span>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              {STRATEGIES.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStrategyId(s.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-slate-900 transition-colors ${activeStrategyId === s.id ? 'bg-indigo-900/20 text-indigo-300' : 'text-slate-300'}`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Projected NOI</span>
            <span className="text-xl font-bold text-white">{activeStrategy.noi}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Cap Rate / Yield</span>
            <span className="text-xl font-bold text-emerald-400">{activeStrategy.capRate}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Req. Capital</span>
            <span className="text-xl font-bold text-white">{activeStrategy.requiredCapital}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Timeline</span>
            <span className="text-lg font-bold text-white">{activeStrategy.timeline}</span>
          </div>
        </div>

        {/* Risk & Feasibility */}
        <div className={`border rounded-xl p-4 flex gap-3 ${getStatusColor(activeStrategy.status)}`}>
          <div className="mt-0.5">
            {activeStrategy.status === "FEASIBLE" ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-sm mb-1">{activeStrategy.status.replace("_", " ")}</div>
            <p className="text-xs opacity-90 leading-relaxed">{activeStrategy.primaryRisk}</p>
          </div>
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50">
          <TrendingUp className="w-4 h-4" />
          Generate Full Pro Forma
        </button>
      </div>
    </div>
  );
}
