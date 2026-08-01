'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Layers, CheckCircle2, Clock, FileCheck, Landmark, Building } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Transaction Coordinator & Closing Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track title commitments, escrow funding, closing milestones, and deed recordings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Closing Target: 2026-05-15</Badge>
        </div>
      </div>

      {/* Active Transaction Milestone Card */}
      <Card className="border-emerald-900/40">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Transaction: APN 123-456-789 (Costilla, CO)</CardTitle>
              <CardDescription>Escrow Officer: Pioneer Title Agency (Ref: #PTA-88492)</CardDescription>
            </div>
            <Badge variant="info">UNDER CONTRACT</Badge>
          </div>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Earnest Money Deposit</span>
            <p className="text-sm font-bold text-emerald-400">$500 Deposited</p>
            <span className="text-[10px] text-slate-500">Verified by Title Co</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Diligence Expiration</span>
            <p className="text-sm font-bold text-slate-200">May 8, 2026</p>
            <span className="text-[10px] text-emerald-400">All Items Cleared</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Title Commitment</span>
            <p className="text-sm font-bold text-emerald-400">Clear Title Verified</p>
            <span className="text-[10px] text-slate-500">Zero Liens Found</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Closing Settlement</span>
            <p className="text-sm font-bold text-emerald-400">$10,300 Remaining</p>
            <span className="text-[10px] text-slate-500">Wire Ready</span>
          </div>
        </div>

        {/* Milestone Steps Progress */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
          <h4 className="font-semibold text-slate-200">Closing Milestones</h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1. Contract Signed
            </div>
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2. EMD Received
            </div>
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 3. Title Clear
            </div>
            <div className="p-2 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> 4. Closing Package
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-500 flex items-center gap-1.5">
              5. Deed Recorded
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
