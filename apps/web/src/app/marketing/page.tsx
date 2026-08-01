'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Megaphone, Mail, Send, CheckCircle2, Copy } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" /> Marketing & Disposition Campaign Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate property email blasts, buyer SMS campaigns, direct mail letters, and social media listing packages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Launch New Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Generator Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Email Blast Listing Template</CardTitle>
            <CardDescription>Auto-generated buyer email listing with pricing and terms</CardDescription>
          </CardHeader>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <p className="font-bold text-emerald-400">Subject: 🎯 5.2 Acre Mountain View Parcel — Costilla County, CO ($250/mo Terms Available!)</p>
            <hr className="border-slate-800" />
            <p>APN: 123-456-789 | Costilla County, CO</p>
            <p>Cash Price: $16,000 | Terms: $1,500 Down, $250/mo for 72 months</p>
            <p>Legal Road Access Verified | $0 Back Taxes | Clear Title Commitment</p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="outline" size="sm" icon={<Copy className="w-3.5 h-3.5" />}>
              Copy Email Copy
            </Button>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Direct Mail Seller Acquisition Campaign</CardTitle>
            <CardDescription>Blind offer letter template for off-market land acquisition</CardDescription>
          </CardHeader>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
            <p className="font-bold text-amber-300">Dear Property Owner,</p>
            <p>Pearson Developments would like to make an all-cash offer of $10,800 to purchase your 5.2-acre parcel (APN 123-456-789) in Costilla County, CO.</p>
            <p>We pay all closing costs and back taxes. No Realtor commissions or fees.</p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
              Dispatch Mailer Batch
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
