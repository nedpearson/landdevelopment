'use client';
import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, Copy, Check } from 'lucide-react';

const MOCK_PARCELS = [
  { id: 'P-001', county: 'Travis', state: 'TX', acreage: 120, landowner: 'Smith Farms LLC', status: 'Option', expiry: '2027-05-10', payment: '$12,000', project: 'Solar Alpha' },
  { id: 'P-002', county: 'Travis', state: 'TX', acreage: 85, landowner: 'Johnson Trust', status: 'Lease', expiry: '2053-12-31', payment: '$34,000', project: 'Solar Alpha' },
  { id: 'P-003', county: 'Williamson', state: 'TX', acreage: 300, landowner: 'Ranch Holdings Inc', status: 'Uncontacted', expiry: '-', payment: '-', project: 'Solar Alpha' },
  { id: 'P-004', county: 'Williamson', state: 'TX', acreage: 45, landowner: 'Elm Grove LLC', status: 'Gap', expiry: '-', payment: '-', project: 'Solar Alpha' },
  { id: 'P-005', county: 'Bastrop', state: 'TX', acreage: 210, landowner: 'Carter Family', status: 'Option', expiry: '2026-11-01', payment: '$21,000', project: 'Solar Beta' },
];

export default function ParcelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Option': return 'bg-amber-900/50 text-amber-400 border-amber-700/50';
      case 'Lease': return 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50';
      case 'Uncontacted': return 'bg-slate-700 text-slate-300 border-slate-600';
      case 'Gap': return 'bg-red-900/50 text-red-400 border-red-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Parcel Manager</h1>
          <p className="text-sm text-slate-400">Track and manage site control parcels for renewable projects.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => showToast('Exporting to CSV...')} className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Parcel
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search parcels..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Parcel ID</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Location</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Acreage</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Landowner</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Status</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Option Expiry</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Annual Payment</th>
                <th className="px-6 py-3 cursor-pointer hover:text-white">Project</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PARCELS.map((parcel) => (
                <tr key={parcel.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${parcel.id}`)}>
                  <td className="px-6 py-4 font-medium text-emerald-400">{parcel.id}</td>
                  <td className="px-6 py-4">{parcel.county}, {parcel.state}</td>
                  <td className="px-6 py-4">{parcel.acreage} ac</td>
                  <td className="px-6 py-4">{parcel.landowner}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusColor(parcel.status)}`}>
                      {parcel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{parcel.expiry}</td>
                  <td className="px-6 py-4">{parcel.payment}</td>
                  <td className="px-6 py-4">{parcel.project}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(parcel.id); showToast('ID copied!'); }} className="text-slate-400 hover:text-white mr-2">
                      <Copy className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-white">Add New Parcel</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Parcel ID</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. P-007" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Landowner</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="Owner Name" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={() => { showToast('Parcel added successfully'); setIsModalOpen(false); }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors">Save Parcel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
