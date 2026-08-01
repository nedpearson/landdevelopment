'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { MapPin, Search, Filter, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DiscoverMapPage() {
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [minAcreage, setMinAcreage] = useState('2');
  const [absenteeOnly, setAbsenteeOnly] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Parcel Discovery & Geospatial Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search licensed parcel data, view exact polygon boundaries, road frontage, and environmental overlays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Regrid / ATTOM Live Feed Connected</Badge>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card className="bg-slate-900/90 border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Target County</label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="All">All Active Counties</option>
              <option value="Costilla">Costilla County, CO</option>
              <option value="Elko">Elko County, NV</option>
              <option value="Hudspeth">Hudspeth County, TX</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Min Acreage</label>
            <input
              type="number"
              value={minAcreage}
              onChange={(e) => setMinAcreage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Owner Occupancy</label>
            <button
              onClick={() => setAbsenteeOnly(!absenteeOnly)}
              className={`w-full py-2 px-3 rounded-lg border text-left flex items-center justify-between ${
                absenteeOnly
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <span>{absenteeOnly ? 'Absentee Owners Only' : 'All Owner Types'}</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Search Keyword / APN</label>
            <input
              type="text"
              placeholder="e.g. 123-456-789"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-end">
            <Button variant="primary" className="w-full" icon={<Search className="w-4 h-4" />}>
              Filter Parcels
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Workspace: Split View Map + Parcel Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Map Container */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl h-[520px] relative overflow-hidden flex flex-col justify-between p-4">
          {/* Map Layer Overlay Controls */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/90 border border-slate-800 backdrop-blur-md rounded-lg p-3 text-xs space-y-2">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Active GIS Layers
            </p>
            <div className="space-y-1 text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" /> Parcel Boundaries (Polygons)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" /> FEMA 100-Yr Flood Zones
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" /> NWI Wetlands Overlay
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded accent-emerald-500" /> Topo Contours & Slope
              </label>
            </div>
          </div>

          {/* Map Simulation Graphic */}
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center flex-col gap-2">
            <div className="w-64 h-40 rounded-xl border-2 border-dashed border-emerald-500/40 bg-emerald-950/20 p-4 flex flex-col justify-between">
              <div className="flex justify-between text-[11px] text-emerald-400 font-mono">
                <span>APN: 123-456-789</span>
                <span>5.2 AC</span>
              </div>
              <div className="text-center text-xs text-slate-300">
                <p className="font-bold">San Luis, Costilla County, CO</p>
                <p className="text-[10px] text-slate-400">Road Frontage: 320 ft | Slope: 3.2%</p>
              </div>
              <div className="text-[10px] text-emerald-300 text-right font-semibold">
                Polygon Bounds Rendered
              </div>
            </div>
            <p className="text-xs text-slate-400">MapLibre GL / Vector Tile Polygon Engine Active</p>
          </div>

          {/* Map Legend Footer */}
          <div className="relative z-10 self-end bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-md text-[10px] text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> High Deal Score (&gt;80)</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Underwriting Needed</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span> Prospect</span>
          </div>
        </div>

        {/* Parcel Results List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-semibold text-slate-200">Matching Parcels (2 Found)</h2>

          {/* Parcel Card 1 */}
          <Card className="hover:border-emerald-700/60 transition-colors">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">APN: 123-456-789</h3>
                  <p className="text-xs text-slate-400">142 S Wildwood Trail, Costilla, CO 81152</p>
                </div>
                <Badge variant="success">Deal Score 84</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400">Acreage:</span> <strong className="text-slate-200">5.2 ac</strong>
                </div>
                <div>
                  <span className="text-slate-400">Owner:</span> <strong className="text-slate-200">Robert Vance</strong>
                </div>
                <div>
                  <span className="text-slate-400">Asking:</span> <strong className="text-slate-200">$14,500</strong>
                </div>
                <div>
                  <span className="text-slate-400">Est. Resale:</span> <strong className="text-emerald-400">$24,000</strong>
                </div>
              </div>

              <EvidenceBox
                source="Regrid Licensed API"
                retrievedAt={new Date().toISOString()}
                confidenceScore={96}
                verificationState="SELF_VERIFIED"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link href="/properties/prop-001">
                  <Button variant="outline" size="sm">
                    View Record
                  </Button>
                </Link>
                <Link href="/underwriting">
                  <Button variant="primary" size="sm">
                    Run Underwriting
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Parcel Card 2 */}
          <Card className="hover:border-emerald-700/60 transition-colors">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">APN: 987-654-321</h3>
                  <p className="text-xs text-slate-400">77 Sky View Rd, Elko, NV 89801</p>
                </div>
                <Badge variant="warning">Deal Score 78</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400">Acreage:</span> <strong className="text-slate-200">10.0 ac</strong>
                </div>
                <div>
                  <span className="text-slate-400">Owner:</span> <strong className="text-slate-200">Desert Sun LLC</strong>
                </div>
                <div>
                  <span className="text-slate-400">Asking:</span> <strong className="text-slate-200">$18,000</strong>
                </div>
                <div>
                  <span className="text-slate-400">Est. Resale:</span> <strong className="text-emerald-400">$32,000</strong>
                </div>
              </div>

              <EvidenceBox
                source="ATTOM Data Solutions"
                retrievedAt={new Date().toISOString()}
                confidenceScore={94}
                verificationState="UNVERIFIED"
                missingData={['Road Access Verification Required']}
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                <Link href="/properties/prop-002">
                  <Button variant="outline" size="sm">
                    View Record
                  </Button>
                </Link>
                <Link href="/underwriting">
                  <Button variant="primary" size="sm">
                    Verify Access
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
