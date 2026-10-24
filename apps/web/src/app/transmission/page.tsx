'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, Radio, Activity, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

interface TransmissionLine {
  id: string;
  name: string;
  utilityOwner: string;
  voltageKv: number;
  substationName: string;
  distanceMiles: number;
  headroomMw: number;
  curtailmentRisk: 'LOW' | 'MODERATE' | 'HIGH';
  feasibilityScore: number;
}

const INITIAL_LINES: TransmissionLine[] = [
  {
    id: 'tx-501',
    name: 'Midland - Odessa 345kV Double Circuit',
    utilityOwner: 'Oncor Electric Delivery',
    voltageKv: 345,
    substationName: 'Midland Switch 345kV',
    distanceMiles: 1.2,
    headroomMw: 450,
    curtailmentRisk: 'LOW',
    feasibilityScore: 94,
  },
  {
    id: 'tx-502',
    name: 'Pecos River 138kV Radial Feed',
    utilityOwner: 'AEP Texas North',
    voltageKv: 138,
    substationName: 'Orla Substation',
    distanceMiles: 3.8,
    headroomMw: 120,
    curtailmentRisk: 'MODERATE',
    feasibilityScore: 82,
  },
  {
    id: 'tx-503',
    name: 'Pawnee - Fort Lupton 230kV Corridor',
    utilityOwner: 'Xcel Energy (PSCo)',
    voltageKv: 230,
    substationName: 'Platteville Substation',
    distanceMiles: 0.8,
    headroomMw: 280,
    curtailmentRisk: 'LOW',
    feasibilityScore: 91,
  },
  {
    id: 'tx-504',
    name: 'Imperial Valley - North Gila 500kV',
    utilityOwner: 'San Diego Gas & Electric (SDG&E)',
    voltageKv: 500,
    substationName: 'Imperial Valley Substation',
    distanceMiles: 6.4,
    headroomMw: 600,
    curtailmentRisk: 'HIGH',
    feasibilityScore: 76,
  },
];

export default function TransmissionPage() {
  const [lines, setLines] = useState<TransmissionLine[]>(INITIAL_LINES);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [utilityOwner, setUtilityOwner] = useState('');
  const [voltageKv, setVoltageKv] = useState(138);
  const [substationName, setSubstationName] = useState('');
  const [distanceMiles, setDistanceMiles] = useState(2.0);
  const [headroomMw, setHeadroomMw] = useState(150);
  const [curtailmentRisk, setCurtailmentRisk] = useState<TransmissionLine['curtailmentRisk']>('LOW');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = lines.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.utilityOwner.toLowerCase().includes(search.toLowerCase()) ||
      l.substationName.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || l.curtailmentRisk === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const totalHeadroomMw = lines.reduce((sum, l) => sum + l.headroomMw, 0);
  const avgDistance = lines.length ? lines.reduce((sum, l) => sum + l.distanceMiles, 0) / lines.length : 0;
  const avgFeasibility = lines.length ? Math.round(lines.reduce((sum, l) => sum + l.feasibilityScore, 0) / lines.length) : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !utilityOwner || !substationName) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const calculatedScore = Math.max(
      40,
      Math.min(98, Math.round(100 - distanceMiles * 4 - (curtailmentRisk === 'HIGH' ? 25 : curtailmentRisk === 'MODERATE' ? 10 : 0)))
    );

    const newLine: TransmissionLine = {
      id: `tx-${Date.now()}`,
      name,
      utilityOwner,
      voltageKv: Number(voltageKv),
      substationName,
      distanceMiles: Number(distanceMiles),
      headroomMw: Number(headroomMw),
      curtailmentRisk,
      feasibilityScore: calculatedScore,
    };

    setLines([newLine, ...lines]);
    setIsModalOpen(false);
    showToast(`Transmission corridor ${name} analyzed and recorded`);

    setName('');
    setUtilityOwner('');
    setSubstationName('');
  };

  const handleExportCSV = () => {
    const headers = ['Transmission Line', 'Utility Owner', 'Voltage (kV)', 'POI Substation', 'Distance (Miles)', 'Available Headroom (MW)', 'Curtailment Risk', 'Feasibility Score'];
    const rows = lines.map((l) => [
      `"${l.name}"`,
      `"${l.utilityOwner}"`,
      l.voltageKv,
      `"${l.substationName}"`,
      l.distanceMiles,
      l.headroomMw,
      l.curtailmentRisk,
      l.feasibilityScore,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transmission-lines-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported transmission corridors to CSV');
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
            <Radio className="text-amber-500 w-6 h-6" />
            Transmission Corridors & Substation Proximity
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Assess high-voltage utility lines, available interconnect headroom, curtailment risk, and tie-in distances.
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
            <Plus className="w-4 h-4 mr-2" /> Add Corridor
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Identified Headroom</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{totalHeadroomMw.toLocaleString()} MW</div>
          <div className="text-xs text-slate-400 mt-1">Total export capacity</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Substation Distance</div>
          <div className="text-2xl font-bold text-white mt-1">{avgDistance.toFixed(1)} Miles</div>
          <div className="text-xs text-slate-400 mt-1">Minimizes gen-tie build costs</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Feasibility Index</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">{avgFeasibility} / 100</div>
          <div className="text-xs text-slate-400 mt-1">High POI deliverability</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Monitored Lines</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{lines.length}</div>
          <div className="text-xs text-slate-400 mt-1">69kV to 500kV corridors</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search corridor, utility, substation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 uppercase font-medium">Curtailment Risk:</span>
          {['ALL', 'LOW', 'MODERATE', 'HIGH'].map((rk) => (
            <button
              key={rk}
              onClick={() => setRiskFilter(rk)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                riskFilter === rk
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {rk}
            </button>
          ))}
        </div>
      </div>

      {/* Transmission Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Corridor Name</th>
                <th className="py-3 px-4">Utility Owner</th>
                <th className="py-3 px-4">Voltage</th>
                <th className="py-3 px-4">POI Substation</th>
                <th className="py-3 px-4 text-right">Distance</th>
                <th className="py-3 px-4 text-right">Available Headroom</th>
                <th className="py-3 px-4">Curtailment Risk</th>
                <th className="py-3 px-4 text-right">Feasibility Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{l.name}</td>
                  <td className="py-3 px-4 text-slate-300">{l.utilityOwner}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-700 text-amber-300 px-2 py-0.5 rounded text-xs font-mono font-medium">
                      {l.voltageKv} kV
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200">{l.substationName}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-white">{l.distanceMiles} mi</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{l.headroomMw} MW</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        l.curtailmentRisk === 'LOW'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : l.curtailmentRisk === 'MODERATE'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {l.curtailmentRisk}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono font-bold text-white bg-slate-900 px-2 py-1 rounded border border-slate-700">
                      {l.feasibilityScore} / 100
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No transmission corridors found matching your criteria.
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
                <Radio className="text-amber-500 w-5 h-5" /> Add Transmission Corridor
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Corridor Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. West Texas 345kV Loop"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Utility / Transmission Owner *</label>
                <input
                  type="text"
                  required
                  value={utilityOwner}
                  onChange={(e) => setUtilityOwner(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Oncor, Xcel, AEP Texas"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Voltage (kV)</label>
                  <select
                    value={voltageKv}
                    onChange={(e) => setVoltageKv(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={69}>69 kV</option>
                    <option value={115}>115 kV</option>
                    <option value={138}>138 kV</option>
                    <option value={230}>230 kV</option>
                    <option value={345}>345 kV</option>
                    <option value={500}>500 kV</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">POI Substation *</label>
                  <input
                    type="text"
                    required
                    value={substationName}
                    onChange={(e) => setSubstationName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Midland Switch"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Distance (Miles)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={distanceMiles}
                    onChange={(e) => setDistanceMiles(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Headroom (MW)</label>
                  <input
                    type="number"
                    value={headroomMw}
                    onChange={(e) => setHeadroomMw(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Curtailment Risk</label>
                  <select
                    value={curtailmentRisk}
                    onChange={(e) => setCurtailmentRisk(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
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
                  Record Corridor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
