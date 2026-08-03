'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, X, CheckCircle, Download, FileSignature } from 'lucide-react';

interface Lease {
  id: string;
  leaseNum: string;
  lessor: string;
  lessee: string;
  effectiveDate: string;
  term: string;
  expiration: string;
  royalty: string;
  bonus: number;
  status: 'Active' | 'Expired' | 'HBP';
}

const mockLeases: Lease[] = [
  { id: '1', leaseNum: 'TX-OGL-1001', lessor: 'Smith Family Trust', lessee: 'ExxonMobil', effectiveDate: '2023-01-15', term: '3 Years', expiration: '2026-01-15', royalty: '1/4', bonus: 1500, status: 'Active' },
  { id: '2', leaseNum: 'TX-OGL-1002', lessor: 'John Doe', lessee: 'ExxonMobil', effectiveDate: '2021-06-01', term: '3 Years', expiration: '2024-06-01', royalty: '3/16', bonus: 1200, status: 'Active' },
  { id: '3', leaseNum: 'PA-OGL-405', lessor: 'William Penn', lessee: 'Chesapeake', effectiveDate: '2015-10-10', term: '5 Years', expiration: '2020-10-10', royalty: '15%', bonus: 500, status: 'HBP' },
  { id: '4', leaseNum: 'ND-OGL-882', lessor: 'Dakota Farms Inc', lessee: 'Continental', effectiveDate: '2019-03-20', term: '3 Years', expiration: '2022-03-20', royalty: '1/6', bonus: 800, status: 'Expired' },
  { id: '5', leaseNum: 'TX-OGL-1055', lessor: 'Garcia Family LP', lessee: 'EOG Resources', effectiveDate: '2012-08-01', term: '3 Years', expiration: '2015-08-01', royalty: '1/4', bonus: 2500, status: 'HBP' },
];

export default function LeasesPage() {
  const [leases, setLeases] = useState<Lease[]>(mockLeases);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddLease = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Lease added successfully');
  };

  const filteredLeases = leases.filter(l => l.leaseNum.toLowerCase().includes(search.toLowerCase()) || l.lessor.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileSignature className="text-lime-500" />
            Lease Records
          </h1>
          <p className="text-slate-400">Manage oil & gas leases, terms, and expirations.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => showToast('Exporting to CSV...')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download size={20} />
            Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Lease
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search lease # or lessor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-lime-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Lease #</th>
                <th className="px-6 py-4">Lessor</th>
                <th className="px-6 py-4">Lessee</th>
                <th className="px-6 py-4">Effective Date</th>
                <th className="px-6 py-4">Term</th>
                <th className="px-6 py-4">Expiration</th>
                <th className="px-6 py-4">Royalty</th>
                <th className="px-6 py-4">Bonus / NMA</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredLeases.map((lease) => (
                <tr key={lease.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => showToast(`Viewing lease ${lease.leaseNum}`)}>
                  <td className="px-6 py-4 font-medium text-lime-400">{lease.leaseNum}</td>
                  <td className="px-6 py-4">{lease.lessor}</td>
                  <td className="px-6 py-4">{lease.lessee}</td>
                  <td className="px-6 py-4 text-slate-300">{lease.effectiveDate}</td>
                  <td className="px-6 py-4 text-slate-300">{lease.term}</td>
                  <td className="px-6 py-4 text-slate-300">{lease.expiration}</td>
                  <td className="px-6 py-4 font-medium">{lease.royalty}</td>
                  <td className="px-6 py-4">${lease.bonus.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      lease.status === 'Active' ? 'bg-lime-500/20 text-lime-400' :
                      lease.status === 'HBP' ? 'bg-sky-500/20 text-sky-400' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {lease.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Lease</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddLease} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lease Number</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none">
                    <option>Active</option>
                    <option>HBP</option>
                    <option>Expired</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lessor</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Lessee</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Effective Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Primary Term (Years)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Expiration Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Royalty Fraction</label>
                  <input type="text" placeholder="e.g. 1/4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Bonus per NMA ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-lime-500 focus:outline-none" required />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700">Save Lease</button>
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
