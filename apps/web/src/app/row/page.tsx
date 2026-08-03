'use client';

import { submitGenericForm } from '@/actions/genericActions';
import React, { useState } from 'react';
import { Plus, Search, Filter, X, CheckCircle, Route } from 'lucide-react';

interface ROWSegment {
  id: string;
  name: string;
  type: string;
  length: number;
  width: number;
  permAcres: number;
  tempAcres: number;
  offer: number;
  signed: boolean;
  risk: 'Low' | 'Medium' | 'High';
}

const mockROW: ROWSegment[] = [
  { id: '1', name: 'Segment 1 - Smith', type: 'Pipeline', length: 120, width: 50, permAcres: 2.27, tempAcres: 1.13, offer: 25000, signed: true, risk: 'Low' },
  { id: '2', name: 'Segment 2 - Jones', type: 'Pipeline', length: 300, width: 50, permAcres: 5.68, tempAcres: 2.84, offer: 65000, signed: false, risk: 'Medium' },
  { id: '3', name: 'Access Rd A', type: 'Road', length: 85, width: 30, permAcres: 0.96, tempAcres: 0.00, offer: 15000, signed: true, risk: 'Low' },
  { id: '4', name: 'Segment 3 - Penn', type: 'Pipeline', length: 410, width: 50, permAcres: 7.76, tempAcres: 3.88, offer: 85000, signed: false, risk: 'High' },
  { id: '5', name: 'Substation Pad', type: 'Facility', length: 0, width: 0, permAcres: 5.00, tempAcres: 2.00, offer: 150000, signed: false, risk: 'Low' },
];

export default function ROWPage() {
  const [segments, setSegments] = useState<ROWSegment[]>(mockROW);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitGenericForm(Object.fromEntries(formData.entries()));
    setIsModalOpen(false);
    showToast(result.success ? 'Saved successfully!' : 'Error saving');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredSegments = segments.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()));

  const toggleSigned = (id: string) => {
    setSegments(segments.map(s => s.id === id ? { ...s, signed: !s.signed } : s));
    showToast('Status updated');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Route className="text-cyan-500" />
            Right of Way
          </h1>
          <p className="text-slate-400">Manage pipeline easements, roads, and surface facilities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Segment
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search segments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
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
                <th className="px-6 py-4">Segment Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Length (Rods)</th>
                <th className="px-6 py-4 text-right">Width (Ft)</th>
                <th className="px-6 py-4 text-right">Perm / Temp Acres</th>
                <th className="px-6 py-4 text-right">Offer Amount</th>
                <th className="px-6 py-4 text-center">Signed</th>
                <th className="px-6 py-4">Condemnation Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredSegments.map((seg) => (
                <tr key={seg.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-cyan-400">{seg.name}</td>
                  <td className="px-6 py-4 text-slate-300">{seg.type}</td>
                  <td className="px-6 py-4 text-right">{seg.length > 0 ? seg.length : '-'}</td>
                  <td className="px-6 py-4 text-right">{seg.width > 0 ? seg.width : '-'}</td>
                  <td className="px-6 py-4 text-right">{seg.permAcres} / {seg.tempAcres}</td>
                  <td className="px-6 py-4 text-right">${seg.offer.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={seg.signed} 
                      onChange={() => toggleSigned(seg.id)}
                      className="w-4 h-4 rounded bg-slate-900 border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      seg.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                      seg.risk === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {seg.risk}
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
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add ROW Segment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Segment Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Infrastructure Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none">
                    <option>Pipeline</option>
                    <option>Road</option>
                    <option>Facility</option>
                    <option>Powerline</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Length (Rods)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Easement Width (Ft)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Permanent Acres</label>
                  <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Temporary Workspace Acres</label>
                  <input type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Offer Amount ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Condemnation Risk</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Save Segment</button>
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
