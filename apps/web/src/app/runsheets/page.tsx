'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { FileText, Plus, Search, CheckCircle2, ShieldAlert, BookOpen, Layers } from 'lucide-react';

export default function RunsheetsPage() {
  const [activeTab, setActiveTab] = useState<'INSTRUMENTS' | 'GAPS'>('INSTRUMENTS');

  const instruments = [
    {
      id: 'inst-1',
      sequenceNumber: 1,
      instrumentType: 'PATENT',
      grantor: 'State of Texas',
      grantee: 'John H. Reeves',
      executionDate: '1892-04-10',
      recordingDate: '1892-05-12',
      book: 'Patents-1',
      page: '142',
      docNumber: 'DOC-1892-142',
      legalDescription: 'NW1/4 Section 14, Block 55, PSL Survey (160 AC)',
      titleStatus: 'CLEARED_TITLE',
      notes: 'Patent from Sovereign State of Texas conveying full Fee Simple estate.',
    },
    {
      id: 'inst-2',
      sequenceNumber: 2,
      instrumentType: 'MINERAL_DEED',
      grantor: 'John H. Reeves',
      grantee: 'Henry T. Miller',
      executionDate: '1945-11-20',
      recordingDate: '1945-11-28',
      book: 'Deeds-84',
      page: '302',
      docNumber: 'DOC-1945-302',
      legalDescription: 'Undivided 1/4 Mineral Interest in NW1/4 Section 14, Block 55',
      titleStatus: 'CLEARED_TITLE',
      notes: 'Severance of 1/4 Mineral Estate (40 NMA). Surface retained by Reeves.',
    },
    {
      id: 'inst-3',
      sequenceNumber: 3,
      instrumentType: 'PROBATE_WILL',
      grantor: 'Henry T. Miller (Deceased)',
      grantee: 'Miller Family Trust',
      executionDate: '1998-06-15',
      recordingDate: '1999-01-10',
      book: 'Probate-12',
      page: '88',
      docNumber: 'DOC-1999-088',
      legalDescription: 'All real property & mineral interests in Reeves County, TX',
      titleStatus: 'CURATIVE_REQUIRED',
      notes: 'Foreign will probated in Oklahoma; Affidavit of Heirship needed in Texas registry.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Title Runsheet Engine & Instrument Index
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological title runsheet for Tract #T-104 (NW1/4 Sec 14, Block 55, PSL Survey, Reeves Co, TX).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Instrument Entry
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('INSTRUMENTS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'INSTRUMENTS'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Chronological Instruments ({instruments.length})
        </button>
        <button
          onClick={() => setActiveTab('GAPS')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'GAPS'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Title Gaps & Curative Defects (1 Alert)
        </button>
      </div>

      {/* Runsheet Content */}
      {activeTab === 'INSTRUMENTS' ? (
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Chronological Instrument Index</CardTitle>
            <CardDescription>Sovereign Patent to Current Record Owner Chain</CardDescription>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
                <tr>
                  <th className="p-3">Seq</th>
                  <th className="p-3">Instrument Type</th>
                  <th className="p-3">Grantor</th>
                  <th className="p-3">Grantee</th>
                  <th className="p-3">Recording Data</th>
                  <th className="p-3">Execution Date</th>
                  <th className="p-3">Title Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {instruments.map((inst) => (
                  <tr key={inst.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-amber-400">#{inst.sequenceNumber}</td>
                    <td className="p-3">
                      <Badge variant={inst.instrumentType === 'PATENT' ? 'info' : 'warning'}>
                        {inst.instrumentType.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-200">{inst.grantor}</td>
                    <td className="p-3 font-semibold text-white">{inst.grantee}</td>
                    <td className="p-3 text-slate-300">Vol {inst.book}, Pg {inst.page} ({inst.docNumber})</td>
                    <td className="p-3 text-slate-400">{inst.executionDate}</td>
                    <td className="p-3">
                      <Badge variant={inst.titleStatus === 'CLEARED_TITLE' ? 'success' : 'danger'}>
                        {inst.titleStatus.replace('_', ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="border-rose-900/40 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-rose-400">Title Gap & Curative Defect Analysis</CardTitle>
            <CardDescription>Detected by Grounded AI Runsheet Verification Engine</CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <EvidenceBox
              source="Rees County Deed Registry Vol 84 Pg 302 & Probate Vol 12 Pg 88"
              retrievedAt={new Date().toISOString()}
              confidenceScore={94}
              verificationState="ATTORNEY_VERIFIED"
              assumptions={['Foreign probate in Oklahoma not recorded in Reeves County, TX']}
            >
              <div className="space-y-2 text-xs text-slate-200">
                <p className="font-bold text-rose-400">Defect #1: Unrecorded Foreign Probate (Instrument #3)</p>
                <p>
                  Henry T. Miller passed away in Oklahoma. The foreign probate decree was recorded in Oklahoma County, but an ancillary probate or Affidavit of Heirship has not been filed in Reeves County, TX.
                </p>
                <p className="font-semibold text-amber-300">Required Curative Action: Prepare and record Affidavit of Heirship signed by two disinterested witnesses in Reeves County registry prior to division order approval.</p>
              </div>
            </EvidenceBox>
          </div>
        </Card>
      )}
    </div>
  );
}
