'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Compass, TrendingUp, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" /> Target Market Discovery & Ranking Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Rank U.S. counties by absorption rate, price trends, tax burden, population migration, and buyer liquidity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-800 bg-slate-900">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-sm">Costilla County, CO</h3>
              <Badge variant="success">Rank #1 (Score 92)</Badge>
            </div>
            <p className="text-slate-400">Strategy: Rural Off-Grid & Recreational</p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Avg Price / AC:</span>
                <span>$4,200</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Days on Market:</span>
                <span>42 Days</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Buyer Liquidity Index:</span>
                <span>HIGH (88/100)</span>
              </div>
            </div>
            <Link href="/discover">
              <Button variant="primary" size="sm" className="w-full mt-2">
                Discover Parcels in Costilla
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-sm">Elko County, NV</h3>
              <Badge variant="info">Rank #2 (Score 86)</Badge>
            </div>
            <p className="text-slate-400">Strategy: Agricultural & Ranching Lots</p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Avg Price / AC:</span>
                <span>$3,100</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Days on Market:</span>
                <span>58 Days</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Buyer Liquidity Index:</span>
                <span>MODERATE (76/100)</span>
              </div>
            </div>
            <Link href="/discover">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Discover Parcels in Elko
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-white text-sm">Hudspeth County, TX</h3>
              <Badge variant="warning">Rank #3 (Score 79)</Badge>
            </div>
            <p className="text-slate-400">Strategy: Cheap Acreage & Long-term Appreciation</p>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Avg Price / AC:</span>
                <span>$1,400</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Days on Market:</span>
                <span>75 Days</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Buyer Liquidity Index:</span>
                <span>MODERATE (68/100)</span>
              </div>
            </div>
            <Link href="/discover">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Discover Parcels in Hudspeth
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
