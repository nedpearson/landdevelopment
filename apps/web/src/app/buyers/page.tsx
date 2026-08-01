'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { ShoppingBag, CheckCircle2, UserCheck, ShieldCheck, Mail } from 'lucide-react';

export default function BuyersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" /> Buyer Matching CRM & Preference Criteria
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Verified cash buyers, terms buyers, proof of funds status, target counties, and 0-100 property match scoring.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add Cash Buyer
          </Button>
        </div>
      </div>

      {/* Buyer Directory Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Verified Buyer Directory</CardTitle>
          <CardDescription>Target regions, maximum budget, proof-of-funds verification, and terms preference</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Buyer Name</th>
                <th className="p-3">Email / Contact</th>
                <th className="p-3">Target Counties</th>
                <th className="p-3">Max Budget</th>
                <th className="p-3">POF Verified</th>
                <th className="p-3">Purchased Count</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Apex Land Holdings LLC</td>
                <td className="p-3">acquisitions@apexland.com</td>
                <td className="p-3 text-emerald-400">Costilla CO, Elko NV</td>
                <td className="p-3 text-slate-200">$250,000</td>
                <td className="p-3">
                  <Badge variant="success">POF VERIFIED ($500K)</Badge>
                </td>
                <td className="p-3">4 Properties</td>
                <td className="p-3">
                  <Button variant="outline" size="sm">
                    Match Properties
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
