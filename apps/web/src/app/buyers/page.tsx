'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { ShoppingBag, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';

export default function BuyersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" /> Buyer CRM & Explainable Disposition Matching
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Match inventory with active land buyers based on territory, budget, acreage, and financing preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add New Buyer
          </Button>
        </div>
      </div>

      {/* Matching Results for Property APN 123-456-789 */}
      <Card className="border-emerald-900/40">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-emerald-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Recommended Buyers for APN 123-456-789 (5.2 AC - Costilla, CO)
              </CardTitle>
              <CardDescription>Matching criteria evaluated against 48 registered VIP cash & term buyers</CardDescription>
            </div>
            <Badge variant="success">2 High Confidence Matches</Badge>
          </div>
        </CardHeader>

        <div className="space-y-3 text-xs">
          {/* Match 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  Mountain West Land Fund LLC <UserCheck className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-slate-400">Contact: David Miller | mwestland@gmail.com | (303) 555-0188</p>
              </div>
              <Badge variant="success">95% Match Score</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 text-[11px]">
              <div>
                <span className="text-slate-400 font-semibold">Matched Criteria:</span>
                <ul className="list-disc list-inside text-emerald-300 space-y-0.5 mt-0.5">
                  <li>State & County Match (Costilla, CO)</li>
                  <li>Acreage (5.2 AC within [2 - 20 AC] target)</li>
                  <li>Price ($24,000 below $35,000 max budget)</li>
                  <li>Verified VIP Cash Buyer (Proof of Funds on file)</li>
                </ul>
              </div>
              <div className="flex flex-col justify-between items-end">
                <Badge variant="info">Action: Immediate Outreach Recommended</Badge>
                <Button variant="primary" size="sm">
                  Send Property Deal Sheet
                </Button>
              </div>
            </div>
          </div>

          {/* Match 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-sm">Alpine RV & Recreational Holdings</h3>
                <p className="text-slate-400">Contact: Sarah Connor | sconnor@alpinesites.com</p>
              </div>
              <Badge variant="warning">82% Match Score</Badge>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/60 text-[11px] flex justify-between items-center">
              <span className="text-slate-300">Prefers Owner Financing ($2,500 down / $300/mo)</span>
              <Button variant="outline" size="sm">
                Send Terms Proposal
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
