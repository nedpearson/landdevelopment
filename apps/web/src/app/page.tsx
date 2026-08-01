'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { STAGE_LABELS, PropertyLifecycleStage } from '@land-intelligence/domain';
import {
  Compass,
  MapPin,
  Users,
  FileCheck,
  Building2,
  TrendingUp,
  DollarSign,
  Layers,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Pearson Developments</h1>
            <Badge variant="success">Production Operational</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time land investment lifecycle & energy-land operations hub across active market acquisitions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/discover">
            <Button variant="outline" size="sm" icon={<MapPin className="w-4 h-4" />}>
              Discover New Parcels
            </Button>
          </Link>
          <Link href="/ai">
            <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Active Pipeline</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">14 Parcels</h3>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3 h-3" /> +3 added this week
            </p>
          </div>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Capital Deployed</span>
            <div className="p-2 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/60">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">$48,200</h3>
            <p className="text-[11px] text-slate-400 mt-1">Across 3 owned properties</p>
          </div>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Verified Comps Engine</span>
            <div className="p-2 rounded-lg bg-sky-950/60 text-sky-400 border border-sky-800/60">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">4.8 / 5.0</h3>
            <p className="text-[11px] text-sky-400 mt-1">Spatial distance & access adjusted</p>
          </div>
        </Card>

        <Card className="border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Owner Finance Servicing</span>
            <div className="p-2 rounded-lg bg-purple-950/60 text-purple-400 border border-purple-800/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-white tracking-tight">$1,450 / mo</h3>
            <p className="text-[11px] text-purple-400 mt-1">100% On-time note performance</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
