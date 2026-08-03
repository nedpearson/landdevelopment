'use client';

import React, { useState } from 'react';
import { Anchor, Plus, AlertCircle, CheckCircle } from 'lucide-react';

const MOCK_HBP = [
  { id: '1', tract: 'Smith 40', lease: 'TX-99812', lessor: 'Smith Family Trust', lessee: 'Big Oil Co', status: 'Confirmed', well: 'Smith #1H', prodStatus: 'Active', formation: 'Eagle Ford' },
  { id: '2', tract: 'Riverside 120', lease: 'TX-44521', lessor: 'Riverside Holdings', lessee: 'Energy Corp', status: 'Uncertain', well: 'River #2', prodStatus: 'Shut-In', formation: 'Austin Chalk' },
];

export default function HBPTracker() {
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-yellow-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Anchor className="w-6 h-6 mr-3 text-yellow-500" />
            Held-By-Production Tracker
          </h1>
          <p className="text-slate-400">Monitor mineral lease HBP status and production</p>
        </div>
        <button onClick={() => showToast('Opening Add Record modal...')} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Record
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Tract / Lease</th>
              <th className="p-4 font-medium">Parties</th>
              <th className="p-4 font-medium">HBP Status</th>
              <th className="p-4 font-medium">Well & Production</th>
              <th className="p-4 font-medium">Formation</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HBP.map(record => (
              <tr key={record.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{record.tract}</div>
                  <div className="text-xs text-slate-400 mt-1">Lease: {record.lease}</div>
                </td>
                <td className="p-4 text-sm">
                  <div>Lessor: {record.lessor}</div>
                  <div className="text-slate-400">Lessee: {record.lessee}</div>
                </td>
                <td className="p-4">
                  {record.status === 'Confirmed' ? (
                    <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Confirmed</span>
                  ) : (
                    <span className="bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Uncertain</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-300">{record.well}</div>
                  <div className="text-xs text-slate-500 mt-1">Status: {record.prodStatus}</div>
                </td>
                <td className="p-4 text-sm text-slate-400">{record.formation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
