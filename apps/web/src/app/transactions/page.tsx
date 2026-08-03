'use client';

import React, { useState, useEffect } from 'react';
import { BadgeDollarSign, TrendingUp, Search, Eye } from 'lucide-react';
import { getTransactions } from '@/actions/transactionActions';

type Transaction = {
  id: string;
  apn: string;
  county: string;
  state: string;
  purchasePrice: number;
  totalCostBasis: number;
  estimatedCurrentValue: number;
  unrealizedProfit: number;
  acquisitionDate: Date;
  status: string;
  property: { address: string | null };
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data as any);
  };

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'SOLD') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'UNDER_CONTRACT') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (status === 'LISTED') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30'; // OWNED
  };

  const formatStatus = (s: string) => s.replace(/_/g, ' ');

  const activeTransactionsCount = transactions.filter(t => ['UNDER_CONTRACT', 'LISTED'].includes(t.status)).length;
  const totalVolume = transactions.reduce((sum, t) => sum + (t.status === 'SOLD' ? t.estimatedCurrentValue : t.purchasePrice), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-fuchsia-400 flex items-center">
            <BadgeDollarSign className="w-6 h-6 mr-2" />
            Transactions
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Total Deals</h3>
            <p className="text-3xl font-semibold">{transactions.length}</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Total Volume</h3>
            <p className="text-3xl font-semibold">${(totalVolume / 1000000).toFixed(2)}M</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Avg ROI</h3>
            <div className="flex items-center text-3xl font-semibold text-emerald-400">
              <TrendingUp className="w-6 h-6 mr-2" /> -
            </div>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Active Transactions</h3>
            <p className="text-3xl font-semibold text-blue-400">{activeTransactionsCount}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search by APN, County, or Status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-white"
            />
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Purchase Price</th>
                <th className="px-4 py-3">Current Val / Sale</th>
                <th className="px-4 py-3">Acquisition Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Profit/Loss</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {transactions.filter(t => t.apn.includes(search) || t.county.toLowerCase().includes(search.toLowerCase()) || t.status.toLowerCase().includes(search.toLowerCase())).map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-4 font-medium">
                    {tx.apn} ({tx.county}, {tx.state})
                  </td>
                  <td className="px-4 py-4">${tx.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-300">
                    ${tx.estimatedCurrentValue.toLocaleString()}
                  </td>
                  <td className="px-4 py-4">{new Date(tx.acquisitionDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(tx.status)}`}>
                      {formatStatus(tx.status)}
                    </span>
                  </td>
                  <td className={`px-4 py-4 font-semibold text-right ${tx.unrealizedProfit > 0 ? 'text-emerald-400' : tx.unrealizedProfit < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {tx.unrealizedProfit > 0 ? '+' : ''}{tx.unrealizedProfit === 0 ? '-' : `$${Math.abs(tx.unrealizedProfit).toLocaleString()}`}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => showToast('Opening details...')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
