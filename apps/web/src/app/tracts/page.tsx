'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, X, CheckCircle, MapPin } from 'lucide-react';

interface Tract {
  id: string;
  tractNum: string;
  county: string;
  state: string;
  legalDesc: string;
  grossAcres: number;
  nma: number;
  surfaceOwner: string;
  mineralOwner: string;
  leaseStatus: 'Open' | 'Leased' | 'HBP' | 'Negotiating';
  titleStatus: string;
}

const initialTracts: Tract[] = [
  { id: '1', tractNum: 'TR-1045', county: 'Midland', state: 'TX', legalDesc: 'Sec 12, Blk 39, T-1-S, T&P RR Co Survey', grossAcres: 640.0, nma: 160.0, surfaceOwner: 'Smith Ranch LLC', mineralOwner: 'John Doe', leaseStatus: 'Open', titleStatus: 'Cleared' },
  { id: '2', tractNum: 'TR-1046', county: 'Midland', state: 'TX', legalDesc: 'Sec 13, Blk 39, T-1-S, T&P RR Co Survey', grossAcres: 320.0, nma: 320.0, surfaceOwner: 'Texas Land Trust', mineralOwner: 'Texas Land Trust', leaseStatus: 'Leased', titleStatus: 'Needs Curative' },
  { id: '3', tractNum: 'TR-2201', county: 'Karnes', state: 'TX', legalDesc: 'A-124, J. Maria Survey', grossAcres: 150.5, nma: 75.25, surfaceOwner: 'Garcia Family LP', mineralOwner: 'Maria Garcia', leaseStatus: 'HBP', titleStatus: 'Cleared' },
  { id: '4', tractNum: 'TR-3390', county: 'Washington', state: 'PA', legalDesc: 'Parcel 12-44-A, Smith Twp', grossAcres: 85.0, nma: 85.0, surfaceOwner: 'William Penn', mineralOwner: 'William Penn', leaseStatus: 'Negotiating', titleStatus: 'In Review' },
  { id: '5', tractNum: 'TR-4011', county: 'McKenzie', state: 'ND', legalDesc: 'NW/4 Sec 5, T150N, R99W', grossAcres: 160.0, nma: 40.0, surfaceOwner: 'Dakota Farms Inc', mineralOwner: 'State of ND', leaseStatus: 'Leased', titleStatus: 'Cleared' },
];

export default function TractsPage() {
  const [tracts, setTracts] = useState<Tract[]>(initialTracts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddTract = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Tract added successfully');
  };

  const filteredTracts = tracts.filter(t => t.tractNum.toLowerCase().includes(search.toLowerCase()) || t.legalDesc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tracts Manager</h1>
          <p className="text-slate-400">Manage land tracts, descriptions, and basic ownership.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Tract
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tracts or legal descriptions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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
                <th className="px-6 py-4">Tract #</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Legal Desc</th>
                <th className="px-6 py-4">Gross/NMA</th>
                <th className="px-6 py-4">Surface / Mineral Owner</th>
                <th className="px-6 py-4">Lease Status</th>
                <th className="px-6 py-4">Title Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredTracts.map((tract) => (
                <tr key={tract.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${tract.tractNum}`)}>
                  <td className="px-6 py-4 font-medium text-indigo-400">{tract.tractNum}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {tract.county}, {tract.state}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm truncate max-w-xs" title={tract.legalDesc}>{tract.legalDesc}</td>
                  <td className="px-6 py-4 text-sm">
                    {tract.grossAcres} / <span className="text-slate-300 font-medium">{tract.nma}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="text-slate-300">{tract.surfaceOwner}</div>
                    <div className="text-slate-500 text-xs">{tract.mineralOwner}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tract.leaseStatus === 'Open' ? 'bg-slate-600 text-slate-200' :
                      tract.leaseStatus === 'Leased' ? 'bg-indigo-500/20 text-indigo-400' :
                      tract.leaseStatus === 'HBP' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tract.leaseStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{tract.titleStatus}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white" onClick={(e) => { e.stopPropagation(); showToast('Menu opened'); }}>
                      <MoreVertical size={20} />
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
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Tract</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddTract} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Tract #</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">County</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Legal Description</label>
                <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Gross Acres</label>
                  <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">NMA</label>
                  <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Surface Owner</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Mineral Owner</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save Tract</button>
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
