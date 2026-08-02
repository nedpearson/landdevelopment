"use client";

import React from "react";
import { Home, Percent, Users, Key } from "lucide-react";
import type { Property } from "@land-intelligence/database";

export function RentalScorecard({ propertyData }: { propertyData: Property }) {
  const capRate = 8.5; // Simulated ML calculation
  const occupancy = 94.2;
  const grossRent = 125000;
  
  return (
    <div className="bg-slate-900 border border-sky-900/50 rounded-xl overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Home className="w-24 h-24" />
      </div>
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h3 className="font-semibold text-sky-400 flex items-center gap-2">
          <Key className="w-4 h-4" />
          Rental Yield Engine
        </h3>
        <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 rounded border border-sky-900">
          ML MODEL: RNT-02
        </span>
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cap Rate (Pro Forma)</div>
          <div className="text-2xl font-black text-white">{capRate}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Market Occupancy</div>
          <div className="text-2xl font-black text-white">{occupancy}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gross Ann. Rent</div>
          <div className="text-lg font-bold text-sky-400">${grossRent.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tenant Quality</div>
          <div className="text-lg font-bold text-emerald-400 flex items-center gap-1">
            <Users className="w-4 h-4" /> High (A-Class)
          </div>
        </div>
      </div>
    </div>
  );
}
