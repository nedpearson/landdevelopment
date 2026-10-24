'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { getLeases, createLease } from '@/actions/leaseActions';

export default function LeaseholdPage() {
  const [leases, setLeases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadLeases = async () => {
    setLoading(true);
    try {
      const data = await getLeases();
      // Serialize BigInts safely
      const serialized = data.map((l: any) => ({
        ...l,
        royaltyNumerator: l.royaltyNumerator ? Number(l.royaltyNumerator) : 1,
        royaltyDenominator: l.royaltyDenominator ? Number(l.royaltyDenominator) : 5
      }));
      setLeases(serialized);
    } catch (err) {
      showToast('Failed to load leasehold records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeases();
  }, []);

  const filtered = leases.filter(l => 
    search === '' ||
    l.leaseNumber.toLowerCase().includes(search.toLowerCase()) ||
    l.lessorName.toLowerCase().includes(search.toLowerCase()) ||
    l.lesseeName.toLowerCase().includes(search.toLowerCase())
  );

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
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Leasehold & Mineral Operations</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Active oil & gas leases, primary term expirations, Pugh clause tracking, and net revenue interest (NRI)
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* Search Bar */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lease #, lessor, or lessee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={loadLeases}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Leases Table */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-sm">Loading lease records...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400">
            No active leasehold records found in database.
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Lease #</th>
                  <th className="p-3.5">Lessor (Grantor)</th>
                  <th className="p-3.5">Lessee (Operator)</th>
                  <th className="p-3.5">Royalty Fraction</th>
                  <th className="p-3.5">Bonus / NMA</th>
                  <th className="p-3.5">Expiration Date</th>
                  <th className="p-3.5">Pugh Clause</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((lease) => (
                  <tr key={lease.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-white">
                      {lease.leaseNumber}
                    </td>
                    <td className="p-3.5 text-slate-200">
                      {lease.lessorName}
                    </td>
                    <td className="p-3.5 text-slate-200">
                      {lease.lesseeName}
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-amber-400">
                      {lease.royaltyNumerator || 1}/{lease.royaltyDenominator || 5}
                    </td>
                    <td className="p-3.5 text-white font-semibold">
                      ${lease.bonusPerNma ? lease.bonusPerNma.toLocaleString() : 0}/NMA
                    </td>
                    <td className="p-3.5 text-slate-300 font-mono">
                      {new Date(lease.expirationDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lease.hasPughClause ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {lease.hasPughClause ? 'INCLUDED' : 'NONE'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
                        {lease.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
