'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, ShieldCheck, Calendar, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface LandPermit {
  id: string;
  permitNumber: string;
  projectName: string;
  agency: string;
  permitType: string;
  filingDate: string;
  targetApprovalDate: string;
  expirationDate: string;
  status: 'APPROVED' | 'UNDER_REVIEW' | 'SUBMITTED' | 'CONDITIONAL';
  leadConsultant: string;
}

const INITIAL_PERMITS: LandPermit[] = [
  {
    id: 'per-301',
    permitNumber: 'NWP-14-2024-089',
    projectName: 'Sand Creek Section 14',
    agency: 'US Army Corps of Engineers (USACE)',
    permitType: 'Nationwide Permit 14 (Linear Crossing)',
    filingDate: '2024-01-15',
    targetApprovalDate: '2024-05-15',
    expirationDate: '2027-05-15',
    status: 'APPROVED',
    leadConsultant: 'SWCA Environmental Consultants',
  },
  {
    id: 'per-302',
    permitNumber: 'TX-CUP-2024-004',
    projectName: 'Lone Star Sol 1',
    agency: 'Pecos County Commissioners Court',
    permitType: 'Conditional Use Permit (Utility-Scale Solar)',
    filingDate: '2024-02-10',
    targetApprovalDate: '2024-06-30',
    expirationDate: '2029-06-30',
    status: 'APPROVED',
    leadConsultant: 'Kimley-Horn & Associates',
  },
  {
    id: 'per-303',
    permitNumber: 'CGP-TXR150000',
    projectName: 'Lone Star Sol 1',
    agency: 'TCEQ',
    permitType: 'TPDES Construction General Permit (Stormwater SWPPP)',
    filingDate: '2024-04-01',
    targetApprovalDate: '2024-05-01',
    expirationDate: '2026-04-30',
    status: 'APPROVED',
    leadConsultant: 'Westwood Professional Services',
  },
  {
    id: 'per-304',
    permitNumber: 'FAA-OE-2024-1189',
    projectName: 'High Plains Wind & Solar',
    agency: 'Federal Aviation Administration (FAA)',
    permitType: 'Part 77 Obstruction Evaluation (Met Towers)',
    filingDate: '2024-03-20',
    targetApprovalDate: '2024-07-20',
    expirationDate: '2026-07-20',
    status: 'UNDER_REVIEW',
    leadConsultant: 'Capitol Airspace Group',
  },
  {
    id: 'per-305',
    permitNumber: 'DOT-ACCESS-441',
    projectName: 'Sand Creek Section 14',
    agency: 'Colorado Dept of Transportation (CDOT)',
    permitType: 'Commercial Highway Access Permit (SH-52)',
    filingDate: '2024-05-05',
    targetApprovalDate: '2024-08-15',
    expirationDate: '2025-08-15',
    status: 'SUBMITTED',
    leadConsultant: 'Muller Engineering Co.',
  },
];

export default function PermittingPage() {
  const [permits, setPermits] = useState<LandPermit[]>(INITIAL_PERMITS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [permitNumber, setPermitNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [agency, setAgency] = useState('');
  const [permitType, setPermitType] = useState('');
  const [leadConsultant, setLeadConsultant] = useState('');
  const [targetApprovalDate, setTargetApprovalDate] = useState('2024-09-01');
  const [expirationDate, setExpirationDate] = useState('2027-09-01');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = permits.filter((p) => {
    const matchesSearch =
      p.permitNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.projectName.toLowerCase().includes(search.toLowerCase()) ||
      p.agency.toLowerCase().includes(search.toLowerCase()) ||
      p.permitType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalApproved = permits.filter((p) => p.status === 'APPROVED').length;
  const underReview = permits.filter((p) => p.status === 'UNDER_REVIEW' || p.status === 'SUBMITTED').length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitNumber || !projectName || !agency || !permitType) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newPermit: LandPermit = {
      id: `per-${Date.now()}`,
      permitNumber,
      projectName,
      agency,
      permitType,
      filingDate: new Date().toISOString().split('T')[0],
      targetApprovalDate,
      expirationDate,
      status: 'SUBMITTED',
      leadConsultant: leadConsultant || 'In-House Development Team',
    };

    setPermits([newPermit, ...permits]);
    setIsModalOpen(false);
    showToast(`Permit application ${permitNumber} recorded successfully`);

    setPermitNumber('');
    setProjectName('');
    setAgency('');
    setPermitType('');
  };

  const handleExportCSV = () => {
    const headers = ['Permit #', 'Project', 'Agency', 'Permit Type', 'Filing Date', 'Target Approval', 'Expiration', 'Status', 'Lead Consultant'];
    const rows = permits.map((p) => [
      p.permitNumber,
      `"${p.projectName}"`,
      `"${p.agency}"`,
      `"${p.permitType}"`,
      p.filingDate,
      p.targetApprovalDate,
      p.expirationDate,
      p.status,
      `"${p.leadConsultant}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `permits-registry-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported permits registry to CSV');
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
            <ShieldCheck className="text-emerald-500 w-6 h-6" />
            Permitting & Environmental Regulatory Approvals
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track jurisdictional permits, wetland delineations, FAA airspace determinations, and CUP hearings.
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
            <Plus className="w-4 h-4 mr-2" /> Record Permit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Active Permits</div>
          <div className="text-2xl font-bold text-white mt-1">{permits.length}</div>
          <div className="text-xs text-slate-400 mt-1">Across federal, state, and local agencies</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Approved & Enforceable</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{totalApproved}</div>
          <div className="text-xs text-slate-400 mt-1">Full statutory compliance</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Under Active Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{underReview}</div>
          <div className="text-xs text-slate-400 mt-1">Pending hearing / agency signature</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Approval Rate</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">
            {permits.length ? Math.round((totalApproved / permits.length) * 100) : 0}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Zero permit denials</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search permit #, project, agency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 uppercase font-medium shrink-0">Status:</span>
          {['ALL', 'APPROVED', 'UNDER_REVIEW', 'SUBMITTED', 'CONDITIONAL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
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

      {/* Permits Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Permit Number</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Regulatory Agency</th>
                <th className="py-3 px-4">Permit Scope / Type</th>
                <th className="py-3 px-4">Filing Date</th>
                <th className="py-3 px-4">Expiration</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Lead Consultant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400">{p.permitNumber}</td>
                  <td className="py-3 px-4 font-medium text-white">{p.projectName}</td>
                  <td className="py-3 px-4 text-slate-300">{p.agency}</td>
                  <td className="py-3 px-4 text-slate-200">{p.permitType}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-400">{p.filingDate}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-300">{p.expirationDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'UNDER_REVIEW'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">{p.leadConsultant}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No permit records found matching your criteria.
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
                <ShieldCheck className="text-emerald-500 w-5 h-5" /> Record Regulatory Permit
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Permit Number *</label>
                  <input
                    type="text"
                    required
                    value={permitNumber}
                    onChange={(e) => setPermitNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. USACE-NWP-2025"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Lone Star Sol 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Regulatory Agency *</label>
                <input
                  type="text"
                  required
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. USACE, TCEQ, County Commission"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Permit Scope / Type *</label>
                <input
                  type="text"
                  required
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Section 404 Wetland Verification"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Approval Date</label>
                  <input
                    type="date"
                    value={targetApprovalDate}
                    onChange={(e) => setTargetApprovalDate(e.target.value)}
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

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Lead Environmental Consultant</label>
                <input
                  type="text"
                  value={leadConsultant}
                  onChange={(e) => setLeadConsultant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. SWCA Environmental Consultants"
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
                  Save Permit Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
