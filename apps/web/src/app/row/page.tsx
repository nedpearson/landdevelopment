'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Zap, Plus, MapPin, DollarSign, Layers } from 'lucide-react';

export default function ROWPage() {
  const segments = [
    {
      id: 'row-1',
      segmentName: 'Delaware Gas Gathering Segment A-1',
      operator: 'Enterprise Products Partners',
      widthFeet: 50,
      lengthRods: 320,
      pricePerRodUsd: 150.0,
      totalDamageUsd: 48000.0,
      cropDamageUsd: 5000.0,
      status: 'OPTION_EXECUTED',
      county: 'Loving',
      state: 'TX',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Right-of-Way (ROW) Pipeline & Utility Corridors
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pipeline, electric transmission, fiber, and utility easement negotiations, rod damage pricing, and stationing.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add ROW Segment
          </Button>
        </div>
      </div>

      {/* ROW Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Right-of-Way Segments</CardTitle>
          <CardDescription>Segment stationing, width, rods, damage rate per rod, and option status</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Segment Name</th>
                <th className="p-3">Operator</th>
                <th className="p-3">Width / Rods</th>
                <th className="p-3">Rate / Rod</th>
                <th className="p-3">Easement Total</th>
                <th className="p-3">Crop Damage</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {segments.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-bold text-amber-400">{s.segmentName}</td>
                  <td className="p-3 text-slate-200">{s.operator}</td>
                  <td className="p-3 text-white">{s.widthFeet} ft ({s.lengthRods} rods)</td>
                  <td className="p-3 text-emerald-400 font-bold">${s.pricePerRodUsd.toFixed(2)} / rod</td>
                  <td className="p-3 text-emerald-400 font-bold">${s.totalDamageUsd.toLocaleString()}</td>
                  <td className="p-3 text-amber-300">${s.cropDamageUsd.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge variant="success font-mono">{s.status}</Badge>
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
