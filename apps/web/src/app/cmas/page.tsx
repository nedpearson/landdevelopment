'use client';

import React, { useState } from 'react';
import { BarChart3, Plus, FileText, Calendar, CheckCircle, Clock } from 'lucide-react';

const MOCK_CMAS = [
  { id: '1', name: 'Riverside Valuation Oct 2023', property: 'Riverside 120 AC', client: 'Internal', date: '2023-10-15', comps: 4, range: '$1.1M - $1.4M', value: '$1.25M', status: 'Presented' },
  { id: '2', name: 'Smith Tract Pre-Listing', property: 'Smith Tract', client: 'Sarah Jenkins', date: '2023-10-22', comps: 3, range: '$400K - $480K', value: '$450K', status: 'Draft' },
];

export default function CMAsPage() {
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-sky-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-3 text-sky-500" />
            Comparative Market Analysis
          </h1>
          <p className="text-slate-400">Create and manage property valuations</p>
        </div>
        <button onClick={() => showToast('Opening CMA Wizard...')} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Create CMA
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">CMA Name / Subject</th>
              <th className="p-4 font-medium">Prepared For</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Metrics</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CMAS.map(cma => (
              <tr key={cma.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{cma.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{cma.property}</div>
                </td>
                <td className="p-4 text-sm">{cma.client}</td>
                <td className="p-4 text-sm text-slate-400 flex items-center mt-2"><Calendar className="w-3 h-3 mr-1" /> {cma.date}</td>
                <td className="p-4">
                  <div className="text-sm font-medium text-white">Val: {cma.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{cma.comps} Comps • {cma.range}</div>
                </td>
                <td className="p-4">
                  {cma.status === 'Draft' ? (
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> Draft</span>
                  ) : (
                    <span className="bg-sky-900/30 text-sky-400 border border-sky-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Presented</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => showToast('Generating PDF...')} className="text-slate-400 hover:text-white bg-slate-700 px-3 py-1.5 rounded text-sm flex items-center ml-auto">
                    <FileText className="w-4 h-4 mr-1" /> View/Print
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
