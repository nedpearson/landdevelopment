'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Megaphone, Sparkles, Copy, Eye, Send } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-400" /> Property Disposition & Listing Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate high-converting property descriptions, seller-financing summaries, and landing pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
            Generate AI Listing Copy
          </Button>
        </div>
      </div>

      <Card className="border-emerald-900/40">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Listing Assets for APN 123-456-789 (5.2 AC - Costilla, CO)</CardTitle>
              <CardDescription>Generated listing copy with verified attributes and seller financing terms</CardDescription>
            </div>
            <Badge variant="success">Ready for Publication</Badge>
          </div>
        </CardHeader>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200">Headline & Description</span>
              <Button variant="ghost" size="sm" icon={<Copy className="w-3.5 h-3.5" />}>
                Copy Listing
              </Button>
            </div>
            <h3 className="text-sm font-bold text-emerald-400">
              🌲 5.2 Acres of Mountain Freedom in Costilla County, CO | $1,450 Down & $276/mo!
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Escape the city to your private 5.2-acre off-grid haven near San Luis! Perfect for seasonal camping, mobile home living, or building your off-grid solar homestead. Fronts county-maintained dirt road with 320 feet of road frontage and zero flood zone or wetland exposure.
            </p>
            <div className="pt-2 text-[11px] text-emerald-300 font-mono">
              <strong>Owner Financing Terms:</strong> $14,500 Total Price | $1,450 Down | $276.54/mo for 60 months | No Credit Check!
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
