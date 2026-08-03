'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, X, CheckCircle, AlertTriangle } from 'lucide-react';

interface CurativeItem {
  id: string;
  requirement: string;
  category: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Review' | 'Cleared';
  assignedTo: string;
  targetDate: string;
}

const mockCurative: CurativeItem[] = [
  { id: '1', requirement: 'Obtain Ratification of OGL from Mary Jones', category: 'Leasehold', severity: 'Critical', status: 'Open', assignedTo: 'John Landman', targetDate: '2024-03-01' },
  { id: '2', requirement: 'Provide Death Certificate for Robert Smith', category: 'Heirship', severity: 'Major', status: 'In Review', assignedTo: 'Sarah Broker', targetDate: '2024-02-28' },
  { id: '3', requirement: 'Corrective Deed for Vol 45 Pg 211 (Missing Call)', category: 'Title Defect', severity: 'Critical', status: 'Cleared', assignedTo: 'John Landman', targetDate: '2024-01-15' },
  { id: '4', requirement: 'Affidavit of Use and Possession', category: 'Possession', severity: 'Minor', status: 'Open', assignedTo: 'Mike Field', targetDate: '2024-03-15' },
  { id: '5', requirement: 'Release of prior OGL to Texaco', category: 'Leasehold', severity: 'Major', status: 'In Review', assignedTo: 'Sarah Broker', targetDate: '2024-03-10' },
];

export default function CurativePage() {
  const [items, setItems] = useState<CurativeItem[]>(mockCurative);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Curative item added');
  };

  const filteredItems = items.filter(i => i.requirement.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()));

  const clearedCount = items.filter(i => i.status === 'Cleared').length;
  const progressPercent = Math.round((clearedCount / items.length) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="text-rose-500" />
            Curative Tracker
          </h1>
          <p className="text-slate-400">Track and manage title requirements and defects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Add Curative Item
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8 flex items-center gap-6">
        <div className="w-full max-w-xl">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300">Overall Progress</span>
            <span className="font-bold text-rose-400">{progressPercent}% Cleared</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{items.filter(i => i.status === 'Open').length}</div>
            <div className="text-slate-400">Open</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400">{items.filter(i => i.status === 'In Review').length}</div>
            <div className="text-slate-400">In Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">{clearedCount}</div>
            <div className="text-slate-400">Cleared</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search requirements or categories..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-rose-500 transition-colors"
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
                <th className="px-6 py-4">Title Requirement</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Target Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => showToast('Viewing details')}>
                  <td className="px-6 py-4 font-medium text-slate-200">{item.requirement}</td>
                  <td className="px-6 py-4 text-slate-400">{item.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      item.severity === 'Major' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Open' ? 'bg-slate-600 text-slate-300' :
                      item.status === 'In Review' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{item.assignedTo}</td>
                  <td className="px-6 py-4 text-slate-400">{item.targetDate}</td>
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
              <h2 className="text-xl font-semibold">Add Curative Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Requirement / Defect Description</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none" required></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none">
                    <option>Heirship</option>
                    <option>Leasehold</option>
                    <option>Title Defect</option>
                    <option>Possession</option>
                    <option>Mortgage</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Severity</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none">
                    <option>Critical</option>
                    <option>Major</option>
                    <option>Minor</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Assigned To</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Target Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-rose-500 focus:outline-none" required />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Save Item</button>
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
