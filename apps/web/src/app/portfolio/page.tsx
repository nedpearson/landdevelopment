'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Building2, Download, TrendingUp, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" /> Portfolio Intelligence & Owner-Financing Servicing
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track cost basis, capital deployed, note servicing cash flow, and export accounting ledgers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />}>
            Export to QuickBooks / Xero CSV
          </Button>
        </div>
      </div>

      {/* Portfolio Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <span className="text-xs text-slate-400">Total Capital Deployed</span>
          <h3 className="text-2xl font-bold text-white mt-1">$48,200</h3>
          <span className="text-[10px] text-slate-400">3 Holdings</span>
        </Card>

        <Card>
          <span className="text-xs text-slate-400">Monthly Note Cash Flow</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">$842.50 / mo</h3>
          <span className="text-[10px] text-emerald-400">3 Active Notes (0 Delinquent)</span>
        </Card>

        <Card>
          <span className="text-xs text-slate-400">Total Realized Profit (YTD)</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">$34,500</h3>
          <span className="text-[10px] text-emerald-400">Avg IRR: 38.4%</span>
        </Card>

        <Card>
          <span className="text-xs text-slate-400">Unrealized Portfolio Equity</span>
          <h3 className="text-2xl font-bold text-white mt-1">$58,800</h3>
          <span className="text-[10px] text-slate-400">Based on verified comps</span>
        </Card>
      </div>

      {/* Active Owner-Finance Note Servicing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Owner-Financed Notes</CardTitle>
          <CardDescription>Payment status, amortization schedules, and late-fee tracking</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="p-3">Property / APN</th>
                <th className="p-3">Buyer Name</th>
                <th className="p-3">Financed Amount</th>
                <th className="p-3">Interest Rate</th>
                <th className="p-3">Monthly Payment</th>
                <th className="p-3">Next Due Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3 font-semibold text-white">APN: 123-456-789 (Costilla, CO)</td>
                <td className="p-3">Mountain West Land LLC</td>
                <td className="p-3">$13,050</td>
                <td className="p-3 text-emerald-400">9.9% APR</td>
                <td className="p-3 font-bold text-emerald-400">$276.54 / mo</td>
                <td className="p-3">2026-06-01</td>
                <td className="p-3">
                  <Badge variant="success">CURRENT (AutoPay Active)</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
