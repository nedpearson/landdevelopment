'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Sun, Wind, Battery, Zap, ShieldCheck, CheckCircle2, MapPin } from 'lucide-react';

export default function RenewablesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" /> Renewable Energy Site Control & Land Assemblage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Site control administration for solar, wind, battery storage, carbon capture, and pore-space projects.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add Renewable Site
          </Button>
        </div>
      </div>

      {/* Renewable Project Status Overview */}
      <Card className="border-amber-900/40 bg-slate-900">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-white">Costilla Solar Array Phase 1 (800 AC Target)</CardTitle>
                <Badge variant="success">80.0% Site Control Controlled</Badge>
              </div>
              <CardDescription>Interconnection: San Luis 115kV Substation (1.2 miles distance)</CardDescription>
            </div>
            <Badge variant="info" className="font-mono">OPTION TERM: 5 YEARS ($45/AC/YR)</Badge>
          </div>
        </CardHeader>

        {/* Site Control Progress Bar */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Contiguous Acreage Controlled:</span>
            <span className="font-bold text-emerald-400">640.00 / 800.00 Acres</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full w-[80%]" />
          </div>
        </div>

        {/* Land Assemblage Tract Table */}
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-2.5">Parcel / APN</th>
                <th className="p-2.5">Landowner</th>
                <th className="p-2.5">Acreage</th>
                <th className="p-2.5">Agreement Type</th>
                <th className="p-2.5">Option Rent / Yr</th>
                <th className="p-2.5">Severed Minerals Risk</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-2.5 font-semibold text-white">APN: 123-456-789</td>
                <td className="p-2.5">Robert & Elena Vance</td>
                <td className="p-2.5">160.00 AC</td>
                <td className="p-2.5 text-amber-300">Solar Ground Lease Option</td>
                <td className="p-2.5 text-emerald-400">$7,200 / yr</td>
                <td className="p-2.5">
                  <Badge variant="warning">MINERAL SUBORDINATION REQ</Badge>
                </td>
                <td className="p-2.5">
                  <Badge variant="success">OPTION EXECUTED</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
