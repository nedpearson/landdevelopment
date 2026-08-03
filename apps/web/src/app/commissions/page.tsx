'use client';

import React, { useState } from 'react';
import { DollarSign, Plus, X, Search, Check, Wallet, ArrowUpRight, Clock } from 'lucide-react';

type CommStatus = 'Pending' | 'Received' | 'Distributed';

interface Commission {
  id: string;
  address: string;
  closeDate: string;
  salesPrice: number;
  commRate: number;
  grossComm: number;
  splitPercent: number;
  netComm: number;
  status: CommStatus;
}

const MOCK_COMMS: Commission[] = [
  { id: '1', address: '1200 Commerce Blvd', closeDate: '2023-11-15', salesPrice: 3500000, commRate: 3.0, grossComm: 105000, splitPercent: 50, netComm: 52500, status: 'Distributed' },
  { id: '2', address: '850 Industrial Pkwy', closeDate: '2023-12-01', salesPrice: 5200000, commRate: 2.5, grossComm: 130000, splitPercent: 60, netComm: 78000, status: 'Received' },
  { id: '3', address: '400 Main St Retail', closeDate: '2024-01-10', salesPrice: 2100000, commRate: 4.0, grossComm: 84000, splitPercent: 50, netComm: 42000, status: 'Pending' },
  { id: '4', address: '9900 Medical Plaza', closeDate: '2024-02-05', salesPrice: 4100000, commRate: 3.0, grossComm: 123000, splitPercent: 50, netComm: 61500, status: 'Pending' },
  { id: '5', address: '250 Warehouse Way', closeDate: '2023-10-20', salesPrice: 12500000, commRate: 1.5, grossComm: 187500, splitPercent: 70, netComm: 131250, status: 'Distributed' }
];

export default function CommissionsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = MOCK_COMMS.filter(c => c.address.toLowerCase().includes(search.toLowerCase()));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const StatusBadge = ({ status }: { status: CommStatus }) => {
    const styles = {
      'Pending': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Received': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      'Distributed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>{status}</span>;
  };

  const ytdEarnings = MOCK_COMMS.filter(c => c.status === 'Distributed' || c.status === 'Received').reduce((acc, curr) => acc + curr.netComm, 0);
  const pendingComms = MOCK_COMMS.filter(c => c.status === 'Pending').reduce((acc, curr) => acc + curr.netComm, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="text-emerald-500" />
            Commissions Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track pipeline and realized earnings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Commission
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0">
            <Wallet className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium mb-1">Realized Earnings</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(ytdEarnings)}</div>
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center gap-6">
          <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <div className="text-slate-400 text-sm font-medium mb-1">Pending Pipeline</div>
            <div className="text-3xl font-bold text-white">{formatCurrency(pendingComms)}</div>
          </div>
        </div>
      </div>

      <div className="mb-6 relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text"
          placeholder="Search by address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Deal / Address</th>
                <th className="px-4 py-3 font-medium">Close Date</th>
                <th className="px-4 py-3 font-medium text-right">Sales Price</th>
                <th className="px-4 py-3 font-medium text-right">Comm %</th>
                <th className="px-4 py-3 font-medium text-right">Gross Comm</th>
                <th className="px-4 py-3 font-medium text-right">Your Split %</th>
                <th className="px-4 py-3 font-medium text-right text-emerald-400">Net Comm</th>
                <th className="px-4 py-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.map(comm => (
                <tr key={comm.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-white">{comm.address}</td>
                  <td className="px-4 py-4 text-slate-300">{new Date(comm.closeDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-slate-300 text-right">{formatCurrency(comm.salesPrice)}</td>
                  <td className="px-4 py-4 text-slate-300 text-right">{comm.commRate}%</td>
                  <td className="px-4 py-4 text-slate-300 text-right">{formatCurrency(comm.grossComm)}</td>
                  <td className="px-4 py-4 text-slate-300 text-right">{comm.splitPercent}%</td>
                  <td className="px-4 py-4 text-right font-bold text-emerald-400">{formatCurrency(comm.netComm)}</td>
                  <td className="px-4 py-4 text-center"><StatusBadge status={comm.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add Commission</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Commission tracking persistence coming soon'); setIsModalOpen(false); }}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Close Date</label>
                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Sales Price ($)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Total Commission (%)</label>
                    <input required type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="0.0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Your Split (%)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                    <option>Pending</option>
                    <option>Received</option>
                    <option>Distributed</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Commission</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-500">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
