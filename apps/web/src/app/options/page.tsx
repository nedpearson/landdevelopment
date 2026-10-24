'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, FileCheck, Calendar, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface LandOption {
  id: string;
  tractName: string;
  landowner: string;
  county: string;
  state: string;
  acres: number;
  effectiveDate: string;
  expirationDate: string;
  optionFeePerAcre: number;
  exercisePricePerAcre: number;
  status: 'ACTIVE' | 'EXERCISED' | 'EXTENDED' | 'EXPIRED';
  hasExtensionClause: boolean;
}

const INITIAL_OPTIONS: LandOption[] = [
  {
    id: 'opt-101',
    tractName: 'Red River Mesa Tract A',
    landowner: 'Henderson Family Ranch LLC',
    county: 'Pecos',
    state: 'TX',
    acres: 640.0,
    effectiveDate: '2023-06-01',
    expirationDate: '2026-05-31',
    optionFeePerAcre: 50,
    exercisePricePerAcre: 2200,
    status: 'ACTIVE',
    hasExtensionClause: true,
  },
  {
    id: 'opt-102',
    tractName: 'Sand Creek Section 14',
    landowner: 'Double Diamond Minerals LLC',
    county: 'Weld',
    state: 'CO',
    acres: 320.0,
    effectiveDate: '2022-10-15',
    expirationDate: '2025-10-14',
    optionFeePerAcre: 75,
    exercisePricePerAcre: 3500,
    status: 'ACTIVE',
    hasExtensionClause: true,
  },
  {
    id: 'opt-103',
    tractName: 'Apache Ridge Parcel East',
    landowner: 'Cochise Cattle Co.',
    county: 'Cochise',
    state: 'AZ',
    acres: 480.0,
    effectiveDate: '2021-03-01',
    expirationDate: '2024-02-28',
    optionFeePerAcre: 40,
    exercisePricePerAcre: 1800,
    status: 'EXERCISED',
    hasExtensionClause: false,
  },
  {
    id: 'opt-104',
    tractName: 'Rio Grande Basin Section 4',
    landowner: 'Martinez Estate Trust',
    county: 'Valencia',
    state: 'NM',
    acres: 160.0,
    effectiveDate: '2023-01-10',
    expirationDate: '2027-01-09',
    optionFeePerAcre: 60,
    exercisePricePerAcre: 2500,
    status: 'ACTIVE',
    hasExtensionClause: true,
  },
];

export default function OptionsPage() {
  const [options, setOptions] = useState<LandOption[]>(INITIAL_OPTIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [tractName, setTractName] = useState('');
  const [landowner, setLandowner] = useState('');
  const [county, setCounty] = useState('');
  const [stateCode, setStateCode] = useState('TX');
  const [acres, setAcres] = useState(160);
  const [effectiveDate, setEffectiveDate] = useState('2024-01-01');
  const [expirationDate, setExpirationDate] = useState('2027-01-01');
  const [optionFeePerAcre, setOptionFeePerAcre] = useState(50);
  const [exercisePricePerAcre, setExercisePricePerAcre] = useState(2500);
  const [hasExtensionClause, setHasExtensionClause] = useState(true);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = options.filter((o) => {
    const matchesSearch =
      o.tractName.toLowerCase().includes(search.toLowerCase()) ||
      o.landowner.toLowerCase().includes(search.toLowerCase()) ||
      o.county.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOptionedAcres = options.reduce((sum, o) => sum + o.acres, 0);
  const totalAnnualHoldingFees = options
    .filter((o) => o.status === 'ACTIVE')
    .reduce((sum, o) => sum + o.acres * o.optionFeePerAcre, 0);
  const totalExerciseValue = options.reduce((sum, o) => sum + o.acres * o.exercisePricePerAcre, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tractName || !landowner || !county) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newOpt: LandOption = {
      id: `opt-${Date.now()}`,
      tractName,
      landowner,
      county,
      state: stateCode,
      acres: Number(acres),
      effectiveDate,
      expirationDate,
      optionFeePerAcre: Number(optionFeePerAcre),
      exercisePricePerAcre: Number(exercisePricePerAcre),
      status: 'ACTIVE',
      hasExtensionClause,
    };

    setOptions([newOpt, ...options]);
    setIsModalOpen(false);
    showToast(`Option agreement for ${tractName} created successfully`);

    // Reset
    setTractName('');
    setLandowner('');
    setCounty('');
  };

  const handleExportCSV = () => {
    const headers = ['Tract Name', 'Landowner', 'County', 'State', 'Acres', 'Effective Date', 'Expiration Date', 'Fee/AC/yr', 'Exercise $/AC', 'Status', 'Has Extension'];
    const rows = options.map(o => [
      `"${o.tractName}"`,
      `"${o.landowner}"`,
      `"${o.county}"`,
      o.state,
      o.acres,
      o.effectiveDate,
      o.expirationDate,
      o.optionFeePerAcre,
      o.exercisePricePerAcre,
      o.status,
      o.hasExtensionClause ? 'YES' : 'NO',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `land-options-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported land options to CSV');
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
            <FileCheck className="text-amber-500 w-6 h-6" />
            Landowner Option Agreements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage land control options, terms, extension rights, and strike purchase valuations.
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
            <Plus className="w-4 h-4 mr-2" /> New Option
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Optioned Acreage</div>
          <div className="text-2xl font-bold text-white mt-1">{totalOptionedAcres.toLocaleString()} AC</div>
          <div className="text-xs text-slate-400 mt-1">{options.length} Executed Option Contracts</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Annual Holding Fees</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">${totalAnnualHoldingFees.toLocaleString()}/yr</div>
          <div className="text-xs text-slate-400 mt-1">Cost to Maintain Site Control</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Exercise Purchase Value</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">${totalExerciseValue.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Capital Required Upon Closing Option</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Strike Price</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            ${totalOptionedAcres ? Math.round(totalExerciseValue / totalOptionedAcres).toLocaleString() : 0}/AC
          </div>
          <div className="text-xs text-slate-400 mt-1">Locked-In Acquisition Basis</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search tract, landowner, county..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 uppercase font-medium">Status:</span>
          {['ALL', 'ACTIVE', 'EXERCISED', 'EXTENDED', 'EXPIRED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Options Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Tract & Location</th>
                <th className="py-3 px-4">Landowner</th>
                <th className="py-3 px-4 text-right">Acreage</th>
                <th className="py-3 px-4">Term & Expiration</th>
                <th className="py-3 px-4 text-right">Annual Fee</th>
                <th className="py-3 px-4 text-right">Strike Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Extension Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((opt) => (
                <tr key={opt.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{opt.tractName}</div>
                    <div className="text-xs text-slate-400">{opt.county} County, {opt.state}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{opt.landowner}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-white">{opt.acres.toFixed(1)} AC</td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-slate-300">{opt.effectiveDate} to {opt.expirationDate}</div>
                    <div className="text-[11px] text-amber-400">Expires in {(new Date(opt.expirationDate).getFullYear() - new Date().getFullYear())} yrs</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">
                    ${(opt.acres * opt.optionFeePerAcre).toLocaleString()}/yr
                    <div className="text-[10px] text-slate-400">${opt.optionFeePerAcre}/AC</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400">
                    ${(opt.acres * opt.exercisePricePerAcre).toLocaleString()}
                    <div className="text-[10px] text-slate-400">${opt.exercisePricePerAcre}/AC</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        opt.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : opt.status === 'EXERCISED'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {opt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {opt.hasExtensionClause ? (
                      <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                        Yes (2-Year Extension)
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">None</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No option agreements found matching your criteria.
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
                <FileCheck className="text-amber-500 w-5 h-5" /> New Land Option Agreement
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tract Name *</label>
                <input
                  type="text"
                  required
                  value={tractName}
                  onChange={(e) => setTractName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Red River Solar Section 12"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Landowner / Grantor *</label>
                <input
                  type="text"
                  required
                  value={landowner}
                  onChange={(e) => setLandowner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Sterling Land & Cattle LP"
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expiration Date</label>
                  <input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Annual Fee ($/AC/yr)</label>
                  <input
                    type="number"
                    value={optionFeePerAcre}
                    onChange={(e) => setOptionFeePerAcre(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Exercise Strike Price ($/AC)</label>
                  <input
                    type="number"
                    value={exercisePricePerAcre}
                    onChange={(e) => setExercisePricePerAcre(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasExt"
                  checked={hasExtensionClause}
                  onChange={(e) => setHasExtensionClause(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0 bg-slate-900"
                />
                <label htmlFor="hasExt" className="text-xs text-slate-300">
                  Includes unilateral option extension clause
                </label>
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
                  Record Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
