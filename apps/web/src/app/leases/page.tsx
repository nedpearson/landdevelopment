'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, FractionBadge, EvidenceBox } from '@land-intelligence/ui';
import { FileCheck, ShieldCheck, AlertTriangle, Clock, Activity, CheckCircle2 } from 'lucide-react';

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" /> Lease Administration & Held-By-Production (HBP) Analysis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage oil & gas, solar, wind, ground, and ROW leases. Track Pugh clauses, expirations, and HBP evidence chains.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add Lease Record
          </Button>
        </div>
      </div>

      {/* Lease Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Lease Administration Table */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Active Leasehold Records</CardTitle>
              <CardDescription>Lease terms, royalty, Pugh clauses, and expiration tracking</CardDescription>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
                  <tr>
                    <th className="p-3">Lease #</th>
                    <th className="p-3">Lessor</th>
                    <th className="p-3">Lessee</th>
                    <th className="p-3">Royalty</th>
                    <th className="p-3">Primary Term</th>
                    <th className="p-3">Pugh Clause</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-white">OG-2026-104</td>
                    <td className="p-3">Miller Family Trust</td>
                    <td className="p-3 text-slate-300">Apex Energy Corp</td>
                    <td className="p-3">
                      <FractionBadge fraction={{ numerator: 1, denominator: 5 }} label="Royalty" />
                    </td>
                    <td className="p-3">3 Years (Exp: 2029)</td>
                    <td className="p-3">
                      <Badge variant="success">YES (Vertical & Horiz)</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="info">ACTIVE LEASE</Badge>
                    </td>
                  </tr>

                  <tr>
                    <td className="p-3 font-semibold text-white">SOLAR-2026-88</td>
                    <td className="p-3">Costilla Ranch LLC</td>
                    <td className="p-3 text-slate-300">NextEra Solar LLC</td>
                    <td className="p-3">$45/AC/Yr</td>
                    <td className="p-3">5 Yr Option / 30 Yr Lease</td>
                    <td className="p-3 text-slate-500">N/A</td>
                    <td className="p-3">
                      <Badge variant="warning">OPTION PERIOD</Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* HBP Evidence Chain Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-emerald-900/40 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Activity className="w-4 h-4" /> HBP Evidence Chain Analyzer
              </CardTitle>
              <CardDescription>Verified evidence chain linking Lease -&gt; Unit -&gt; Well -&gt; Production</CardDescription>
            </CardHeader>

            <EvidenceBox
              source="Texas Railroad Commission (RRC) & Permian Unit Operator Feed"
              retrievedAt={new Date().toISOString()}
              confidenceScore={96}
              verificationState="ATTORNEY_VERIFIED"
              assumptions={['Unit pooling order #RRC-88492 active', 'Producing well Wolfcamp 1H active']}
            >
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Well:</strong> Wolfcamp Unit 1H (API #42-389-32104)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span><strong>Monthly Production:</strong> 12,450 BOE / mo</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300 font-semibold pt-1">
                  <span>Conclusion: Confirmed HBP (Held By Production)</span>
                </div>
              </div>
            </EvidenceBox>
          </Card>
        </div>
      </div>
    </div>
  );
}
