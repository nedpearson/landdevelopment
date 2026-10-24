'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BadgeDollarSign, 
  TrendingUp, 
  Search, 
  Eye, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Building2,
  ExternalLink,
  X,
  FileCheck
} from 'lucide-react';
import { getTransactions, recordClosingTransaction, updateTransactionStatus } from '@/actions/transactionActions';
import { getAllProperties } from '@/actions/propertyActions';

type Transaction = {
  id: string;
  propertyId: string;
  apn: string;
  county: string;
  state: string;
  acreage: number;
  purchasePrice: number;
  totalCostBasis: number;
  estimatedCurrentValue: number;
  unrealizedProfit: number;
  acquisitionDate: Date | string;
  holdingDays: number;
  status: string;
  property?: { address: string | null; id: string };
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Closing Transaction State
  const [newClosing, setNewClosing] = useState({
    propertyId: '',
    purchasePrice: 50000,
    closingCosts: 1500,
    holdingCosts: 500,
    estimatedCurrentValue: 75000
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [txData, propsData] = await Promise.all([
        getTransactions(),
        getAllProperties()
      ]);
      setTransactions(txData as any);
      setProperties(propsData);
      if (propsData.length > 0 && !newClosing.propertyId) {
        setNewClosing(prev => ({
          ...prev,
          propertyId: propsData[0].id,
          purchasePrice: propsData[0].suggestedOfferPrice || propsData[0].askingPrice || 50000
        }));
      }
    } catch (err) {
      showToast('Failed to load transaction data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateTransactionStatus(id, newStatus);
    if (res.success) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      showToast(`Transaction updated to ${newStatus}`);
    } else {
      showToast(res.error || 'Failed to update transaction', 'error');
    }
  };

  const handleRecordClosing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClosing.propertyId) return;

    setIsSubmitting(true);
    try {
      const res = await recordClosingTransaction({
        propertyId: newClosing.propertyId,
        purchasePrice: Number(newClosing.purchasePrice),
        closingCosts: Number(newClosing.closingCosts),
        holdingCosts: Number(newClosing.holdingCosts),
        estimatedCurrentValue: Number(newClosing.estimatedCurrentValue)
      });

      if (res.success) {
        showToast('Acquisition closed & recorded to portfolio!');
        setIsModalOpen(false);
        await loadData();
      } else {
        showToast(res.error || 'Failed to record closing', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = search === '' ||
      t.apn.toLowerCase().includes(search.toLowerCase()) ||
      t.county.toLowerCase().includes(search.toLowerCase()) ||
      t.state.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVolume = transactions.reduce((sum, t) => sum + (t.status === 'SOLD' ? t.estimatedCurrentValue : t.purchasePrice), 0);
  const totalUnrealized = transactions.reduce((sum, t) => sum + (t.unrealizedProfit || 0), 0);
  const ownedCount = transactions.filter(t => t.status === 'OWNED').length;

  const getStatusColor = (status: string) => {
    if (status === 'SOLD') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'UNDER_CONTRACT') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status === 'LISTED') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
                <BadgeDollarSign className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Transactions & Closings</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Escrow tracking, purchase contract execution, closing statements, and cost basis capitalization
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-fuchsia-600/20 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Record Closing
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Total Transactions</span>
            <p className="text-2xl font-bold mt-1 text-white">{transactions.length}</p>
            <span className="text-[10px] text-slate-500">Recorded in ledger</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Capital Deployed</span>
            <p className="text-2xl font-bold mt-1 text-white">${totalVolume.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Cumulative acquisition volume</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Active Owned Holdings</span>
            <p className="text-2xl font-bold mt-1 text-fuchsia-400">{ownedCount}</p>
            <span className="text-[10px] text-slate-500">Currently held in portfolio</span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Unrealized Capital Gain</span>
            <p className="text-2xl font-bold mt-1 text-emerald-400">${totalUnrealized.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Appreciation above basis</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by APN, County, or State..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-fuchsia-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-fuchsia-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="OWNED">OWNED</option>
            <option value="UNDER_CONTRACT">UNDER CONTRACT</option>
            <option value="LISTED">LISTED</option>
            <option value="SOLD">SOLD</option>
          </select>
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-fuchsia-400" />
            <p className="text-sm">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400">
            No transactions match criteria. Click "Record Closing" to record your first completed purchase.
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Property APN</th>
                    <th className="p-3.5">Acquisition Date</th>
                    <th className="p-3.5">Purchase Price</th>
                    <th className="p-3.5">Total Basis</th>
                    <th className="p-3.5">Current Value</th>
                    <th className="p-3.5">Unrealized Gain</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Links</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                          {tx.apn}
                          {tx.propertyId && (
                            <Link href={`/properties/${tx.propertyId}`} className="text-slate-500 hover:text-indigo-400">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {tx.county}, {tx.state} • {tx.acreage} AC
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-300 font-mono">
                        {new Date(tx.acquisitionDate).toLocaleDateString()}
                      </td>

                      <td className="p-3.5 font-semibold text-white">
                        ${tx.purchasePrice.toLocaleString()}
                      </td>

                      <td className="p-3.5 text-slate-300 font-medium">
                        ${tx.totalCostBasis.toLocaleString()}
                      </td>

                      <td className="p-3.5 font-semibold text-emerald-400">
                        ${tx.estimatedCurrentValue.toLocaleString()}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        +${(tx.unrealizedProfit || 0).toLocaleString()}
                      </td>

                      <td className="p-3.5">
                        <select
                          value={tx.status}
                          onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-fuchsia-500 font-medium"
                        >
                          <option value="OWNED">OWNED</option>
                          <option value="LISTED">LISTED</option>
                          <option value="UNDER_CONTRACT">UNDER CONTRACT</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right">
                        <Link
                          href="/portfolio"
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] inline-flex items-center gap-1 font-medium"
                        >
                          Portfolio View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Record Closing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-fuchsia-400" /> Record Closing / Capitalize Acquisition
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordClosing} className="space-y-4 mt-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Select Acquired Property *</label>
                <select
                  required
                  value={newClosing.propertyId}
                  onChange={(e) => {
                    const p = properties.find(prop => prop.id === e.target.value);
                    setNewClosing({
                      ...newClosing,
                      propertyId: e.target.value,
                      purchasePrice: p?.suggestedOfferPrice || p?.askingPrice || 50000,
                      estimatedCurrentValue: p?.estimatedMarketValue || 75000
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>APN {p.apn} ({p.county}, {p.state} - {p.acreage} AC)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Purchase Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newClosing.purchasePrice}
                    onChange={(e) => setNewClosing({ ...newClosing, purchasePrice: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Closing Fees ($)</label>
                  <input
                    type="number"
                    value={newClosing.closingCosts}
                    onChange={(e) => setNewClosing({ ...newClosing, closingCosts: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Holding & Carry Costs ($)</label>
                  <input
                    type="number"
                    value={newClosing.holdingCosts}
                    onChange={(e) => setNewClosing({ ...newClosing, holdingCosts: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Est. Current Value ($)</label>
                  <input
                    type="number"
                    value={newClosing.estimatedCurrentValue}
                    onChange={(e) => setNewClosing({ ...newClosing, estimatedCurrentValue: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold"
                >
                  {isSubmitting ? 'Recording...' : 'Record Acquisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
