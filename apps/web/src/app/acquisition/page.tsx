'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, X, CheckCircle, Target } from 'lucide-react';

interface AcquisitionTarget {
  id: string;
  landowner: string;
  tract: string;
  status: 'Identified' | 'Contacted' | 'Negotiating' | 'Signed' | 'Failed';
  offeredBonus: number;
  offeredRoyalty: string;
  contactDate: string;
  notes: string;
}

const mockTargets: AcquisitionTarget[] = [
  { id: '1', landowner: 'Smith Ranch LLC', tract: 'TR-1045', status: 'Negotiating', offeredBonus: 1500, offeredRoyalty: '1/4', contactDate: '2024-02-10', notes: 'Countered at $1800/ac, awaiting approval' },
  { id: '2', landowner: 'John Doe', tract: 'TR-1045', status: 'Signed', offeredBonus: 1500, offeredRoyalty: '1/4', contactDate: '2024-01-15', notes: 'Lease signed and recorded' },
  { id: '3', landowner: 'William Penn', tract: 'TR-3390', status: 'Contacted', offeredBonus: 800, offeredRoyalty: '3/16', contactDate: '2024-02-18', notes: 'Left VM with broker' },
  { id: '4', landowner: 'Dakota Farms Inc', tract: 'TR-4011', status: 'Failed', offeredBonus: 1000, offeredRoyalty: '1/6', contactDate: '2023-11-20', notes: 'Refuses to lease' },
  { id: '5', landowner: 'Maria Garcia', tract: 'TR-2201', status: 'Identified', offeredBonus: 2000, offeredRoyalty: '1/4', contactDate: '-', notes: 'Need updated contact info' },
];

export default function AcquisitionPage() {
  const [targets, setTargets] = useState<AcquisitionTarget[]>(mockTargets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTargets = targets.filter(t => t.landowner.toLowerCase().includes(search.toLowerCase()) || t.tract.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Target className="text-teal-500" />
            Lease Acquisition
          </h1>
          <p className="text-slate-400">Track landowner outreach and lease negotiations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Target
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search landowner or tract..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-teal-500 transition-colors"
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
                <th className="px-6 py-4">Landowner</th>
                <th className="px-6 py-4">Tract</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Offered Bonus</th>
                <th className="px-6 py-4">Offered Royalty</th>
                <th className="px-6 py-4">Last Contact</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTargets.map((target) => (
                <tr key={target.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => showToast('Viewing negotiation details')}>
                  <td className="px-6 py-4 font-medium text-teal-400">{target.landowner}</td>
                  <td className="px-6 py-4 text-slate-300">{target.tract}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      target.status === 'Identified' ? 'bg-slate-600 text-slate-300' :
                      target.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400' :
                      target.status === 'Negotiating' ? 'bg-amber-500/20 text-amber-400' :
                      target.status === 'Signed' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {target.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">${target.offeredBonus.toLocaleString()}</td>
                  <td className="px-6 py-4">{target.offeredRoyalty}</td>
                  <td className="px-6 py-4 text-slate-400">{target.contactDate}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{target.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add Acquisition Target</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); showToast('Database persistence for this module is coming soon. Your entry has been noted.', 'success'); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Landowner Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tract</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Initial Bonus Offer ($/ac)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Initial Royalty Offer</label>
                  <input type="text" placeholder="e.g. 1/4" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none">
                  <option>Identified</option>
                  <option>Contacted</option>
                  <option>Negotiating</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Notes</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-teal-500 focus:outline-none"></textarea>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Target</button>
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

