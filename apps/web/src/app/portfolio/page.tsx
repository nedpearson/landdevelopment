'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Building2, DollarSign, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" /> Portfolio Holdings & Note Servicing Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track owned inventory, cost basis, unrealized profit, seller-financing notes, interest collected, and payment schedules.
          </p>
        </div>
        <Badge variant="success">3 Owned Holdings | 1 Note Active</Badge>
      </div>

      {/* Portfolio Holdings Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Owned Land Inventory</CardTitle>
          <CardDescription>Property APN, acquisition date, purchase cost basis, market value, and holding days</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">APN / Location</th>
                <th className="p-3">Acquisition Date</th>
                <th className="p-3">Purchase Price</th>
                <th className="p-3">Total Cost Basis</th>
                <th className="p-3">Est. Current Value</th>
                <th className="p-3">Unrealized Profit</th>
                <th className="p-3">Holding Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">APN: 123-456-789 (Costilla, CO)</td>
                <td className="p-3">2026-02-10</td>
                <td className="p-3">$10,800</td>
                <td className="p-3 text-slate-200">$11,200</td>
                <td className="p-3 text-emerald-400 font-bold">$24,000</td>
                <td className="p-3 text-emerald-400 font-bold">+$12,800 (+114%)</td>
                <td className="p-3">
                  <Badge variant="info">OWNED HELD</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Seller Financing Servicing Card */}
      <Card className="border-purple-900/40 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-purple-300">Active Owner Finance Notes Servicing</CardTitle>
          <CardDescription>Monthly payment schedule, principal/interest collection, and buyer balance</CardDescription>
        </CardHeader>

        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-2">
          <div className="flex justify-between items-center text-slate-200">
            <span>Buyer Name: Marcus Vance</span>
            <Badge variant="success">CURRENT — ON TIME</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] uppercase">Monthly Payment</span>
              <p className="font-bold text-white mt-0.5">$250.00 / mo</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase">Current Balance</span>
              <p className="font-bold text-amber-300 mt-0.5">$14,250.00</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase">Interest Rate</span>
              <p className="font-bold text-slate-200 mt-0.5">9.9% APR</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase">Next Due Date</span>
              <p className="font-bold text-emerald-400 mt-0.5">2026-05-01</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
