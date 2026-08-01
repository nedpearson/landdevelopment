'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { ShieldCheck, AlertTriangle, Plus, CheckCircle2, FileText } from 'lucide-react';

export default function CurativePage() {
  const defects = [
    {
      id: 'cur-1',
      defectTitle: 'Unrecorded Foreign Probate in Reeves County, TX',
      tractRef: 'Tract #T-104',
      severity: 'CRITICAL_BLOCKER',
      assignedLandman: 'Sarah Jenkins, CPL',
      curativeStatus: 'IN_PROGRESS',
      requiredDoc: 'Affidavit of Heirship signed by 2 disinterested witnesses',
      targetDate: '2026-05-15',
    },
    {
      id: 'cur-2',
      defectTitle: 'Unreleased Mortgagor Lien (First National Bank 1978)',
      tractRef: 'Tract #T-105',
      severity: 'MINOR',
      assignedLandman: 'Marcus Vance, RL',
      curativeStatus: 'CLEARED',
      requiredDoc: 'Satisfaction of Lien & Deed of Trust Release',
      targetDate: '2026-04-01',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" /> Title Curative Center & Defect Resolution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Resolve title opinion requirements, cure probate gaps, satisfy outstanding liens, and track curative document execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Curative Item
          </Button>
        </div>
      </div>

      {/* Curative Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Curative Requirements Directory</CardTitle>
          <CardDescription>Track defects, assigned specialists, required curative instruments, and completion status</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Defect Description</th>
                <th className="p-3">Tract Ref</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Assigned Specialist</th>
                <th className="p-3">Required Document</th>
                <th className="p-3">Target Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {defects.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{d.defectTitle}</td>
                  <td className="p-3 text-amber-400 font-bold">{d.tractRef}</td>
                  <td className="p-3">
                    <Badge variant={d.severity === 'CRITICAL_BLOCKER' ? 'danger' : 'info'}>
                      {d.severity.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-200">{d.assignedLandman}</td>
                  <td className="p-3 text-slate-300 truncate max-w-[220px]">{d.requiredDoc}</td>
                  <td className="p-3 text-slate-400">{d.targetDate}</td>
                  <td className="p-3">
                    <Badge variant={d.curativeStatus === 'CLEARED' ? 'success' : 'warning'}>
                      {d.curativeStatus.replace('_', ' ')}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
