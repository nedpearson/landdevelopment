"use client";

import React from "react";
import { Hammer, Ruler, Zap, HardHat } from "lucide-react";
import type { Property } from "@land-intelligence/database";

export function DevelopmentScorecard({ propertyData }: { propertyData: Property }) {
  const maxDensity = Math.floor(propertyData.acreage * 4.5); // 4.5 units per acre
  const estCost = maxDensity * 120000; 
  
  return (
    <div className="bg-slate-900 border border-orange-900/50 rounded-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <HardHat className="w-24 h-24" />
      </div>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h3 className="font-semibold text-orange-400 flex items-center gap-2">
          <Hammer className="w-4 h-4" />
          Highest & Best Use Engine
        </h3>
        <span className="text-[10px] font-mono bg-orange-950 text-orange-300 px-2 py-0.5 rounded border border-orange-900">
          ML MODEL: DEV-03
        </span>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Max Density</div>
          <div className="text-2xl font-black text-white">{maxDensity} <span className="text-sm font-medium text-slate-500">Units</span></div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Est. Build Cost</div>
          <div className="text-2xl font-black text-white">${(estCost / 1000000).toFixed(1)}<span className="text-sm font-medium text-slate-500">M</span></div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Zoning Friction</div>
          <div className="text-lg font-bold text-emerald-400">Low (By Right)</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Utilities</div>
          <div className="text-lg font-bold text-amber-400 flex items-center gap-1">
            <Zap className="w-4 h-4" /> Extension Req.
          </div>
        </div>
      </div>
    </div>
  );
}
