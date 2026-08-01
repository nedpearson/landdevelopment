'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Calculator, Compass, DollarSign, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function UnderwritingPage() {
  const [askingPrice, setAskingPrice] = useState(14500);
  const [resaleValue, setResaleValue] = useState(24000);
  const [targetMargin, setTargetMargin] = useState(50);

  const maxAllowableOffer = resaleValue * (1 - targetMargin / 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" /> Underwriting & Spatial Comp Adjustments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Perform Quick Screen and Verified Underwriting with spatial distance adjustments, road access multipliers, and MAO limits.
          </p>
        </div>
        <Badge variant="success">Deal Score: 84 / 100</Badge>
      </div>

      {/* Underwriting Calculator & Comps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-emerald-900/40 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-emerald-400">Max Allowable Offer (MAO) Calculator</CardTitle>
            <CardDescription>Adjust target profit margin percentage to compute max cash offer</CardDescription>
          </CardHeader>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 uppercase text-[10px]">Estimated Resale Value ($)</label>
              <input
                type="number"
                value={resaleValue}
                onChange={(e) => setResaleValue(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-400 uppercase text-[10px]">Target Gross Margin (%)</label>
              <input
                type="number"
                value={targetMargin}
                onChange={(e) => setTargetMargin(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-amber-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Calculated Max Allowable Offer (MAO):</span>
                <span className="text-lg font-bold text-emerald-400">${maxAllowableOffer.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Projected Gross Profit:</span>
                <span className="text-emerald-300">${(resaleValue - maxAllowableOffer).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Spatial Comps Analysis */}
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Verified Spatial Comps</CardTitle>
            <CardDescription>Adjusted by distance, acreage tolerance (+/- 20%), and legal access</CardDescription>
          </CardHeader>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Comp #1: 5.0 AC (Costilla, CO)</p>
                <p className="text-[10px] text-slate-400">Sold 45 days ago | 1.2 mi away | Legal access</p>
              </div>
              <span className="text-emerald-400 font-bold">$22,500</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Comp #2: 5.4 AC (Costilla, CO)</p>
                <p className="text-[10px] text-slate-400">Sold 80 days ago | 2.8 mi away | Off-grid</p>
              </div>
              <span className="text-emerald-400 font-bold">$25,000</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
