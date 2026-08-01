'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { ShieldCheck, AlertTriangle, Clock, CheckCircle2, FileSearch, Upload } from 'lucide-react';

export default function CurativePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" /> Curative Center & Title Defect Resolution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track title opinion requirements, missing probate documents, heirship affidavits, unreleased liens, and curative documents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add Curative Requirement
          </Button>
        </div>
      </div>

      {/* Curative Items List */}
      <div className="space-y-4">
        <Card className="border-rose-900/40 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">1. Affidavit of Heirship for Estate of Henry T. Miller</h3>
                  <Badge variant="danger">CRITICAL BLOCKER</Badge>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Tract: T-104 | Defect: Unprobated foreign will in Instrument #3. Requires 2 disinterested witness affidavits.
                </p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-300">
                  <span>Assigned To: Sarah Jenkins (Curative Specialist)</span>
                  <span>Target Date: 2026-05-10</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>
                Attach Executed Affidavit
              </Button>
              <Button variant="primary" size="sm">
                Mark Cleared
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">2. Unreleased Mortgage Lien Release (Book 142 Pg 88)</h3>
                  <Badge variant="success">CLEARED</Badge>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Tract: T-104 | Source: First National Bank Release recorded Doc #2026-00412.
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm">
              View Release PDF
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
