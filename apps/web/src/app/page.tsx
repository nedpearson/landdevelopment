'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { LIFECYCLE_STAGES_ORDERED, STAGE_LABELS } from '@land-intelligence/domain';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Executive Dashboard & Operations Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time land investment lifecycle intelligence across all active markets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/discover">
            <Button variant="primary" size="sm">
              Discover New Parcels
            </Button>
          </Link>
          <Link href="/ai">
            <Button variant="outline" size="sm" icon={<Sparkles className="w-3.5 h-3.5 text-emerald-400" />}>
              Ask AI Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Total Active Pipeline</p>
              <h3 className="text-2xl font-bold text-white mt-1">14 Parcels</h3>
              <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +3 added this week
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Capital Deployed</p>
              <h3 className="text-2xl font-bold text-white mt-1">$48,200</h3>
              <p className="text-[11px] text-slate-400 mt-1">Across 3 owned properties</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Projected Resale Profit</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">$58,800</h3>
              <p className="text-[11px] text-emerald-400 mt-1">Avg 122% Cash-on-Cash</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-slate-400">Pending Actions</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1">2 Offers / 1 Diligence</h3>
              <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Requires human approval
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Grounded Insight & Actionable Recommendations */}
      <Card glass className="border-emerald-900/40">
        <CardHeader>
          <CardTitle className="text-emerald-400">
            <Sparkles className="w-5 h-5" /> Grounded AI Market Intelligence
          </CardTitle>
          <CardDescription>
            Provenanced insights based on live county data feeds, verified comps, and buyer demand matching.
          </CardDescription>
        </CardHeader>

        <EvidenceBox
          source="Costilla CO & Elko NV Unified Data Feed"
          retrievedAt={new Date().toISOString()}
          confidenceScore={94}
          verificationState="ATTORNEY_VERIFIED"
          assumptions={['Comps restricted to last 180 days', 'Acreage tolerance within +/- 20%']}
        >
          <div className="space-y-2 py-1">
            <p className="text-xs text-slate-200">
              <strong>Key Recommendation:</strong> Parcel <strong>APN 123-456-789 (Costilla, CO)</strong> has completed Quick Screen with an <strong>84/100 Deal Score</strong>. 
              The verified seller is absentee with 12 years of ownership. Suggested cash offer is <strong>$10,800</strong> (resale value $24,000).
            </p>
          </div>
        </EvidenceBox>
      </Card>

      {/* Lifecycle Pipeline Kanban Overview */}
      <Card>
        <CardHeader>
          <CardTitle>17-Stage Continuous Property Lifecycle Pipeline</CardTitle>
          <CardDescription>
            One single canonical lifecycle state for every property record. No duplicate modules.
          </CardDescription>
        </CardHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {LIFECYCLE_STAGES_ORDERED.slice(0, 12).map((stage, idx) => {
            const count = idx === 1 ? 4 : idx === 4 ? 3 : idx === 6 ? 2 : idx === 8 ? 2 : 1;
            return (
              <div
                key={stage}
                className="p-3 rounded-lg border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between h-24 hover:border-emerald-700/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                    {count}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-200 line-clamp-2 leading-tight">
                  {STAGE_LABELS[stage]}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Active High Priority Items Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Active Priority Properties</CardTitle>
            <CardDescription>Properties requiring review, underwriting, or offer dispatches</CardDescription>
          </div>
          <Link href="/discover">
            <Button variant="ghost" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              View All Properties
            </Button>
          </Link>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">APN / Location</th>
                <th className="p-3">Acreage</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Est. Resale</th>
                <th className="p-3">Deal Score</th>
                <th className="p-3">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">
                  <Link href="/properties/prop-001" className="hover:underline text-emerald-400">
                    123-456-789
                  </Link>
                  <p className="text-[11px] text-slate-400 font-normal">Costilla County, CO</p>
                </td>
                <td className="p-3">5.2 ac</td>
                <td className="p-3">
                  <Badge variant="info">QUALIFIED</Badge>
                </td>
                <td className="p-3">$14,500</td>
                <td className="p-3 text-emerald-400 font-semibold">$24,000</td>
                <td className="p-3">
                  <Badge variant="success">84 / 100</Badge>
                </td>
                <td className="p-3">
                  <Link href="/offers">
                    <Button variant="primary" size="sm">
                      Approve Offer
                    </Button>
                  </Link>
                </td>
              </tr>

              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">
                  <Link href="/properties/prop-002" className="hover:underline text-emerald-400">
                    987-654-321
                  </Link>
                  <p className="text-[11px] text-slate-400 font-normal">Elko County, NV</p>
                </td>
                <td className="p-3">10.0 ac</td>
                <td className="p-3">
                  <Badge variant="warning">UNDERWRITING</Badge>
                </td>
                <td className="p-3">$18,000</td>
                <td className="p-3 text-emerald-400 font-semibold">$32,000</td>
                <td className="p-3">
                  <Badge variant="warning">78 / 100</Badge>
                </td>
                <td className="p-3">
                  <Link href="/underwriting">
                    <Button variant="outline" size="sm">
                      Verify Road Access
                    </Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
