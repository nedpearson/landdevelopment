'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, FractionBadge, EstateBadge } from '@land-intelligence/ui';
import { MapPin, FileText, Scale, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CanonicalTractsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" /> Canonical Landman Tract Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Central operational record linking parcels, legal descriptions, depth intervals, severed mineral estates, leases, and title runsheets.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add New Land Tract
          </Button>
        </div>
      </div>

      {/* Tract Table & Inspection Cards */}
      <div className="space-y-4">
        {/* Tract Card 1 */}
        <Card className="border-amber-900/50 bg-slate-900">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white">TRACT # T-104 (Client Ref: #PNR-T104)</h2>
                  <Badge variant="warning">MINERAL TITLE IN PROGRESS</Badge>
                </div>
                <p className="text-xs text-slate-400">Reeves County, TX | Permian Basin | Formation: Wolfcamp A & B</p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/runsheets">
                  <Button variant="primary" size="sm" icon={<FileText className="w-3.5 h-3.5" />}>
                    Open Title Runsheet
                  </Button>
                </Link>
                <Link href="/ownership">
                  <Button variant="outline" size="sm" icon={<Scale className="w-3.5 h-3.5" />}>
                    NMA Ownership Calculator
                  </Button>
                </Link>
              </div>
            </div>

            {/* Acreage & Estate Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Gross Acres</span>
                <p className="text-sm font-bold text-white mt-0.5">160.00 AC</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Gross Mineral Acres</span>
                <p className="text-sm font-bold text-amber-300 mt-0.5">160.00 GMA</p>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Net Mineral Acres</span>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">40.00 NMA</p>
                <span className="text-[10px] text-slate-500">1/4 Mineral Interest</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Leasehold Status</span>
                <Badge variant="warning" className="mt-1">OPEN UNLEASED</Badge>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">HBP Status</span>
                <Badge variant="outline" className="mt-1">NOT HBP</Badge>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Title Defect Risk</span>
                <Badge variant="danger" className="mt-1">CURATIVE REQUIRED</Badge>
              </div>
            </div>

            {/* Severed Estates Summary Table */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-semibold text-slate-200">Severed Estate Ownership Table</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Surface Owner</span>
                  <p className="font-bold text-slate-200">Reeves Ranch Holdings LLC</p>
                  <EstateBadge category="SURFACE_ESTATE" className="mt-1" />
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Mineral Owner (1/4 Interest)</span>
                  <p className="font-bold text-amber-300">Estate of Henry T. Miller</p>
                  <EstateBadge category="MINERAL_ESTATE" className="mt-1" />
                  <FractionBadge fraction={{ numerator: 1, denominator: 4 }} label="NMA Share" className="mt-1" />
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Executive Rights Owner</span>
                  <p className="font-bold text-purple-300">Miller Family Trust</p>
                  <EstateBadge category="EXECUTIVE_RIGHTS" className="mt-1" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
