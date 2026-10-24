'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileCheck2, 
  Download, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  ExternalLink,
  RefreshCw,
  FileText
} from 'lucide-react';
import { getAllProperties } from '@/actions/propertyActions';

interface Deliverable {
  id: string;
  title: string;
  type: 'MINERAL_OWNERSHIP_REPORT' | 'SURFACE_OWNERSHIP_REPORT' | 'TITLE_RUNSHEET' | 'LEASE_PACKAGE';
  propertyApn: string;
  county: string;
  state: string;
  status: 'DELIVERED' | 'IN_REVIEW' | 'DRAFT';
  completedDate: string;
  landman: string;
}

const MOCK_DELIVERABLES: Deliverable[] = [
  {
    id: 'del_1',
    title: 'Certified Mineral Ownership Report (MOR)',
    type: 'MINERAL_OWNERSHIP_REPORT',
    propertyApn: '045-88-201',
    county: 'Reeves',
    state: 'TX',
    status: 'DELIVERED',
    completedDate: '2026-10-18',
    landman: 'Ned Pearson, RPL'
  },
  {
    id: 'del_2',
    title: '40-Year Surface Chain of Title Abstract',
    type: 'SURFACE_OWNERSHIP_REPORT',
    propertyApn: '703-12-890',
    county: 'Costilla',
    state: 'CO',
    status: 'DELIVERED',
    completedDate: '2026-10-20',
    landman: 'Sarah Jenkins, CPL'
  },
  {
    id: 'del_3',
    title: 'Permian Wolfcamp Title Runsheet & Flowchart',
    type: 'TITLE_RUNSHEET',
    propertyApn: '045-88-201',
    county: 'Reeves',
    state: 'TX',
    status: 'IN_REVIEW',
    completedDate: '2026-10-22',
    landman: 'Ned Pearson, RPL'
  },
  {
    id: 'del_4',
    title: 'Executed Paid-Up Oil & Gas Leasehold Package',
    type: 'LEASE_PACKAGE',
    propertyApn: '314-09-122',
    county: 'Mohave',
    state: 'AZ',
    status: 'DRAFT',
    completedDate: '2026-10-23',
    landman: 'Robert Davis'
  }
];

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(MOCK_DELIVERABLES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownload = (title: string) => {
    showToast(`Downloading package: "${title}"`);
  };

  const filtered = deliverables.filter(d => {
    const matchesSearch = search === '' || 
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.propertyApn.toLowerCase().includes(search.toLowerCase()) ||
      d.county.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border bg-emerald-950/90 border-emerald-500/50 text-emerald-200 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Client Deliverables & Title Reports</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Mineral ownership reports, certified runsheets, surface ownership records, and lease acquisition packages
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
              placeholder="Search deliverables by title, APN, or county..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Report Types</option>
            <option value="MINERAL_OWNERSHIP_REPORT">Mineral Ownership Reports</option>
            <option value="SURFACE_OWNERSHIP_REPORT">Surface Ownership Reports</option>
            <option value="TITLE_RUNSHEET">Title Runsheets</option>
            <option value="LEASE_PACKAGE">Lease Packages</option>
          </select>
        </div>

        {/* Deliverables List */}
        <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Deliverable Package</th>
                <th className="p-3.5">Target Parcel</th>
                <th className="p-3.5">Assigned Landman</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Date Completed</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((del) => (
                <tr key={del.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      {del.title}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">
                      {del.type.replace(/_/g, ' ')}
                    </div>
                  </td>

                  <td className="p-3.5 font-mono text-slate-300">
                    <div>APN: {del.propertyApn}</div>
                    <div className="text-[11px] text-slate-500">{del.county}, {del.state}</div>
                  </td>

                  <td className="p-3.5 text-slate-300">
                    {del.landman}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      del.status === 'DELIVERED' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : del.status === 'IN_REVIEW'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {del.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-400 font-mono">
                    {del.completedDate}
                  </td>

                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownload(del.title)}
                      className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] inline-flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Package
                    </button>
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
