'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Droplet, 
  MapPin, 
  Search, 
  CheckCircle2, 
  RefreshCw, 
  Activity,
  Building2
} from 'lucide-react';

interface WellRecord {
  id: string;
  apiNumber: string;
  wellName: string;
  operator: string;
  wellType: 'OIL_AND_GAS' | 'WATER_SUPPLY' | 'INJECTION';
  county: string;
  state: string;
  status: 'PRODUCING' | 'SHUT_IN' | 'PERMITTED' | 'PLUGGED';
  spudDate: string;
  formation: string;
  lateralLengthFeet?: number;
}

const INITIAL_WELLS: WellRecord[] = [
  {
    id: 'well_1',
    apiNumber: '42-389-38291',
    wellName: 'Wolfcamp State Unit 14 #1H',
    operator: 'Pioneer Natural Resources',
    wellType: 'OIL_AND_GAS',
    county: 'Reeves',
    state: 'TX',
    status: 'PRODUCING',
    spudDate: '2025-04-12',
    formation: 'Wolfcamp A',
    lateralLengthFeet: 10200
  },
  {
    id: 'well_2',
    apiNumber: '42-389-39102',
    wellName: 'Reeves Ranch Fee 22 #2H',
    operator: 'Diamondback Energy',
    wellType: 'OIL_AND_GAS',
    county: 'Reeves',
    state: 'TX',
    status: 'PERMITTED',
    spudDate: '2026-02-01',
    formation: 'Wolfcamp B',
    lateralLengthFeet: 9800
  },
  {
    id: 'well_3',
    apiNumber: 'CO-PERMIT-49210-W',
    wellName: 'Costilla Valley Ranch Domestic Well #1',
    operator: 'Miller Family Trust',
    wellType: 'WATER_SUPPLY',
    county: 'Costilla',
    state: 'CO',
    status: 'PRODUCING',
    spudDate: '2018-06-20',
    formation: 'San Luis Valley Unconfined Aquifer',
    lateralLengthFeet: 0
  }
];

export default function WellsPage() {
  const [wells, setWells] = useState<WellRecord[]>(INITIAL_WELLS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filtered = wells.filter(w => {
    const matchesSearch = search === '' ||
      w.apiNumber.toLowerCase().includes(search.toLowerCase()) ||
      w.wellName.toLowerCase().includes(search.toLowerCase()) ||
      w.operator.toLowerCase().includes(search.toLowerCase()) ||
      w.county.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || w.wellType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <Flame className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Wells & Energy Asset Registry</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              API parcel correlation, state regulatory permits, horizontal lateral lengths, and production status
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* Filters */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by API #, Well Name, Operator, or County..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">All Well Types</option>
            <option value="OIL_AND_GAS">Oil & Gas Producing</option>
            <option value="WATER_SUPPLY">Water Supply / Irrigation</option>
          </select>
        </div>

        {/* Wells Table */}
        <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">API / Permit #</th>
                <th className="p-3.5">Well Name</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Formation</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((w) => (
                <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-white">
                    {w.apiNumber}
                  </td>
                  <td className="p-3.5 font-semibold text-slate-200">
                    {w.wellName}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {w.operator}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {w.county}, {w.state}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {w.formation}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      w.status === 'PRODUCING'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
