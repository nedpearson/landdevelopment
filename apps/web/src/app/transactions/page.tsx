'use client';

import React, { useState } from 'react';
import { BadgeDollarSign, TrendingUp, Search, Eye } from 'lucide-react';

interface Transaction {
  id: string;
  property: string;
  purchasePrice: number;
  salePrice?: number;
  closeDate: string;
  status: 'Closing' | 'Closed' | 'Cancelled';
  profit: number;
}

const mockTransactions: Transaction[] = [
  { id: '1', property: '045-123-45 (Costilla, CO)', purchasePrice: 4000, salePrice: 12000, closeDate: '2023-09-15', status: 'Closed', profit: 7500 },
  { id: '2', property: '102-44-091 (Mohave, AZ)', purchasePrice: 12000, salePrice: 28000, closeDate: '2023-10-01', status: 'Closed', profit: 14500 },
  { id: '3', property: '59-002-11 (Navajo, AZ)', purchasePrice: 25000, closeDate: '2023-11-15', status: 'Closing', profit: 0 },
  { id: '4', property: '88-101-02 (Valencia, NM)', purchasePrice: 1500, closeDate: '2023-10-10', status: 'Cancelled', profit: -250 },
  { id: '5', property: '303-91-88 (Elko, NV)', purchasePrice: 8000, salePrice: 19500, closeDate: '2023-08-22', status: 'Closed', profit: 10200 },
];

export default function TransactionsPage() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Closed') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'Closing') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

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
            <p className="text-3xl font-semibold">42</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Total Volume</h3>
            <p className="text-3xl font-semibold">$1.2M</p>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Avg ROI</h3>
            <div className="flex items-center text-3xl font-semibold text-emerald-400">
              <TrendingUp className="w-6 h-6 mr-2" /> 185%
            </div>
          </div>
          <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Active Transactions</h3>
            <p className="text-3xl font-semibold text-blue-400">8</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search by APN, County, or Status..."
              className="bg-transparent border-none outline-none w-full text-white"
            />
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Purchase Price</th>
                <th className="px-4 py-3">Sale Price</th>
                <th className="px-4 py-3">Close Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Profit/Loss</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-4 font-medium">{tx.property}</td>
                  <td className="px-4 py-4">${tx.purchasePrice.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {tx.salePrice ? `$${tx.salePrice.toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-4">{tx.closeDate}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-4 py-4 font-semibold text-right ${tx.profit > 0 ? 'text-emerald-400' : tx.profit < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {tx.profit > 0 ? '+' : ''}{tx.profit === 0 ? '-' : `$${Math.abs(tx.profit).toLocaleString()}`}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => showToast('Opening Settlement Statement...')} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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
