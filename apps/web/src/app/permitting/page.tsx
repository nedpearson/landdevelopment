'use client';
import React, { useState } from 'react';
import { Search, Plus, AlertCircle, Check, X, FileText } from 'lucide-react';

const MOCK_PERMITS = [
  { id: 'PRM-01', type: 'County CUP', project: 'Solar Alpha', status: 'Under Review', filed: '2024-01-15', expiry: '-', agency: 'Travis County Planning' },
  { id: 'PRM-02', type: 'FAA Determ.', project: 'Wind Gamma', status: 'Approved', filed: '2023-10-01', expiry: '2025-10-01', agency: 'FAA OEI' },
  { id: 'PRM-03', type: 'USACE 404', project: 'Solar Alpha', status: 'Not Applied', filed: '-', expiry: '-', agency: 'USACE Fort Worth' },
  { id: 'PRM-04', type: 'State SWPPP', project: 'Solar Beta', status: 'Applied', filed: '2024-05-10', expiry: '-', agency: 'TCEQ' },
  { id: 'PRM-05', type: 'FWS Env', project: 'Wind Gamma', status: 'Under Review', filed: '2023-11-20', expiry: '-', agency: 'USFWS' },
];

export default function PermittingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50';
      case 'Under Review': return 'bg-blue-900/50 text-blue-400 border-blue-700/50';
      case 'Applied': return 'bg-purple-900/50 text-purple-400 border-purple-700/50';
      case 'Denied': return 'bg-red-900/50 text-red-400 border-red-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Permitting Tracker</h1>
          <p className="text-sm text-slate-400">Monitor local, state, and federal permit statuses.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Permit
        </button>
      </div>

      <div className="mb-6 p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg flex items-start space-x-3 text-amber-200">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-amber-400">Expiring Permits Alert</h3>
          <p className="text-sm mt-1">FAA Determination for Wind Gamma expires in 60 days. Renewal application needed.</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search permits..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Permit Type</th>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Filed Date</th>
                <th className="px-6 py-3">Expiry Date</th>
                <th className="px-6 py-3">Agency Contact</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PERMITS.map((item) => (
                <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.type}</td>
                  <td className="px-6 py-4 text-purple-400">{item.project}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.filed}</td>
                  <td className="px-6 py-4">{item.expiry}</td>
                  <td className="px-6 py-4">{item.agency}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => showToast('Opening document')} className="text-slate-400 hover:text-white">
                      <FileText className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-white">Add Permit Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Permit Type</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={() => { showToast('Permit saved'); setIsModalOpen(false); }} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-purple-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
