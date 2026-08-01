'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, FractionBadge, EvidenceBox } from '@land-intelligence/ui';
import { FileText, Plus, AlertTriangle, CheckCircle2, FileSearch, Download, Layers } from 'lucide-react';

export default function TitleRunsheetsPage() {
  const [selectedTract, setSelectedTract] = useState('T-104');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Title Runsheet Engine & Instrument Indexing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build chronological title runsheets, link grantors and grantees, track recording references, and spot title gaps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export Runsheet (XLSX / PDF)
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Add Title Instrument
          </Button>
        </div>
      </div>

      {/* Runsheet Workspace Card */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Runsheet for Tract T-104 (Reeves County, TX)</CardTitle>
            <CardDescription>Target Formation: Wolfcamp A & B | Total 4 Indexed Instruments</CardDescription>
          </div>
          <Badge variant="warning">Title Landman: Marcus Vance</Badge>
        </CardHeader>

        {/* Instruments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Instrument Type</th>
                <th className="p-3">Grantor (Seller/Lessor)</th>
                <th className="p-3">Grantee (Buyer/Lessee)</th>
                <th className="p-3">Exec Date</th>
                <th className="p-3">Rec Date</th>
                <th className="p-3">Book / Page / Doc #</th>
                <th className="p-3">Conveyed Interest</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">1</td>
                <td className="p-3">
                  <Badge variant="info">WARRANTY DEED</Badge>
                </td>
                <td className="p-3 font-semibold text-white">Reeves Land Company</td>
                <td className="p-3 text-slate-200">Henry T. Miller</td>
                <td className="p-3">1974-05-12</td>
                <td className="p-3">1974-05-18</td>
                <td className="p-3 text-emerald-400">Book 184 Pg 412</td>
                <td className="p-3">
                  <FractionBadge fraction={{ numerator: 1, denominator: 1 }} label="Full Fee Simple" />
                </td>
                <td className="p-3">
                  <Badge variant="success">VERIFIED</Badge>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">2</td>
                <td className="p-3">
                  <Badge variant="warning">MINERAL DEED (Severance)</Badge>
                </td>
                <td className="p-3 font-semibold text-white">Henry T. Miller</td>
                <td className="p-3 text-slate-200">Estate of Henry T. Miller</td>
                <td className="p-3">1998-11-04</td>
                <td className="p-3">1998-11-10</td>
                <td className="p-3 text-emerald-400">Book 310 Pg 88</td>
                <td className="p-3">
                  <FractionBadge fraction={{ numerator: 1, denominator: 4 }} label="Min Interest" />
                </td>
                <td className="p-3">
                  <Badge variant="success">VERIFIED</Badge>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">3</td>
                <td className="p-3">
                  <Badge variant="danger">PROBATE / UNPROBATED WILL</Badge>
                </td>
                <td className="p-3 font-semibold text-white">Estate of Henry T. Miller</td>
                <td className="p-3 text-slate-200">Heirs of Miller</td>
                <td className="p-3">2014-02-01</td>
                <td className="p-3">2014-03-15</td>
                <td className="p-3 text-amber-300">Doc #2014-00892</td>
                <td className="p-3">
                  <FractionBadge fraction={{ numerator: 1, denominator: 4 }} label="Undivided" />
                </td>
                <td className="p-3">
                  <Badge variant="danger">HEIRSHIP DEFECT</Badge>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="p-3 text-slate-500">4</td>
                <td className="p-3">
                  <Badge variant="info">OIL & GAS LEASE</Badge>
                </td>
                <td className="p-3 font-semibold text-white">Miller Family Trust</td>
                <td className="p-3 text-slate-200">Apex Energy Corp</td>
                <td className="p-3">2026-01-10</td>
                <td className="p-3">2026-01-22</td>
                <td className="p-3 text-emerald-400">Doc #2026-00142</td>
                <td className="p-3">
                  <FractionBadge fraction={{ numerator: 1, denominator: 4 }} label="Leasehold" />
                </td>
                <td className="p-3">
                  <Badge variant="success">ACTIVE LEASE</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Chronological Flaw & Gap Detection Alert */}
      <EvidenceBox
        source="Land Intelligence OS Title Gap & Conflict Detector"
        retrievedAt={new Date().toISOString()}
        confidenceScore={92}
        verificationState="UNVERIFIED"
        contradictions={['Unprobated Will in Instrument #3 requires Affidavit of Heirship or Ancillary Probate in Reeves County.']}
      >
        <p className="text-xs text-amber-300 font-semibold">
          ⚠️ Title Requirement Alert: Instrument #3 shows an unprobated foreign will. An Affidavit of Heirship or Stipulation of Interest must be executed before final division order pay deck approval.
        </p>
      </EvidenceBox>
    </div>
  );
}
