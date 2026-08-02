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
      hasPughClause: true,
      hasShutInClause: true,
      hasContinuousDevelopment: false,
      depthSeveranceTop: 'Surface',
      depthSeveranceBottom: '100ft below base of Wolfcamp',
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
          <CardDescription>Lessor/Lessee details, royalty rate, Depth Severances, and producing well evidence</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Lease Name</th>
                <th className="p-3">Royalty</th>
                <th className="p-3">Depth Limits</th>
                <th className="p-3">Clauses</th>
                <th className="p-3">HBP Status</th>
                <th className="p-3">Producing Well</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {leases.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/40 align-top">
                  <td className="p-3">
                    <p className="font-bold text-amber-400">{l.leaseName}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{l.lessor} → {l.lessee}</p>
                  </td>
                  <td className="p-3 text-emerald-400 font-bold">{l.royaltyFraction}</td>
                  <td className="p-3 text-slate-300 space-y-1">
                    <p>Top: <Badge variant="default" className="text-[9px] bg-slate-800">{l.depthSeveranceTop}</Badge></p>
                    <p>Btm: <Badge variant="default" className="text-[9px] bg-slate-800">{l.depthSeveranceBottom}</Badge></p>
                  </td>
                  <td className="p-3 space-y-1">
                    {l.hasPughClause && <Badge variant="warning" className="block w-fit text-[9px]">PUGH CLAUSE</Badge>}
                    {l.hasShutInClause && <Badge variant="info" className="block w-fit text-[9px]">SHUT-IN</Badge>}
                    {l.hasContinuousDevelopment && <Badge variant="danger" className="block w-fit text-[9px]">CONT. DEV</Badge>}
                  </td>
                  <td className="p-3">
                    <Badge variant="success" className="font-mono">{l.hbpStatus}</Badge>
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
