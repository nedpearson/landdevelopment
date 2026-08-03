'use client';
import React, { useState } from 'react';
import { Search, Plus, Zap, Check, X, Edit2 } from 'lucide-react';

const MOCK_TRANS = [
  { id: 'TX-01', project: 'Solar Alpha', sub: 'Cedar Creek 345kV', dist: '1.2', voltage: '345', capacity: '400', risk: 'Low', queue: 'Moderate', notes: 'Upgrade required on main bus' },
  { id: 'TX-02', project: 'Solar Beta', sub: 'Elgin 138kV', dist: '3.5', voltage: '138', capacity: '150', risk: 'High', queue: 'Congested', notes: 'Thermal limits reached' },
  { id: 'TX-03', project: 'Wind Gamma', sub: 'Lake Creek 345kV', dist: '0.5', voltage: '345', capacity: '800', risk: 'Low', queue: 'Clear', notes: 'Good injection point' },
  { id: 'TX-04', project: 'Storage Delta', sub: 'Austin NW 138kV', dist: '2.0', voltage: '138', capacity: '50', risk: 'Med', queue: 'Moderate', notes: 'Voltage support needed' },
  { id: 'TX-05', project: 'Solar Epsilon', sub: 'Georgetown 69kV', dist: '0.2', voltage: '69', capacity: '20', risk: 'High', queue: 'Congested', notes: 'Reconductoring likely required' },
];

export default function TransmissionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transmission Analysis</h1>
          <p className="text-sm text-slate-400">Evaluate POI capacity and constraint risks.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Substation
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search POIs..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Project</th>
                <th className="px-6 py-3">Nearest Substation</th>
                <th className="px-6 py-3">Distance (mi)</th>
                <th className="px-6 py-3">Voltage (kV)</th>
                <th className="px-6 py-3">Avail. Cap. (MW)</th>
                <th className="px-6 py-3">Constraint Risk</th>
                <th className="px-6 py-3">Queue Status</th>
                <th className="px-6 py-3">Notes</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANS.map((item) => (
                <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.project}</td>
                  <td className="px-6 py-4 text-yellow-400">{item.sub}</td>
                  <td className="px-6 py-4">{item.dist}</td>
                  <td className="px-6 py-4">{item.voltage}</td>
                  <td className="px-6 py-4 font-medium">{item.capacity}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${
                      item.risk === 'Low' ? 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50' :
                      item.risk === 'Med' ? 'bg-amber-900/50 text-amber-400 border-amber-700/50' :
                      'bg-red-900/50 text-red-400 border-red-700/50'
                    }`}>
                      {item.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.queue}</td>
                  <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={item.notes}>{item.notes}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => showToast('Edit notes')} className="text-slate-400 hover:text-white">
                      <Edit2 className="w-4 h-4" />
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
              <h2 className="text-xl font-bold text-white">Add Substation Target</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Substation Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-500" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={() => { showToast('Substation saved'); setIsModalOpen(false); }} className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-yellow-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
