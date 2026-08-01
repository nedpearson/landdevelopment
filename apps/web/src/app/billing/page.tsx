'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Receipt, Plus, DollarSign, Calendar, Clock, FileText } from 'lucide-react';

export default function BillingPage() {
  const entries = [
    {
      id: 'bil-1',
      date: '2026-04-10',
      landmanName: 'Sarah Jenkins, CPL',
      clientName: 'Pioneer Natural Resources',
      projectRef: 'Permian Basin Wolfcamp Prospect',
      hoursWorked: 8.5,
      hourlyRateUsd: 85.0,
      mileage: 142,
      mileageRateUsd: 0.67,
      expensesUsd: 45.0,
      notes: 'Courthouse runsheet search in Reeves County Clerk office (Vols 80-92)',
      totalBilledUsd: 862.64,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" /> Client Billing & Landman Fieldwork Time
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Log daily landman hours, mileage tracking ($0.67/mi IRS rate), per diem, courthouse recording fees, and generate client billing packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Log Time & Mileage
          </Button>
        </div>
      </div>

      {/* Billing Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Unbilled Fieldwork Entry Directory</CardTitle>
          <CardDescription>Landman specialist, client, hours, mileage, courthouse expenses, and total daily billing</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Landman Specialist</th>
                <th className="p-3">Client / Project</th>
                <th className="p-3">Hours (Rate)</th>
                <th className="p-3">Mileage ($0.67/mi)</th>
                <th className="p-3">Courthouse Expenses</th>
                <th className="p-3">Total Daily Bill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-white">{e.date}</td>
                  <td className="p-3 text-amber-400 font-bold">{e.landmanName}</td>
                  <td className="p-3 text-slate-200">{e.clientName}</td>
                  <td className="p-3 text-white">{e.hoursWorked} hrs (${e.hourlyRateUsd}/hr)</td>
                  <td className="p-3 text-slate-300">{e.mileage} mi (${(e.mileage * e.mileageRateUsd).toFixed(2)})</td>
                  <td className="p-3 text-amber-300">${e.expensesUsd.toFixed(2)}</td>
                  <td className="p-3 text-emerald-400 font-bold">${e.totalBilledUsd.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
