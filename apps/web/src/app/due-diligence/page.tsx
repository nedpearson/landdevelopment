'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Briefcase, CheckCircle2, Clock, XCircle, FileSearch, Upload } from 'lucide-react';
import Link from 'next/link';

export default function DueDiligencePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Executable Due Diligence Center & Evidence Vault
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Category-specific diligence tasks with evidence capture, reviewer audit trails, and blocker enforcement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Costilla CO Diligence Template Active</Badge>
        </div>
      </div>

      {/* Property Diligence Header Card */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-white text-base">APN: 123-456-789 (San Luis, Costilla, CO)</h2>
              <Badge variant="info">Diligence 80% Complete</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Assigned Reviewer: Sarah Jenkins (Transaction Coordinator)</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Upload className="w-3.5 h-3.5" />}>
              Attach Evidence Doc
            </Button>
          </div>
        </div>
      </Card>

      {/* Diligence Tasks Checklist & Evidence Grid */}
      <div className="space-y-3">
        {/* Task 1 */}
        <Card className="border-emerald-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white text-sm">1. Legal Access & Easement Document Search</h3>
                <p className="text-slate-400 mt-0.5">Category: Legal Access | Source: Costilla County Recorder (Deed Book 412 Pg 98)</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success">VERIFIED</Badge>
                  <span className="text-[11px] text-slate-400">Reviewed by: Sarah J. on 2026-04-12</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View Evidence PDF
            </Button>
          </div>
        </Card>

        {/* Task 2 */}
        <Card className="border-emerald-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white text-sm">2. Zoning Verification & Permitted Off-Grid Uses</h3>
                <p className="text-slate-400 mt-0.5">Category: Zoning | Code: ER Estate Residential (Camping & Mobile Permitted)</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="success">VERIFIED</Badge>
                  <span className="text-[11px] text-slate-400">Verified with Planning Dept</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              View Zoning Certificate
            </Button>
          </div>
        </Card>

        {/* Task 3 */}
        <Card className="border-amber-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white text-sm">3. Title Commitment & Encumbrance Review</h3>
                <p className="text-slate-400 mt-0.5">Category: Title & Ownership | Source: Pioneer Title Agency</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="warning">IN PROGRESS</Badge>
                  <span className="text-[11px] text-amber-300">Due in 2 days (Blocking Closing)</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Upload Title Commitment
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
