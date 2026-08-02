"use client";

import React, { useEffect, useState } from "react";
import { Home, Percent, Users, Key, Loader2 } from "lucide-react";
import type { Property } from "@land-intelligence/database";
import { generateRentalAssessment } from "@/actions/aiEngines";

export function RentalScorecard({ propertyData }: { propertyData: Property }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRentalAssessment(propertyData.id).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [propertyData.id]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-sky-900/50 rounded-xl p-6 flex items-center justify-center text-sky-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Running Rental Yield Engine...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-panel rounded-2xl overflow-hidden relative group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="p-5 border-b border-white/[0.04] flex justify-between items-center relative z-10">
        <h3 className="font-semibold text-slate-100 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Key className="w-4 h-4 text-sky-400" />
          </div>
          Rental Yield Engine
        </h3>
        <span className="text-[10px] font-mono font-medium tracking-widest text-slate-500 uppercase px-2 py-1 bg-white/[0.02] border border-white/[0.04] rounded-md">
          Model: RNT-02
        </span>
      </div>
      
      <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Cap Rate (Pro Forma)</div>
          <div className="text-3xl font-semibold tracking-tight text-white mb-2">{data.capRate}%</div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full" style={{ width: `${Math.min(data.capRate * 10, 100)}%` }} />
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Market Occupancy</div>
          <div className="text-3xl font-semibold tracking-tight text-white mb-2">{data.occupancy}%</div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-400 to-slate-200 rounded-full" style={{ width: `${data.occupancy}%` }} />
          </div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Gross Ann. Rent</div>
          <div className="text-xl font-medium text-slate-200">${data.grossRent.toLocaleString()}</div>
        </div>
        
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide uppercase mb-2">Tenant Quality</div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${data.tenantQuality === 'A-Class' ? 'bg-emerald-400 text-emerald-400' : 'bg-amber-400 text-amber-400'}`} />
            <span className="text-lg font-medium text-slate-200">{data.tenantQuality}</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.04] relative z-10 flex gap-4">
        <div className="w-1 h-full min-h-[40px] bg-gradient-to-b from-sky-500 to-transparent rounded-full opacity-50 shrink-0" />
        <p className="text-sm text-slate-300 leading-relaxed font-medium">
          <span className="text-sky-400 font-semibold mr-2">AI Insight:</span>
          {data.narrative}
        </p>
      </div>
    </div>
  );
}
