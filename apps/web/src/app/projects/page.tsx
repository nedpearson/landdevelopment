'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { FolderKanban, Plus, Building, Users, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-400" /> Landman Projects & Client Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage mineral, title, leasehold, ROW, and renewable energy client projects across target basins and counties.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
            Create New Project
          </Button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Project 1 */}
        <Card className="border-amber-900/40 bg-slate-900">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="warning">MINERAL ACQUISITION</Badge>
                <h3 className="font-bold text-white text-base mt-1">Permian Basin Wolfcamp Prospect</h3>
                <p className="text-slate-400">Client: Pioneer Natural Resources (Ref: #PNR-2026-W)</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Target Region:</span>
                <span>Reeves & Midland County, TX</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Net Mineral Acres:</span>
                <span className="font-bold text-amber-300">1,250.00 NMA</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Max Bonus Authority:</span>
                <span>$4,500 / NMA</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Leased / Acquired NMA:</span>
                <span>842.50 NMA (67.4%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Link href="/tracts">
                <Button variant="outline" size="sm">
                  View Assigned Tracts
                </Button>
              </Link>
              <Link href="/runsheets">
                <Button variant="primary" size="sm">
                  Title Runsheets
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Project 2 */}
        <Card className="border-slate-800 bg-slate-900">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="info">SOLAR SITE CONTROL</Badge>
                <h3 className="font-bold text-white text-base mt-1">Costilla Solar Array Phase 1</h3>
                <p className="text-slate-400">Client: NextEra Energy Resources</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Target Region:</span>
                <span>Costilla County, CO</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Contiguous Acres:</span>
                <span className="font-bold text-emerald-400">800.00 AC</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Option Rent Authority:</span>
                <span>$45.00 / AC / Yr</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Site Control Controlled:</span>
                <span>640.00 AC (80.0%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Link href="/renewables">
                <Button variant="outline" size="sm">
                  Renewable Workspace
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Project 3 */}
        <Card className="border-slate-800 bg-slate-900">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="success">RIGHT-OF-WAY PIPELINE</Badge>
                <h3 className="font-bold text-white text-base mt-1">Eagle Ford Lateral Pipeline ROW</h3>
                <p className="text-slate-400">Client: Kinder Morgan Midstream</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-300">
                <span>Total Corridor Length:</span>
                <span>480.0 Rods (1.5 mi)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Max Price / Rod:</span>
                <span>$250.00 / Rod</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Easements Signed:</span>
                <span>12 / 14 Tracts (85.7%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <Link href="/row">
                <Button variant="outline" size="sm">
                  ROW Corridor
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
