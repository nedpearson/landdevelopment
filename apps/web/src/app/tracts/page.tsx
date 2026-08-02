'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, FractionBadge, EstateBadge } from '@land-intelligence/ui';
import { MapPin, Plus, Scale, FileText, CheckCircle2, ShieldAlert, Layers } from 'lucide-react';
import Link from 'next/link';
import { rationalToDecimal } from '@land-intelligence/domain';

export default function TractsPage() {
  const [selectedTractId, setSelectedTractId] = useState('trc-104');

  const tracts = [
    {
      id: 'trc-104',
      tractNumber: 'T-104',
      clientTractRef: 'PNR-T104',
      county: 'Reeves',
      state: 'TX',
      legalDescription: 'NW1/4 Section 14, Block 55, PSL Survey',
      grossAcres: 160.0,
      grossMineralAcres: 160.0,
      netMineralAcres: 40.0,
      fraction: { numerator: 1n, denominator: 4n },
      surfaceOwnerName: 'Reeves Ranch Holdings LLC',
      mineralOwnerName: 'Estate of Henry T. Miller',
      executiveRightsOwnerName: 'Miller Family Trust',
      leaseholdStatus: 'OPEN_UNLEASED',
      hbpStatus: 'NOT_HBP',
      titleStatus: 'CURATIVE_REQUIRED',
    },
    {
      id: 'trc-105',
      tractNumber: 'T-105',
      clientTractRef: 'PNR-T105',
      county: 'Reeves',
      state: 'TX',
      legalDescription: 'NE1/4 Section 14, Block 55, PSL Survey',
      grossAcres: 160.0,
      grossMineralAcres: 160.0,
      netMineralAcres: 80.0,
      fraction: { numerator: 1n, denominator: 2n },
      surfaceOwnerName: 'Vance Energy Investments',
      mineralOwnerName: 'Pecos River Minerals LLC',
      executiveRightsOwnerName: 'Pecos River Minerals LLC',
      leaseholdStatus: 'PRODUCING_HBP',
      hbpStatus: 'HBP_PRODUCING',
      titleStatus: 'CLEARED_TITLE',
    },
  ];

  const activeTract = tracts.find((t) => t.id === selectedTractId) || tracts[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" /> Canonical Land Tract Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Centralized tract package managing severed surface, mineral, executive, and royalty estates with exact fraction math.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Add Canonical Tract
          </Button>
        </div>
      </div>

      {/* Map UI Placeholder */}
      <Card className="border-slate-800 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="default" className="bg-slate-950/80 backdrop-blur-sm border-slate-800">
            <MapPin className="w-3 h-3 mr-1 inline" /> GIS Map Layer (Placeholder)
          </Badge>
        </div>
        <div className="h-64 w-full bg-slate-950 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          <div className="text-center space-y-2 max-w-sm">
            <Layers className="w-8 h-8 text-slate-700 mx-auto" />
            <p className="text-xs text-slate-500 font-mono">Mapbox GL JS integration pending geometry hydration. Tract polygons will render here.</p>
          </div>
        </div>
      </Card>

      {/* Tract Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Tract Package Directory</CardTitle>
              <CardDescription>Click any tract row to inspect severed estates and title runsheet linkage</CardDescription>
            </CardHeader>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
                  <tr>
                    <th className="p-3">Tract Ref</th>
                    <th className="p-3">Legal Description</th>
                    <th className="p-3">Gross AC</th>
                    <th className="p-3">NMA Interest</th>
                    <th className="p-3">Lease Status</th>
                    <th className="p-3">Title Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {tracts.map((t) => (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTractId(t.id)}
                      className={`cursor-pointer transition-colors ${
                        selectedTractId === t.id ? 'bg-amber-950/40 text-white' : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-3 font-bold text-amber-400">{t.tractNumber} ({t.clientTractRef})</td>
                      <td className="p-3 text-slate-300 truncate max-w-[200px]">{t.legalDescription}</td>
                      <td className="p-3 text-white">{t.grossAcres.toFixed(1)} AC</td>
                      <td className="p-3">
                        <FractionBadge fraction={t.fraction} label="NMA" />
                      </td>
                      <td className="p-3">
                        <Badge variant={t.leaseholdStatus === 'OPEN_UNLEASED' ? 'danger' : 'success'}>
                          {t.leaseholdStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <Badge variant={t.titleStatus === 'CLEARED_TITLE' ? 'success' : 'warning'}>
                          {t.titleStatus.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Detail Side Panel */}
        <div>
          <Card className="border-amber-900/40 bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-amber-400">Tract {activeTract.tractNumber} Details</CardTitle>
                <Badge variant="warning">{activeTract.clientTractRef}</Badge>
              </div>
              <CardDescription>{activeTract.legalDescription}</CardDescription>
            </CardHeader>

            <div className="space-y-4 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Severed Estates Status</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <EstateBadge category="SURFACE_ESTATE" name={activeTract.surfaceOwnerName} />
                  <EstateBadge category="MINERAL_ESTATE" name={activeTract.mineralOwnerName} />
                  <EstateBadge category="EXECUTIVE_RIGHTS" name={activeTract.executiveRightsOwnerName} />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 uppercase text-[10px] font-semibold">Exact NMA Interest Calculation</span>
                <p className="text-slate-200">Gross Mineral Acres: <strong className="text-white">{activeTract.grossMineralAcres} AC</strong></p>
                <p className="text-slate-200">Mineral Fraction: <strong className="text-amber-300">{activeTract.fraction.numerator.toString()}/{activeTract.fraction.denominator.toString()} ({(rationalToDecimal(activeTract.fraction) * 100).toFixed(4)}%)</strong></p>
                <p className="text-slate-200">Net Mineral Acres: <strong className="text-emerald-400 font-bold">{activeTract.netMineralAcres.toFixed(4)} NMA</strong></p>
              </div>

              <div className="pt-2 flex gap-2">
                <Link href="/runsheets" className="w-full">
                  <Button variant="primary" size="sm" className="w-full" icon={<FileText className="w-4 h-4" />}>
                    Open Title Runsheet
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
