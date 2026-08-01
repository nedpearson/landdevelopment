'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Layers, CheckCircle2, Clock, ShieldCheck, FileText } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Closing Pipeline & Escrow Transactions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track title commitment closing milestones, escrow funds, deed recordation, and buyer closing statements.
          </p>
        </div>
        <Badge variant="success">1 Closing Scheduled</Badge>
      </div>

      {/* Closing Pipeline Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Closings & Escrow Deals</CardTitle>
          <CardDescription>Property, title company, purchase price, earnest money deposit, and closing date</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Property APN</th>
                <th className="p-3">Title / Escrow Company</th>
                <th className="p-3">Purchase Price</th>
                <th className="p-3">Earnest Money</th>
                <th className="p-3">Target Closing Date</th>
                <th className="p-3">Deed Recordation</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">APN: 123-456-789 (Costilla, CO)</td>
                <td className="p-3 text-slate-200">First American Title Co</td>
                <td className="p-3 text-emerald-400 font-bold">$10,800</td>
                <td className="p-3 text-slate-300">$1,000 (Deposited)</td>
                <td className="p-3">2026-05-15</td>
                <td className="p-3">
                  <Badge variant="warning">DEED DRAFTED</Badge>
                </td>
                <td className="p-3">
                  <Badge variant="success">IN ESCROW</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
