'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Receipt, Clock, Car, DollarSign, Download, Plus, CheckCircle2 } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" /> Landman Fieldwork Time, Mileage & Client Billing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track daily landman hours, mileage, per diem, recording fees, and generate client invoice packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export Client Invoice (PDF / CSV)
          </Button>
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Log Time & Expense Entry
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
        <Card>
          <span className="text-slate-400 font-semibold">Total Unbilled Hours</span>
          <h3 className="text-2xl font-bold text-white mt-1">42.5 Hrs</h3>
          <span className="text-[10px] text-emerald-400">@ $85.00 / hr = $3,612.50</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Total Mileage</span>
          <h3 className="text-2xl font-bold text-white mt-1">340 Miles</h3>
          <span className="text-[10px] text-emerald-400">@ $0.67 / mi = $227.80</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Recording & Courthouse Expenses</span>
          <h3 className="text-2xl font-bold text-amber-300 mt-1">$485.00</h3>
          <span className="text-[10px] text-slate-400">Certified Copies & Book Search</span>
        </Card>

        <Card>
          <span className="text-slate-400 font-semibold">Pending Client Invoice Total</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">$4,325.30</h3>
          <span className="text-[10px] text-emerald-400">Pioneer Natural Resources</span>
        </Card>
      </div>

      {/* Time & Expense Log Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Fieldwork Time & Expense Entries</CardTitle>
          <CardDescription>Itemized breakdown by project, landman, rate card, and expense category</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Landman</th>
                <th className="p-3">Project / Tract</th>
                <th className="p-3">Hours</th>
                <th className="p-3">Mileage</th>
                <th className="p-3">Expenses</th>
                <th className="p-3">Category</th>
                <th className="p-3">Total Billed</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-white">2026-04-14</td>
                <td className="p-3">Marcus Vance</td>
                <td className="p-3 text-slate-300">Permian Wolfcamp (T-104)</td>
                <td className="p-3">8.0 hrs ($680)</td>
                <td className="p-3">120 mi ($80.40)</td>
                <td className="p-3 text-amber-300">$140.00</td>
                <td className="p-3 text-slate-400">Certified Deed Copies</td>
                <td className="p-3 font-bold text-emerald-400">$900.40</td>
                <td className="p-3">
                  <Badge variant="warning">UNBILLED</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
