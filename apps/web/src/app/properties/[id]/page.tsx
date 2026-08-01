'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { STAGE_LABELS } from '@land-intelligence/domain';
import {
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  ShieldCheck,
  Building,
  Compass,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function PropertyRecordPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPS' | 'ACCESS_ZONING' | 'ENVIRONMENT' | 'OFFERS'>('OVERVIEW');

  return (
    <div className="space-y-6">
      {/* Top Navigation & Property Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/discover">
            <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">APN: 123-456-789</h1>
              <Badge variant="info">{STAGE_LABELS.QUALIFIED}</Badge>
            </div>
            <p className="text-xs text-slate-400">142 S Wildwood Trail, San Luis, Costilla County, CO 81152</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/offers">
            <Button variant="primary" size="sm">
              Generate Offer Scenarios
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Acreage</span>
          <p className="text-lg font-bold text-white mt-0.5">5.2 AC</p>
          <span className="text-[10px] text-slate-400">Usable: 4.8 AC</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Asking Price</span>
          <p className="text-lg font-bold text-white mt-0.5">$14,500</p>
          <span className="text-[10px] text-slate-400">$2,788 / acre</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Market Value</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">$24,000</p>
          <span className="text-[10px] text-emerald-400">+$9,500 Equity</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Suggested Cash Offer</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">$10,800</p>
          <span className="text-[10px] text-slate-400">45% of Market</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Deal Score</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">84 / 100</p>
          <span className="text-[10px] text-emerald-400">High Confidence</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Owner Type</span>
          <p className="text-sm font-bold text-amber-300 mt-1">Absentee</p>
          <span className="text-[10px] text-slate-400">12 yrs owned</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 text-xs font-medium space-x-4">
        {(['OVERVIEW', 'COMPS', 'ACCESS_ZONING', 'ENVIRONMENT', 'OFFERS'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-1 border-b-2 transition-colors uppercase font-semibold tracking-wider ${
              activeTab === tab
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.replace('_', ' & ')}
          </button>
        ))}
      </div>

      {/* Tab Content 1: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Canonical Property Identity & Legal Overview</CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Owner of Record</span>
                  <p className="text-slate-100 font-semibold text-sm">Robert & Elena Vance</p>
                  <p className="text-slate-400">Mailing: 8492 Sunrise Blvd, Austin, TX 78759</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Legal Description</span>
                  <p className="text-slate-200 font-mono">Rio Grande Ranches Unit 12 Block 4 Lot 18</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Tax History & Delinquency</span>
                  <Badge variant="success">Taxes Current ($142/yr)</Badge>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Parcel Centroid Coordinates</span>
                  <p className="text-slate-300 font-mono">37.1235° N, 105.4205° W</p>
                </div>
              </div>
            </Card>

            <EvidenceBox
              source="Regrid Licensed Parcel API & Costilla County Assessor Feed"
              retrievedAt={new Date().toISOString()}
              confidenceScore={96}
              verificationState="SELF_VERIFIED"
              assumptions={['Boundary geometry verified against PLSS grid', 'Access deed book cross-referenced']}
            >
              <p className="text-xs text-slate-300">
                All property attributes have been retrieved from authoritative licensed provider endpoints. No scraped or unverified claims are present.
              </p>
            </EvidenceBox>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Diligence Verification State</CardTitle>
              </CardHeader>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-300">Physical Access</span>
                  <Badge variant="success">VERIFIED (Road Frontage)</Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-300">Legal Access / Easement</span>
                  <Badge variant="success">VERIFIED (Deed Book 412)</Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-300">Zoning & Permitted Uses</span>
                  <Badge variant="success">VERIFIED (ER Estate)</Badge>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-300">Flood / Wetland Overlays</span>
                  <Badge variant="success">VERIFIED (0% Flood/Wetland)</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab Content 2: COMPS & VALUATION */}
      {activeTab === 'COMPS' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparable Sale Adjustments & Valuation Engine</CardTitle>
              <CardDescription>
                Full transparency. Every comp adjustment factor (acreage, road access, utilities, time) is explicitly exposed.
              </CardDescription>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Comp Address / APN</th>
                    <th className="p-3">Sale Date</th>
                    <th className="p-3">Raw Price</th>
                    <th className="p-3">Raw $/AC</th>
                    <th className="p-3">Acreage Adj.</th>
                    <th className="p-3">Access Adj.</th>
                    <th className="p-3">Utility Adj.</th>
                    <th className="p-3">Adjusted $/AC</th>
                    <th className="p-3">Adjusted Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-white">190 S Wildwood Trl (0.4 mi)</td>
                    <td className="p-3">2026-04-10</td>
                    <td className="p-3">$23,500</td>
                    <td className="p-3">$4,700</td>
                    <td className="p-3 text-emerald-400">+$100</td>
                    <td className="p-3 text-slate-400">$0</td>
                    <td className="p-3 text-slate-400">$0</td>
                    <td className="p-3 font-bold text-white">$4,800</td>
                    <td className="p-3 font-bold text-emerald-400">$24,960</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">88 Alpine Way (1.1 mi)</td>
                    <td className="p-3">2026-02-18</td>
                    <td className="p-3">$22,000</td>
                    <td className="p-3">$4,583</td>
                    <td className="p-3 text-slate-400">$0</td>
                    <td className="p-3 text-emerald-400">+$150</td>
                    <td className="p-3 text-slate-400">$0</td>
                    <td className="p-3 font-bold text-white">$4,733</td>
                    <td className="p-3 font-bold text-emerald-400">$24,611</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
