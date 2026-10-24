'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, Check, Zap, CheckCircle2, AlertCircle, Clock, ArrowUpDown } from 'lucide-react';

interface InterconnectionApplication {
  id: string;
  projectName: string;
  queueId: string;
  iso: string;
  substation: string;
  voltageKv: number;
  capacityMw: number;
  studyPhase: 'Feasibility Study' | 'System Impact Study' | 'Facilities Study' | 'IA Executed' | 'Operational';
  status: 'ACTIVE' | 'IN_STUDY' | 'APPROVED' | 'SUSPENDED';
  targetCod: string;
  studyDeposit: number;
}

const INITIAL_APPLICATIONS: InterconnectionApplication[] = [
  {
    id: 'int-1',
    projectName: 'Lone Star Sol 1',
    queueId: 'ERCOT-24INR0412',
    iso: 'ERCOT',
    substation: 'Midland Switch 138kV',
    voltageKv: 138,
    capacityMw: 250,
    studyPhase: 'Facilities Study',
    status: 'ACTIVE',
    targetCod: '2026-Q4',
    studyDeposit: 150000,
  },
  {
    id: 'int-2',
    projectName: 'Pecos River Storage',
    queueId: 'ERCOT-24BESS089',
    iso: 'ERCOT',
    substation: 'Orla Substation 345kV',
    voltageKv: 345,
    capacityMw: 100,
    studyPhase: 'IA Executed',
    status: 'APPROVED',
    targetCod: '2025-Q3',
    studyDeposit: 250000,
  },
  {
    id: 'int-3',
    projectName: 'High Plains Wind & Solar',
    queueId: 'SPP-GEN-2023-112',
    iso: 'SPP',
    substation: 'Amarillo East 230kV',
    voltageKv: 230,
    capacityMw: 300,
    studyPhase: 'System Impact Study',
    status: 'IN_STUDY',
    targetCod: '2027-Q2',
    studyDeposit: 180000,
  },
  {
    id: 'int-4',
    projectName: 'Sonoran Solar Hub',
    queueId: 'CAISO-Q1489',
    iso: 'CAISO',
    substation: 'Imperial Valley 500kV',
    voltageKv: 500,
    capacityMw: 450,
    studyPhase: 'Feasibility Study',
    status: 'IN_STUDY',
    targetCod: '2028-Q1',
    studyDeposit: 120000,
  },
];

export default function InterconnectionPage() {
  const [applications, setApplications] = useState<InterconnectionApplication[]>(INITIAL_APPLICATIONS);
  const [search, setSearch] = useState('');
  const [selectedIso, setSelectedIso] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [projectName, setProjectName] = useState('');
  const [queueId, setQueueId] = useState('');
  const [iso, setIso] = useState('ERCOT');
  const [substation, setSubstation] = useState('');
  const [voltageKv, setVoltageKv] = useState(138);
  const [capacityMw, setCapacityMw] = useState(100);
  const [studyPhase, setStudyPhase] = useState<InterconnectionApplication['studyPhase']>('System Impact Study');
  const [studyDeposit, setStudyDeposit] = useState(100000);
  const [targetCod, setTargetCod] = useState('2026-Q3');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.projectName.toLowerCase().includes(search.toLowerCase()) ||
      app.queueId.toLowerCase().includes(search.toLowerCase()) ||
      app.substation.toLowerCase().includes(search.toLowerCase());
    const matchesIso = selectedIso === 'ALL' || app.iso === selectedIso;
    return matchesSearch && matchesIso;
  });

  const totalCapacityMw = applications.reduce((sum, a) => sum + a.capacityMw, 0);
  const approvedCapacityMw = applications
    .filter((a) => a.status === 'APPROVED')
    .reduce((sum, a) => sum + a.capacityMw, 0);
  const totalDeposits = applications.reduce((sum, a) => sum + a.studyDeposit, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !queueId || !substation) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newApp: InterconnectionApplication = {
      id: `int-${Date.now()}`,
      projectName,
      queueId,
      iso,
      substation,
      voltageKv: Number(voltageKv),
      capacityMw: Number(capacityMw),
      studyPhase,
      status: 'IN_STUDY',
      targetCod,
      studyDeposit: Number(studyDeposit),
    };

    setApplications([newApp, ...applications]);
    setIsModalOpen(false);
    showToast(`Interconnection application ${queueId} recorded successfully`);

    // Reset form
    setProjectName('');
    setQueueId('');
    setSubstation('');
  };

  const handleExportCSV = () => {
    const headers = ['Queue ID', 'Project Name', 'ISO', 'Substation', 'Voltage (kV)', 'Capacity (MW)', 'Phase', 'Status', 'Target COD', 'Deposit ($)'];
    const rows = applications.map(a => [
      a.queueId,
      `"${a.projectName}"`,
      a.iso,
      `"${a.substation}"`,
      a.voltageKv,
      a.capacityMw,
      `"${a.studyPhase}"`,
      a.status,
      a.targetCod,
      a.studyDeposit,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `interconnection-queue-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported queue to CSV');
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
            <Zap className="text-amber-500 w-6 h-6" />
            Interconnection Queue & Grid Capacity
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track utility interconnection requests, ISO/RTO queue positions, study progress, and POI capacity.
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
            <Plus className="w-4 h-4 mr-2" /> New Application
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Pipeline Capacity</div>
          <div className="text-2xl font-bold text-white mt-1">{totalCapacityMw.toLocaleString()} MW</div>
          <div className="text-xs text-slate-400 mt-1">{applications.length} Queue Positions</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Executed / Approved IA</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCapacityMw.toLocaleString()} MW</div>
          <div className="text-xs text-slate-400 mt-1">Ready for Interconnection Construction</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Study Deposits</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">${totalDeposits.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Escrowed with ISO/RTOs</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Interconnection Voltage</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {applications.length ? Math.round(applications.reduce((s, a) => s + a.voltageKv, 0) / applications.length) : 0} kV
          </div>
          <div className="text-xs text-slate-400 mt-1">High-Voltage Transmission POIs</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search project, queue ID, substation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 uppercase font-medium">ISO / RTO:</span>
          {['ALL', 'ERCOT', 'SPP', 'CAISO', 'MISO', 'PJM'].map((isoKey) => (
            <button
              key={isoKey}
              onClick={() => setSelectedIso(isoKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedIso === isoKey
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isoKey}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Queue ID</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">ISO / RTO</th>
                <th className="py-3 px-4">Point of Interconnection (POI)</th>
                <th className="py-3 px-4 text-right">Capacity (MW)</th>
                <th className="py-3 px-4">Study Phase</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Target COD</th>
                <th className="py-3 px-4 text-right">Study Deposit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-emerald-400">{app.queueId}</td>
                  <td className="py-3 px-4 font-medium text-white">{app.projectName}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-700/80 text-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
                      {app.iso}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-white">{app.substation}</div>
                    <div className="text-xs text-slate-400">{app.voltageKv} kV Transmission</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-white">{app.capacityMw} MW</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {app.studyPhase}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : app.status === 'IN_STUDY'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{app.targetCod}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    ${app.studyDeposit.toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No interconnection applications found matching your criteria.
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
                <Zap className="text-amber-500 w-5 h-5" /> New Interconnection Application
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. West Texas Solar Phase 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Queue ID *</label>
                  <input
                    type="text"
                    required
                    value={queueId}
                    onChange={(e) => setQueueId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. ERCOT-25INR004"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ISO / RTO</label>
                  <select
                    value={iso}
                    onChange={(e) => setIso(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ERCOT">ERCOT</option>
                    <option value="SPP">SPP</option>
                    <option value="MISO">MISO</option>
                    <option value="CAISO">CAISO</option>
                    <option value="PJM">PJM</option>
                    <option value="WECC">WECC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Point of Interconnection (POI Substation) *</label>
                <input
                  type="text"
                  required
                  value={substation}
                  onChange={(e) => setSubstation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Odessa East 345kV"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Voltage (kV)</label>
                  <input
                    type="number"
                    value={voltageKv}
                    onChange={(e) => setVoltageKv(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Capacity (MW)</label>
                  <input
                    type="number"
                    value={capacityMw}
                    onChange={(e) => setCapacityMw(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target COD</label>
                  <input
                    type="text"
                    value={targetCod}
                    onChange={(e) => setTargetCod(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="2027-Q1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Study Phase</label>
                  <select
                    value={studyPhase}
                    onChange={(e) => setStudyPhase(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Feasibility Study">Feasibility Study</option>
                    <option value="System Impact Study">System Impact Study</option>
                    <option value="Facilities Study">Facilities Study</option>
                    <option value="IA Executed">IA Executed</option>
                    <option value="Operational">Operational</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Study Deposit ($)</label>
                  <input
                    type="number"
                    value={studyDeposit}
                    onChange={(e) => setStudyDeposit(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
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
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
