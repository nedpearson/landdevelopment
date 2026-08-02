'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Briefcase, AlertTriangle, CheckCircle2, ShieldCheck, FileCheck } from 'lucide-react';

export default function DueDiligencePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" /> Due Diligence Center & Risk Inspection
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track title searches, tax delinquency, legal road access, zoning restrictions, flood/wetland surveys, and blocker alerts.
          </p>
        </div>
        <Badge variant="warning">1 Blocker Pending Approval</Badge>
      </div>

      {/* Diligence Checklist Grid */}
      <div className="space-y-4">
        <Card className="border-rose-900/40 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">1. Legal Access Verification (County Road 412)</h3>
                  <Badge variant="danger">FAILED BLOCKER</Badge>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Property: APN 123-456-789 | Issue: Physical dirt road visible on satellite, but no recorded ingress/egress easement in Costilla registry.
                </p>
              </div>
            </div>

            <Button variant="primary" size="sm">
              Request Ingress Easement
            </Button>
          </div>
        </Card>

        <Card className="border-emerald-900/40 bg-slate-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">2. Tax Delinquency & Back Taxes Clearance</h3>
                  <Badge variant="success" className="font-mono">VERIFIED CLEAR</Badge>
                </div>
                <p className="text-slate-400 mt-0.5">
                  Property: APN 123-456-789 | Status: $0.00 delinquent tax balance verified with Costilla Treasurer.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
