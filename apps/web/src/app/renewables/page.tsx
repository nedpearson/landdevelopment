'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Sun, Plus, Zap, MapPin, Layers } from 'lucide-react';

export default function RenewablesPage() {
  const projects = [
    {
      id: 'ren-1',
      projectName: 'Costilla Solar Array Phase 1',
      developer: 'NextEra Energy Resources',
      projectType: 'SOLAR_PLUS_STORAGE',
      targetAcres: 800.0,
      optionFeePerAcre: 50.0,
      leaseFeePerAcre: 850.0,
      interconnectStatus: 'QUEUE_POSITION_APPROVED',
      substationDistanceMiles: 1.8,
      status: 'OPTION_AGREEMENT_ACTIVE',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" /> Renewable Energy Site Control (Solar, Wind & Storage)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Solar, wind, battery storage, and carbon capture acreage assemblage, option terms, and interconnect proximity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Renewable Project
          </Button>
        </div>
      </div>

      {/* Renewables Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Renewable Site Control Projects</CardTitle>
          <CardDescription>Target acreage, option rate/ac, commercial lease rate/ac, interconnect status, and distance to substation</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Project Name</th>
                <th className="p-3">Developer</th>
                <th className="p-3">Project Type</th>
                <th className="p-3">Target Acres</th>
                <th className="p-3">Option Rate</th>
                <th className="p-3">Lease Rate</th>
                <th className="p-3">Substation Dist</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-amber-400">{p.projectName}</td>
                  <td className="p-3 text-slate-200">{p.developer}</td>
                  <td className="p-3 font-semibold text-white">{p.projectType.replace('_', ' ')}</td>
                  <td className="p-3 text-white">{p.targetAcres} AC</td>
                  <td className="p-3 text-emerald-400 font-bold">${p.optionFeePerAcre.toFixed(2)} / AC / yr</td>
                  <td className="p-3 text-emerald-400 font-bold">${p.leaseFeePerAcre.toFixed(2)} / AC / yr</td>
                  <td className="p-3 text-purple-300">{p.substationDistanceMiles} mi</td>
                  <td className="p-3">
                    <Badge variant="success font-mono">{p.status}</Badge>
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
