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

          <div className="relative border-l border-slate-700 ml-4 space-y-8 py-4">
            {instruments.map((inst) => (
              <div key={inst.id} className="relative pl-6">
                <div className="absolute w-4 h-4 bg-slate-900 border-2 border-amber-500 rounded-full -left-[9px] top-1.5 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                <Card className="border-slate-800 bg-slate-950/50 hover:bg-slate-900 transition-colors">
                  <CardHeader className="pb-3 border-b border-slate-800/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-amber-400 font-bold font-mono">#{inst.sequenceNumber}</span>
                          <Badge variant={inst.instrumentType === 'PATENT' ? 'info' : 'warning'}>
                            {inst.instrumentType.replace('_', ' ')}
                          </Badge>
                          <Badge variant={inst.titleStatus === 'CLEARED_TITLE' ? 'success' : 'danger'}>
                            {inst.titleStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm font-semibold text-white">
                          {inst.grantor} <span className="text-slate-500 font-mono text-xs mx-1">→</span> {inst.grantee}
                        </CardTitle>
                      </div>
                      <div className="text-right font-mono text-[10px]">
                        <p className="text-slate-400">Execution: {inst.executionDate}</p>
                        <p className="text-slate-500">Recorded: {inst.recordingDate}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-slate-500 uppercase text-[10px]">Recording Reference</span>
                        <p className="text-slate-300">Vol {inst.book}, Pg {inst.page} <span className="text-slate-500">({inst.docNumber})</span></p>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 uppercase text-[10px]">Tract Linkage</span>
                        <p className="text-amber-300/80 truncate max-w-[200px]">{inst.legalDescription}</p>
                      </div>
                    </div>
                    {inst.notes && (
                      <div className="bg-slate-900/50 rounded p-3 border border-slate-800/40 text-xs text-slate-400">
                        <span className="text-slate-500 font-semibold mb-1 block">Instrument Notes & Clauses:</span>
                        {inst.notes}
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
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
