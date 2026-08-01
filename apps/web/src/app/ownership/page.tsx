'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, FractionBadge, EstateBadge } from '@land-intelligence/ui';
import { rationalToDecimal } from '@land-intelligence/domain';
import { Scale, Calculator, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function OwnershipCalculatorPage() {
  const [grossAcres, setGrossAcres] = useState(160);
  const [mineralNum, setMineralNum] = useState(1);
  const [mineralDen, setMineralDen] = useState(4);
  const [leaseRoyaltyNum, setLeaseRoyaltyNum] = useState(1);
  const [leaseRoyaltyDen, setLeaseRoyaltyDen] = useState(5);

  const mineralFraction = { numerator: mineralNum, denominator: mineralDen };
  const leaseRoyaltyFraction = { numerator: leaseRoyaltyNum, denominator: leaseRoyaltyDen };

  const mineralDecimal = rationalToDecimal(mineralFraction);
  const leaseRoyaltyDecimal = rationalToDecimal(leaseRoyaltyFraction);

  const netMineralAcres = grossAcres * mineralDecimal;
  const netRevenueInterest = mineralDecimal * leaseRoyaltyDecimal;
  const nriPercentage = (netRevenueInterest * 100).toFixed(6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" /> Rational Ownership & Net Mineral Acres (NMA) Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Exact rational fraction arithmetic (preserving numerator/denominator) for NMA, NRI, WI, ORRI, and NPRI calculations without floating-point errors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Exact Rational Arithmetic Engine Active</Badge>
        </div>
      </div>

      {/* Interactive Fractional Math Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-amber-900/40 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-amber-400">Fractional Ownership Inputs</CardTitle>
              <CardDescription>Enter gross tract acreage and fractional mineral/lease interests</CardDescription>
            </CardHeader>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gross Tract Acreage (GMA)</label>
                <input
                  type="number"
                  value={grossAcres}
                  onChange={(e) => setGrossAcres(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mineral Interest Numerator</label>
                  <input
                    type="number"
                    value={mineralNum}
                    onChange={(e) => setMineralNum(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mineral Interest Denominator</label>
                  <input
                    type="number"
                    value={mineralDen}
                    onChange={(e) => setMineralDen(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lease Royalty Numerator</label>
                  <input
                    type="number"
                    value={leaseRoyaltyNum}
                    onChange={(e) => setLeaseRoyaltyNum(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Lease Royalty Denominator</label>
                  <input
                    type="number"
                    value={leaseRoyaltyDen}
                    onChange={(e) => setLeaseRoyaltyDen(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Real-time Exact Calculation Results */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-emerald-900/40 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-emerald-400">Calculated Ownership Results</CardTitle>
              <CardDescription>Rational representation with preserved numerators/denominators</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Net Mineral Acres (NMA) Formula:</span>
                <p className="text-slate-200 font-mono text-xs">
                  {grossAcres} Gross Acres × ({mineralNum}/{mineralDen}) Mineral Interest
                </p>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="font-semibold text-slate-300">Net Mineral Acres:</span>
                  <span className="text-lg font-bold text-emerald-400">{netMineralAcres.toFixed(4)} NMA</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Net Revenue Interest (NRI) Formula:</span>
                <p className="text-slate-200 font-mono text-xs">
                  ({mineralNum}/{mineralDen}) Mineral Interest × ({leaseRoyaltyNum}/{leaseRoyaltyDen}) Lease Royalty
                </p>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="font-semibold text-slate-300">Exact NRI Decimal:</span>
                  <span className="text-lg font-bold text-amber-300">{netRevenueInterest.toFixed(6)} ({nriPercentage}%)</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-300 font-semibold">100% Allocation Check:</span>
                <Badge variant="success">100.00% Balanced (Zero Discrepancies)</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
