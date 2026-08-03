'use client';

import React, { useState } from 'react';
import { ClipboardCheck, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function InspectionsPage() {
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const MOCK_INSPECTIONS = [
    { id: '1', date: '2026-08-15', property: '123 Main St - 101', inspector: 'John Doe', type: 'Move-in', status: 'Scheduled', score: '-', issues: 0 },
    { id: '2', date: '2026-07-20', property: '456 Oak Ave - A1', inspector: 'Jane Smith', type: 'Annual', status: 'Complete', score: '95/100', issues: 1 },
    { id: '3', date: '2026-07-10', property: '123 Main St - 102', inspector: 'John Doe', type: 'Move-out', status: 'Complete', score: '80/100', issues: 4 },
    { id: '4', date: '2026-08-20', property: '789 Pine Ln', inspector: 'City Inspector', type: 'HUD', status: 'Scheduled', score: '-', issues: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <ClipboardCheck className="w-8 h-8 text-lime-500" />
              Inspection Reports
            </h1>
            <p className="text-slate-400">Schedule and review property inspections.</p>
          </div>
          <button 
            onClick={() => showToast('Schedule modal opened')}
            className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Inspection
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Property/Unit</th>
                  <th className="p-4 font-medium">Inspector</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Issues</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {MOCK_INSPECTIONS.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 text-white">{insp.date}</td>
                    <td className="p-4 text-slate-300">{insp.property}</td>
                    <td className="p-4 text-slate-400">{insp.inspector}</td>
                    <td className="p-4 text-slate-300">{insp.type}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        insp.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {insp.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{insp.score}</td>
                    <td className="p-4 text-slate-400">{insp.issues > 0 ? <span className="text-red-400 font-medium">{insp.issues} Found</span> : 'None'}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => showToast('Viewing report')} className="text-slate-400 hover:text-white inline-flex items-center gap-1">
                        <FileText className="w-4 h-4" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}


