'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { FileCheck, ShieldCheck, CheckCircle2, Clock, Layers } from 'lucide-react';

export default function LeasesPage() {
  const leases = [
    {
      id: 'lse-101',
      leaseName: 'Miller 14-A Oil & Gas Lease',
      lessor: 'Estate of Henry T. Miller',
      lessee: 'Pioneer Natural Resources',
      leaseDate: '2021-03-15',
      primaryTermYears: 3,
      royaltyFraction: '1/5th (20.0%)',
      grossAcres: 160.0,
      pughClause: 'Vertical & Horizontal Pugh Clause Attached',
      hbpStatus: 'HBP_PRODUCING',
      producingWell: 'Miller 14-1H (API #42-389-34102)',
      dailyProduction: '1,240 BOEPD',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" /> Leases & Held-By-Production (HBP) Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oil & Gas Lease administration, primary/secondary terms, Pugh clauses, shut-in provisions, and production evidence chains.
          </p>
        </div>
        <Badge variant="success">1 Active Producing Lease</Badge>
      </div>

      {/* Leases Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Lease Directory</CardTitle>
          <CardDescription>Lessor/Lessee details, royalty rate, Pugh clause status, and producing well evidence</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Lease Name</th>
                <th className="p-3">Lessor</th>
                <th className="p-3">Lessee</th>
                <th className="p-3">Royalty</th>
                <th className="p-3">Pugh Clause</th>
                <th className="p-3">HBP Status</th>
                <th className="p-3">Producing Well</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {leases.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-amber-400">{l.leaseName}</td>
                  <td className="p-3 text-slate-200">{l.lessor}</td>
                  <td className="p-3 text-white font-semibold">{l.lessee}</td>
                  <td className="p-3 text-emerald-400 font-bold">{l.royaltyFraction}</td>
                  <td className="p-3 text-slate-300">{l.pughClause}</td>
                  <td className="p-3">
                    <Badge variant="success font-mono">{l.hbpStatus}</Badge>
                  </td>
                  <td className="p-3 text-purple-300 font-semibold">{l.producingWell}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4">
          <EvidenceBox
            source="Texas Railroad Commission (RRC) Production Reports & Well API #42-389-34102"
            retrievedAt={new Date().toISOString()}
            confidenceScore={99}
            verificationState="ATTORNEY_VERIFIED"
          >
            <p className="text-xs text-slate-300">
              HBP Evidence Chain Provenance: Miller 14-1H has produced continuously for 34 consecutive months (1,240 BOEPD average), legally maintaining the 160-acre leasehold past primary expiration date under Texas habendum clause case law.
            </p>
          </EvidenceBox>
        </div>
      </Card>
    </div>
  );
}
