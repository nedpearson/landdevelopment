'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Calculator, ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnderwritingPage() {
  const [mode, setMode] = useState<'QUICK_SCREEN' | 'VERIFIED_UNDERWRITING'>('VERIFIED_UNDERWRITING');
  const [accessVerified, setAccessVerified] = useState(true);
  const [zoningVerified, setZoningVerified] = useState(true);
  const [environmentalVerified, setEnvironmentalVerified] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" /> Automated Underwriting & Explainable Deal Scoring
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Transparent factor breakdown with mandatory human verification for high-risk diligence fields.
          </p>
        </div>

        {/* Mode Selector Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setMode('QUICK_SCREEN')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'QUICK_SCREEN'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Quick Screen (~60s)
          </button>
          <button
            onClick={() => setMode('VERIFIED_UNDERWRITING')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              mode === 'VERIFIED_UNDERWRITING'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🛡️ Verified Underwriting
          </button>
        </div>
      </div>

      {/* Mode Disclaimer Banner */}
      {mode === 'QUICK_SCREEN' ? (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>PRELIMINARY — NOT VERIFIED:</strong> Quick Screen provides a fast preliminary estimate using raw provider data. It is nonbinding and must be verified before transmitting an official offer.
            </span>
          </div>
          <Badge variant="warning">Preliminary Mode</Badge>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>VERIFIED UNDERWRITING ACTIVE:</strong> All high-risk fields (legal access, zoning, flood/wetland, title exceptions) require explicit user sign-off.
            </span>
          </div>
          <Badge variant="success">Verified Mode</Badge>
        </div>
      )}

      {/* Main Deal Score Factor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Score Factor Contribution (Overall: 84 / 100)</CardTitle>
              <CardDescription>Weights, confidence scores, and supporting evidence for APN 123-456-789</CardDescription>
            </CardHeader>

            <div className="space-y-4 text-xs">
              {/* Factor 1 */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">1. Pricing & Discount (Weight: 25%)</span>
                  <span className="font-bold text-emerald-400">90 / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[90%]" />
                </div>
                <p className="text-slate-400">Asking $14,500 vs Market $24,000 (39.5% equity discount margin)</p>
              </div>

              {/* Factor 2 */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">2. Legal & Physical Access (Weight: 20%)</span>
                  <span className="font-bold text-emerald-400">85 / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>
                <p className="text-slate-400">320 ft frontage on county-maintained dirt road; recorded easement Deed 412 Pg 98</p>
              </div>

              {/* Factor 3 */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">3. Environmental & Topography (Weight: 20%)</span>
                  <span className="font-bold text-emerald-400">100 / 100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
                <p className="text-slate-400">0% Flood Zone, 0% Wetlands, 3.2% average slope (Flat buildable terrain)</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Verification Requirements Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Checklist</CardTitle>
              <CardDescription>Must be checked off before offer release</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Road Access & Easement</span>
                <input
                  type="checkbox"
                  checked={accessVerified}
                  onChange={(e) => setAccessVerified(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Zoning Code & Setbacks</span>
                <input
                  type="checkbox"
                  checked={zoningVerified}
                  onChange={(e) => setZoningVerified(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                <span className="text-slate-200">Environmental Overlays</span>
                <input
                  type="checkbox"
                  checked={environmentalVerified}
                  onChange={(e) => setEnvironmentalVerified(e.target.checked)}
                  className="rounded accent-emerald-500 w-4 h-4"
                />
              </label>

              <div className="pt-3">
                <Link href="/offers">
                  <Button
                    variant="primary"
                    className="w-full"
                    disabled={!accessVerified || !zoningVerified || !environmentalVerified}
                  >
                    Proceed to Offer Scenarios
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
