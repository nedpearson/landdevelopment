'use client';

import React, { useState } from 'react';
import { Plus, X, CheckCircle, Calculator, ChevronRight, Layers } from 'lucide-react';

interface Tract {
  id: string;
  name: string;
  desc: string;
}

interface OwnershipRow {
  id: string;
  instrument: string;
  grantor: string;
  grantee: string;
  date: string;
  interestType: string;
  num: number;
  den: number;
  decimal: number;
  depth: string;
}

const tractsList: Tract[] = [
  { id: '1', name: 'TR-1045', desc: 'Sec 12, Blk 39, T-1-S' },
  { id: '2', name: 'TR-1046', desc: 'Sec 13, Blk 39, T-1-S' },
  { id: '3', name: 'TR-2201', desc: 'A-124, J. Maria Survey' },
];

const mockOwnership: OwnershipRow[] = [
  { id: '1', instrument: 'Patent', grantor: 'State of Texas', grantee: 'John Smith', date: '1905-06-12', interestType: 'Fee Simple', num: 1, den: 1, decimal: 1.00000000, depth: 'All Depths' },
  { id: '2', instrument: 'Warranty Deed', grantor: 'John Smith', grantee: 'Robert Smith', date: '1940-02-15', interestType: 'Minerals', num: 1, den: 2, decimal: 0.50000000, depth: 'All Depths' },
  { id: '3', instrument: 'Warranty Deed', grantor: 'John Smith', grantee: 'Mary Jones', date: '1940-02-15', interestType: 'Minerals', num: 1, den: 2, decimal: 0.50000000, depth: 'All Depths' },
  { id: '4', instrument: 'Mineral Deed', grantor: 'Robert Smith', grantee: 'Texas Land Trust', date: '1975-10-01', interestType: 'Minerals', num: 1, den: 4, decimal: 0.25000000, depth: 'Below 5000ft' },
  { id: '5', instrument: 'Oil & Gas Lease', grantor: 'Mary Jones', grantee: 'Big Oil Corp', date: '2020-05-10', interestType: 'Leasehold', num: 1, den: 1, decimal: 0.75000000, depth: 'All Depths' }, // Net Revenue Interest calculation simplification
];

export default function OwnershipPage() {
  const [selectedTract, setSelectedTract] = useState<Tract>(tractsList[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddInstrument = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Database persistence for this module is coming soon. Your entry has been noted.', 'success');
  };

  const totalDecimal = mockOwnership.filter(o => o.interestType === 'Minerals').reduce((acc, curr) => acc + curr.decimal, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Calculator className="text-amber-500" />
            Ownership Calculator
          </h1>
          <p className="text-slate-400">Calculate mineral and leasehold ownership chains.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Instrument
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel - Tract Selector */}
        <div className="w-64 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-700 bg-slate-800/80 font-semibold text-slate-300">
            Select Tract
          </div>
          <div className="overflow-y-auto flex-1">
            {tractsList.map(tract => (
              <button
                key={tract.id}
                onClick={() => setSelectedTract(tract)}
                className={`w-full text-left p-4 border-b border-slate-700/50 transition-colors flex items-center justify-between ${
                  selectedTract.id === tract.id ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : 'hover:bg-slate-700/50'
                }`}
              >
                <div>
                  <div className={`font-medium ${selectedTract.id === tract.id ? 'text-amber-400' : 'text-slate-200'}`}>
                    {tract.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate mt-1">{tract.desc}</div>
                </div>
                <ChevronRight size={16} className={selectedTract.id === tract.id ? 'text-amber-500' : 'text-slate-600'} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel - Ownership Table */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/80">
            <div className="flex items-center gap-3">
              <Layers className="text-amber-500" size={20} />
              <h2 className="font-semibold text-lg text-white">Ownership Stack: {selectedTract.name}</h2>
            </div>
            <div className="text-sm text-slate-400">{selectedTract.desc}</div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800/50 border-b border-slate-700 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0">
                  <th className="px-4 py-3">Instrument</th>
                  <th className="px-4 py-3">Grantor</th>
                  <th className="px-4 py-3">Grantee</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Interest Type</th>
                  <th className="px-4 py-3">Fraction</th>
                  <th className="px-4 py-3 text-right">Decimal</th>
                  <th className="px-4 py-3">Depth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {mockOwnership.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-amber-400">{row.instrument}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{row.grantor}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{row.grantee}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{row.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        row.interestType === 'Fee Simple' ? 'bg-purple-500/20 text-purple-400' :
                        row.interestType === 'Minerals' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {row.interestType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 text-center">{row.num} / {row.den}</td>
                    <td className="px-4 py-3 text-sm text-white text-right font-mono">{row.decimal.toFixed(8)}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{row.depth}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 border-t-2 border-slate-600 font-semibold">
                  <td colSpan={6} className="px-4 py-4 text-right text-slate-400 uppercase text-xs tracking-wider">Total Active Mineral Interest</td>
                  <td className="px-4 py-4 text-right text-amber-400 font-mono">{totalDecimal.toFixed(8)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add Instrument</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddInstrument} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Instrument Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none">
                    <option>Warranty Deed</option>
                    <option>Mineral Deed</option>
                    <option>Oil & Gas Lease</option>
                    <option>Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Grantor</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Grantee</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Interest Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none">
                    <option>Minerals</option>
                    <option>Leasehold</option>
                    <option>Royalty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Numerator</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Denominator</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-amber-500 focus:outline-none" required />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        } text-white animate-fade-in-up`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

