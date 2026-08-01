'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Zap, MapPin, DollarSign, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RightOfWayPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Right-of-Way (ROW) & Infrastructure Corridor Operations
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage pipeline, electric transmission, fiber, and utility easement acquisitions, survey stationing, and damage settlements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add ROW Segment
          </Button>
        </div>
      </div>

      {/* ROW Corridor Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <Card>
          <span className="text-slate-400 font-semibold">Total Corridor Length</span>
          <h3 className="text-2xl font-bold text-white mt-1">480.0 Rods</h3>
          <span className="text-[10px] text-slate-400">1.5 Miles Corridor</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Max Authority Rate</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">$250 / Rod</h3>
          <span className="text-[10px] text-emerald-400">+$1,500 / ac Surface Damage</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Signed Easements</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">12 / 14 Tracts</h3>
          <span className="text-[10px] text-emerald-400">85.7% Corridor Cleared</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Holdout / Condemnation Risk</span>
          <h3 className="text-2xl font-bold text-amber-400 mt-1">1 Tract</h3>
          <span className="text-[10px] text-amber-400">Tract #ROW-104 (In Negotiation)</span>
        </Card>
      </div>

      {/* ROW Alignment Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>ROW Segment & Damage Settlement Schedule</CardTitle>
          <CardDescription>Survey stationing, permanent vs temporary workspace acres, price per rod, and damage calculations</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Tract #</th>
                <th className="p-3">Landowner</th>
                <th className="p-3">Stationing</th>
                <th className="p-3">Length (Rods)</th>
                <th className="p-3">Perm Acres</th>
                <th className="p-3">Temp Acres</th>
                <th className="p-3">Rate / Rod</th>
                <th className="p-3">Crop / Surface Damage</th>
                <th className="p-3">Total Offer</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-bold text-white">ROW-101</td>
                <td className="p-3">Eagle Ranch LLC</td>
                <td className="p-3">10+00 to 22+50</td>
                <td className="p-3">75.7 Rods</td>
                <td className="p-3">1.43 AC</td>
                <td className="p-3">0.72 AC</td>
                <td className="p-3">$250</td>
                <td className="p-3 text-emerald-400">$3,200</td>
                <td className="p-3 font-bold text-emerald-400">$22,125</td>
                <td className="p-3">
                  <Badge variant="success">EASEMENT SIGNED</Badge>
                </td>
              </tr>

              <tr>
                <td className="p-3 font-bold text-white">ROW-104</td>
                <td className="p-3">Miller Family Trust</td>
                <td className="p-3">45+00 to 60+00</td>
                <td className="p-3">90.9 Rods</td>
                <td className="p-3">1.72 AC</td>
                <td className="p-3">0.86 AC</td>
                <td className="p-3">$250</td>
                <td className="p-3 text-emerald-400">$4,500</td>
                <td className="p-3 font-bold text-amber-300">$27,225</td>
                <td className="p-3">
                  <Badge variant="warning">COUNTEROFFER PENDING</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
