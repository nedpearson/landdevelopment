'use client';
import React, { useState } from 'react';
import { Search, Plus, Filter, Phone, Mail, FileText, Check, X } from 'lucide-react';

const MOCK_LANDOWNERS = [
  { id: 'L-01', name: 'Smith Farms LLC', parcels: 3, acres: 350, method: 'Email', lastContact: '2024-05-12', status: 'Signed', amount: '$35,000' },
  { id: 'L-02', name: 'Johnson Trust', parcels: 1, acres: 85, method: 'Phone', lastContact: '2024-06-01', status: 'In Negotiation', amount: '$8,500' },
  { id: 'L-03', name: 'Ranch Holdings Inc', parcels: 5, acres: 1200, method: 'Mail', lastContact: '2024-01-15', status: 'Not Contacted', amount: '-' },
  { id: 'L-04', name: 'Elm Grove LLC', parcels: 2, acres: 145, method: 'Email', lastContact: '2024-05-20', status: 'Declined', amount: '-' },
  { id: 'L-05', name: 'Carter Family', parcels: 2, acres: 210, method: 'In Person', lastContact: '2024-06-10', status: 'Signed', amount: '$21,000' },
];

export default function LandownersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<any>(null);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      'Signed': 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50',
      'In Negotiation': 'bg-blue-900/50 text-blue-400 border-blue-700/50',
      'Not Contacted': 'bg-slate-700 text-slate-300 border-slate-600',
      'Declined': 'bg-red-900/50 text-red-400 border-red-700/50',
    };
    return styles[status] || styles['Not Contacted'];
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Landowner CRM</h1>
            <p className="text-sm text-slate-400">Manage communications and negotiation status.</p>
          </div>
          <button onClick={() => showToast('Add landowner modal opened')} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Contact
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search landowners..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
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
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Parcels</th>
                  <th className="px-6 py-3">Total Acres</th>
                  <th className="px-6 py-3">Method</th>
                  <th className="px-6 py-3">Last Contact</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LANDOWNERS.map((owner) => (
                  <tr 
                    key={owner.id} 
                    className={`border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors cursor-pointer ${selectedOwner?.id === owner.id ? 'bg-slate-700/30' : ''}`}
                    onClick={() => setSelectedOwner(owner)}
                  >
                    <td className="px-6 py-4 font-medium text-white">{owner.name}</td>
                    <td className="px-6 py-4">{owner.parcels}</td>
                    <td className="px-6 py-4">{owner.acres} ac</td>
                    <td className="px-6 py-4">{owner.method}</td>
                    <td className="px-6 py-4">{owner.lastContact}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusBadge(owner.status)}`}>
                        {owner.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{owner.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedOwner && (
        <div className="w-full md:w-80 bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col h-fit sticky top-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white">{selectedOwner.name}</h2>
            <button onClick={() => setSelectedOwner(null)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Acres</span>
              <span className="font-medium text-white">{selectedOwner.acres} ac</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-medium text-white">{selectedOwner.status}</span>
            </div>
            <div className="border-t border-slate-700 pt-4 mt-4">
              <h3 className="font-medium text-white mb-2">Communication History</h3>
              <div className="space-y-3">
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-indigo-400 text-xs">{selectedOwner.lastContact}</span>
                    <span className="text-xs text-slate-500">{selectedOwner.method}</span>
                  </div>
                  <p className="text-xs text-slate-300">Followed up on proposal. Sent revised terms via email.</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 pt-4">
              <button onClick={() => showToast('Logging call...')} className="flex-1 flex justify-center items-center py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                <Phone className="w-4 h-4 mr-2" /> Log Call
              </button>
              <button onClick={() => showToast('Drafting email...')} className="flex-1 flex justify-center items-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                <Mail className="w-4 h-4 mr-2" /> Email
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-indigo-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
