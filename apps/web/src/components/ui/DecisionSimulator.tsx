"use client";

import React, { useState, useMemo } from "react";
import { Calculator, ChevronDown, ArrowRight, TrendingUp, AlertOctagon, CheckCircle2 } from "lucide-react";

import type { Property } from "@land-intelligence/database";

interface StrategyData {
  id: string;
  name: string;
  baseNoi: number;
  baseDevCost: number;
  timeline: string;
  primaryRisk: string;
  status: "FEASIBLE" | "HIGH_RISK" | "UNPROFITABLE";
}

const BASE_STRATEGIES: StrategyData[] = [
  {
    id: "btr",
    name: "Build-to-Rent Community",
    baseNoi: 420000,
    baseDevCost: 3500000,
    timeline: "18 Months to Cashflow",
    primaryRisk: "Requires re-zoning from Single-Family to Multi-Family/Planned Development.",
    status: "HIGH_RISK"
  },
  {
    id: "subdivide",
    name: "Subdivide & Sell (SFR)",
    baseNoi: 0,
    baseDevCost: 500000,
    timeline: "12 Months to Exit",
    primaryRisk: "Utility tap availability is currently unverified.",
    status: "FEASIBLE"
  },
  {
    id: "solar",
    name: "Utility-Scale Solar Farm",
    baseNoi: 850000,
    baseDevCost: 10000000,
    timeline: "36 Months to Cashflow",
    primaryRisk: "Distance to nearest heavy transmission line is >5 miles.",
    status: "UNPROFITABLE"
  },
  {
    id: "commercial",
    name: "Commercial Pad Site (Retail)",
    baseNoi: 180000,
    baseDevCost: 1500000,
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
  const [interestRate, setInterestRate] = useState(7.5);
  const [costMultiplier, setCostMultiplier] = useState(1.0);

  const formatCurrency = (val: number) => {
    if (val === 0) return "N/A";
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    return `$${(val / 1000).toFixed(0)}k`;
  };

  const STRATEGIES = useMemo(() => {
    return BASE_STRATEGIES.map(strategy => {
      const ask = propertyData?.askingPrice || 500000;
      const totalCap = ask + (strategy.baseDevCost * costMultiplier);
      const interestExpense = totalCap * (interestRate / 100) * 0.5; // Rough half-term draw
      const adjustedNoi = strategy.baseNoi > 0 ? strategy.baseNoi - (interestExpense * 0.1) : 0;
      
      const capRate = adjustedNoi > 0 ? (adjustedNoi / totalCap) * 100 : 0;
      const formattedCapRate = strategy.id === "subdivide" ? "Yield: 22% ROI" : `${capRate.toFixed(1)}%`;

      return {
        ...strategy,
        displayNoi: strategy.baseNoi === 0 ? "N/A" : formatCurrency(adjustedNoi) + " / yr",
        displayCapRate: formattedCapRate,
        displayCap: formatCurrency(totalCap)
      };
    });
  }, [propertyData, interestRate, costMultiplier]);

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
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Calculator className="w-5 h-5" />
          <h3 className="font-bold text-white">Financial Sandbox</h3>
        </div>
      </div>

      <div className="p-6 space-y-6">
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

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interest Rate</label>
              <span className="text-xs font-mono text-indigo-400">{interestRate}%</span>
            </div>
            <input 
              type="range" min="3" max="15" step="0.1" 
              value={interestRate} 
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dev Cost Multiplier</label>
              <span className="text-xs font-mono text-indigo-400">{costMultiplier}x</span>
            </div>
            <input 
              type="range" min="0.5" max="2" step="0.1" 
              value={costMultiplier} 
              onChange={(e) => setCostMultiplier(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Projected NOI</span>
            <span className="text-xl font-bold text-white">{activeStrategy.displayNoi}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Cap Rate / Yield</span>
            <span className="text-xl font-bold text-emerald-400">{activeStrategy.displayCapRate}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Req. Capital</span>
            <span className="text-xl font-bold text-white">{activeStrategy.displayCap}</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Timeline</span>
            <span className="text-lg font-bold text-white">{activeStrategy.timeline}</span>
          </div>
        </div>

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
