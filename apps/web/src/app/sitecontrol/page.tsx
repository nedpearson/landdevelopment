'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, Layers, MapPin, CheckCircle2, Clock, FileCheck } from 'lucide-react';

interface SiteControlRecord {
  id: string;
  tractId: string;
  landowner: string;
  county: string;
  state: string;
  acres: number;
  instrumentType: 'Ground Lease' | 'Option Agreement' | 'Purchase Contract' | 'Right-of-Way Easement' | 'LOI';
  status: 'SECURED' | 'UNDER_NEGOTIATION' | 'LOI_SIGNED' | 'DUE_DILIGENCE';
  executionDate: string;
  expirationDate: string;
  annualFee: number;
}

const INITIAL_SITECONTROL: SiteControlRecord[] = [
  {
    id: 'sc-401',
    tractId: 'SEC-14-T1N-R65W',
    landowner: 'Double Diamond Minerals LLC',
    county: 'Weld',
    state: 'CO',
    acres: 320.0,
    instrumentType: 'Option Agreement',
    status: 'SECURED',
    executionDate: '2022-10-15',
    expirationDate: '2025-10-14',
    annualFee: 24000,
  },
  {
    id: 'sc-402',
    tractId: 'BLK-48-SEC-12',
    landowner: 'Henderson Family Ranch LLC',
    county: 'Pecos',
    state: 'TX',
    acres: 640.0,
    instrumentType: 'Ground Lease',
    status: 'SECURED',
    executionDate: '2023-06-01',
    expirationDate: '2058-05-31',
    annualFee: 64000,
  },
  {
    id: 'sc-403',
    tractId: 'T15S-R24E-SEC-28',
    landowner: 'Cochise Cattle Co.',
    county: 'Cochise',
    state: 'AZ',
    acres: 480.0,
    instrumentType: 'Purchase Contract',
    status: 'SECURED',
    executionDate: '2024-01-20',
    expirationDate: '2024-12-31',
    annualFee: 19200,
  },
  {
    id: 'sc-404',
    tractId: 'VAL-T6N-R2E-SEC-4',
    landowner: 'Martinez Estate Trust',
    county: 'Valencia',
    state: 'NM',
    acres: 160.0,
    instrumentType: 'LOI',
    status: 'LOI_SIGNED',
    executionDate: '2024-03-01',
    expirationDate: '2024-09-01',
    annualFee: 9600,
  },
];

export default function SiteControlPage() {
  const [records, setRecords] = useState<SiteControlRecord[]>(INITIAL_SITECONTROL);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [tractId, setTractId] = useState('');
  const [landowner, setLandowner] = useState('');
  const [county, setCounty] = useState('');
  const [stateCode, setStateCode] = useState('TX');
  const [acres, setAcres] = useState(160);
  const [instrumentType, setInstrumentType] = useState<SiteControlRecord['instrumentType']>('Option Agreement');
  const [annualFee, setAnnualFee] = useState(12000);
  const [expirationDate, setExpirationDate] = useState('2026-12-31');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.tractId.toLowerCase().includes(search.toLowerCase()) ||
      r.landowner.toLowerCase().includes(search.toLowerCase()) ||
      r.county.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalControlledAcres = records
    .filter((r) => r.status === 'SECURED')
    .reduce((sum, r) => sum + r.acres, 0);

  const totalPipelineAcres = records.reduce((sum, r) => sum + r.acres, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tractId || !landowner || !county) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newRecord: SiteControlRecord = {
      id: `sc-${Date.now()}`,
      tractId,
      landowner,
      county,
      state: stateCode,
      acres: Number(acres),
      instrumentType,
      status: 'SECURED',
      executionDate: new Date().toISOString().split('T')[0],
      expirationDate,
      annualFee: Number(annualFee),
    };

    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    showToast(`Site control for ${tractId} secured successfully`);

    setTractId('');
    setLandowner('');
    setCounty('');
  };

  const handleExportCSV = () => {
    const headers = ['Tract Legal ID', 'Landowner', 'County', 'State', 'Gross Acres', 'Instrument', 'Status', 'Execution Date', 'Expiration Date', 'Annual Holding Fee'];
    const rows = records.map((r) => [
      `"${r.tractId}"`,
      `"${r.landowner}"`,
      `"${r.county}"`,
      r.state,
      r.acres,
      `"${r.instrumentType}"`,
      r.status,
      r.executionDate,
      r.expirationDate,
      r.annualFee,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `site-control-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported site control records to CSV');
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="text-amber-500 w-6 h-6" />
            Site Control & Acreage Aggregation
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Aggregate surface acreage, manage land assembly, and secure long-term utility rights.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium shadow-md shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Secure Site Control
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Secured Acreage</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{totalControlledAcres.toLocaleString()} AC</div>
          <div className="text-xs text-slate-400 mt-1">Directly under option or lease</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Pipeline Acreage</div>
          <div className="text-2xl font-bold text-white mt-1">{totalPipelineAcres.toLocaleString()} AC</div>
          <div className="text-xs text-slate-400 mt-1">{records.length} Aggregated Tracts</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Site Control Ratio</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {totalPipelineAcres ? Math.round((totalControlledAcres / totalPipelineAcres) * 100) : 0}%
          </div>
          <div className="text-xs text-slate-400 mt-1">High exclusivity rate</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Annual Carrying Cost</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">
            ${records.reduce((sum, r) => sum + r.annualFee, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Option & lease payments</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tract ID, landowner, county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 uppercase font-medium">Status:</span>
          {['ALL', 'SECURED', 'UNDER_NEGOTIATION', 'LOI_SIGNED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Site Control Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Tract Legal Ref</th>
                <th className="py-3 px-4">Landowner</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 text-right">Acreage</th>
                <th className="py-3 px-4">Instrument</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Term Expiration</th>
                <th className="py-3 px-4 text-right">Annual Holding Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-white">{r.tractId}</td>
                  <td className="py-3 px-4 font-semibold text-white">{r.landowner}</td>
                  <td className="py-3 px-4 text-slate-300">{r.county} County, {r.state}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{r.acres.toFixed(1)} AC</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded text-xs">
                      {r.instrumentType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        r.status === 'SECURED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : r.status === 'LOI_SIGNED'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {r.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-300">{r.expirationDate}</td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">${r.annualFee.toLocaleString()}/yr</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No site control records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="text-amber-500 w-5 h-5" /> Secure Site Control
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tract Legal Ref *</label>
                <input
                  type="text"
                  required
                  value={tractId}
                  onChange={(e) => setTractId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. SEC-18-T2S-R10W"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Landowner *</label>
                <input
                  type="text"
                  required
                  value={landowner}
                  onChange={(e) => setLandowner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Henderson Ranch Trust"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">County *</label>
                  <input
                    type="text"
                    required
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Pecos"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    value={stateCode}
                    onChange={(e) => setStateCode(e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gross Acres</label>
                  <input
                    type="number"
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Control Instrument</label>
                  <select
                    value={instrumentType}
                    onChange={(e) => setInstrumentType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Option Agreement">Option Agreement</option>
                    <option value="Ground Lease">Ground Lease</option>
                    <option value="Purchase Contract">Purchase Contract</option>
                    <option value="Right-of-Way Easement">Right-of-Way Easement</option>
                    <option value="LOI">Letter of Intent (LOI)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Annual Fee ($)</label>
                  <input
                    type="number"
                    value={annualFee}
                    onChange={(e) => setAnnualFee(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Term Expiration Date</label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm font-medium transition-colors"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
