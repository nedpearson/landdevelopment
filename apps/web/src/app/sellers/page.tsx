'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Users, Mail, Phone, Calendar, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SellersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Seller CRM & Multi-Channel Outreach Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage seller relationships, direct mail campaign responses, phone logs, and offer delivery timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add New Seller Record
          </Button>
        </div>
      </div>

      {/* Seller CRM Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Seller Pipeline</CardTitle>
          <CardDescription>Seller motivation levels, contact timeline, asking price, and offer status</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Seller Name</th>
                <th className="p-3">Associated Property</th>
                <th className="p-3">Contact Email / Phone</th>
                <th className="p-3">Motivation Level</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">Estate of Henry T. Miller</td>
                <td className="p-3 text-emerald-400">APN: 123-456-789 (160 AC)</td>
                <td className="p-3">miller.trust@example.com</td>
                <td className="p-3">
                  <Badge variant="danger">HIGH MOTIVATION</Badge>
                </td>
                <td className="p-3 text-slate-200">$75,000</td>
                <td className="p-3">2026-04-12</td>
                <td className="p-3">
                  <Badge variant="warning">OFFER SENT (AWAITING SIGNATURE)</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
