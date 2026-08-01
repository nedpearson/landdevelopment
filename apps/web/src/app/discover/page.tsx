'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { MapPin, Filter, Search, ArrowRight, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';

export default function DiscoverPage() {
  const [countyFilter, setCountyFilter] = useState('ALL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Parcel Discovery & GIS Spatial Filter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filter off-market parcels by county, acreage, absentee owner status, tax delinquency, and road access.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">14 Active Prospects Identified</Badge>
        </div>
      </div>

      {/* Spatial Filter Bar */}
      <Card className="border-slate-800 bg-slate-900">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filter Criteria:</span>
          </div>

          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Counties & Basins</option>
            <option value="Costilla">Costilla County, CO</option>
            <option value="Reeves">Reeves County, TX</option>
            <option value="Elko">Elko County, NV</option>
          </select>

          <label className="flex items-center gap-1.5 text-slate-300">
            <input type="checkbox" defaultChecked className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-950" />
            <span>Absentee Owner Only</span>
          </label>

          <label className="flex items-center gap-1.5 text-slate-300">
            <input type="checkbox" defaultChecked className="rounded border-slate-800 text-emerald-600 focus:ring-emerald-500 bg-slate-950" />
            <span>Legal Road Access Verified</span>
          </label>
        </div>
      </Card>

      {/* Parcel Results Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Discovered Parcel Results</CardTitle>
          <CardDescription>Verified parcel records with legal descriptions, deal scores, and quick screen underwriting links</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">APN / Location</th>
                <th className="p-3">Owner Name</th>
                <th className="p-3">Acreage</th>
                <th className="p-3">Owner Status</th>
                <th className="p-3">Est. Value</th>
                <th className="p-3">Suggested Offer</th>
                <th className="p-3">Deal Score</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-white">
                  <Link href="/properties/prop-001" className="hover:underline text-emerald-400">
                    123-456-789
                  </Link>
                  <p className="text-[10px] text-slate-400 font-normal">Costilla County, CO</p>
                </td>
                <td className="p-3">Estate of Henry T. Miller</td>
                <td className="p-3">160.00 AC</td>
                <td className="p-3">
                  <Badge variant="warning">ABSENTEE / DECEASED</Badge>
                </td>
                <td className="p-3 text-slate-200">$96,000</td>
                <td className="p-3 font-bold text-emerald-400">$48,000</td>
                <td className="p-3">
                  <Badge variant="success">84 / 100</Badge>
                </td>
                <td className="p-3">
                  <Link href="/underwriting">
                    <Button variant="primary" size="sm">
                      Underwrite
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
