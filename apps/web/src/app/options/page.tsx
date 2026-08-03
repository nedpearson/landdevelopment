'use client';
import React, { useState } from 'react';
import { Search, Plus, Calendar, Check, X, RefreshCw } from 'lucide-react';

const MOCK_OPTIONS = [
  { id: 'OPT-001', landowner: 'Smith Farms LLC', parcels: 'P-001', acreage: 120, start: '2023-05-10', end: '2027-05-10', payment: '$12,000', status: 'Active' },
  { id: 'OPT-002', landowner: 'Carter Family', parcels: 'P-005, P-006', acreage: 360, start: '2023-11-01', end: '2026-11-01', payment: '$21,000', status: 'Active' },
  { id: 'OPT-003', landowner: 'Davis Ranch', parcels: 'P-010', acreage: 150, start: '2021-08-15', end: '2024-08-15', payment: '$15,000', status: 'Expiring Soon' },
  { id: 'OPT-004', landowner: 'Johnson Trust', parcels: 'P-002', acreage: 85, start: '2020-01-01', end: '2023-01-01', payment: '$8,500', status: 'Exercised' },
  { id: 'OPT-005', landowner: 'Miller Co', parcels: 'P-012', acreage: 50, start: '2020-05-01', end: '2022-05-01', payment: '$5,000', status: 'Expired' },
];

export default function OptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50';
      case 'Expiring Soon': return 'bg-amber-900/50 text-amber-400 border-amber-700/50';
      case 'Exercised': return 'bg-blue-900/50 text-blue-400 border-blue-700/50';
      case 'Expired': return 'bg-red-900/50 text-red-400 border-red-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Option Agreements</h1>
          <p className="text-sm text-slate-400">Track land option agreements and expirations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Record Option
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search agreements..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Landowner</th>
                <th className="px-6 py-3">Parcel(s)</th>
                <th className="px-6 py-3">Acreage</th>
                <th className="px-6 py-3">Option Start</th>
                <th className="px-6 py-3">Expiration Date</th>
                <th className="px-6 py-3">Annual Payment</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_OPTIONS.map((opt) => (
                <tr key={opt.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{opt.landowner}</td>
                  <td className="px-6 py-4 text-sky-400">{opt.parcels}</td>
                  <td className="px-6 py-4">{opt.acreage} ac</td>
                  <td className="px-6 py-4">{opt.start}</td>
                  <td className={`px-6 py-4 font-medium ${opt.status === 'Expiring Soon' ? 'text-amber-400' : ''}`}>{opt.end}</td>
                  <td className="px-6 py-4">{opt.payment}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusStyle(opt.status)}`}>
                      {opt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => showToast(`Renewing option for ${opt.landowner}`)} className="inline-flex items-center px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-xs">
                      <RefreshCw className="w-3 h-3 mr-1.5" /> Renew
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Record New Option</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Landowner</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Start Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">End Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={() => { showToast('Option recorded successfully'); setIsModalOpen(false); }} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors">Save Option</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-sky-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
