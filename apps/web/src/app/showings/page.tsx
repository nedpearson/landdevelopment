'use client';

import React, { useState } from 'react';
import { Calendar, Plus, MessageSquare, MapPin, User, Clock } from 'lucide-react';

const MOCK_SHOWINGS = [
  { id: '1', date: '2023-11-02 10:00 AM', property: 'Riverside 120 AC', client: 'Acme Dev Corp', agent: 'Ned Pearson', type: 'In-Person', duration: '2 hrs', feedback: 'Interested', followUp: '2023-11-05' },
  { id: '2', date: '2023-11-04 2:00 PM', property: 'Smith Tract', client: 'John Doe', agent: 'Sarah Jenkins', type: 'Virtual', duration: '45 mins', feedback: 'Pending', followUp: '-' },
];

export default function ShowingsPage() {
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-pink-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Calendar className="w-6 h-6 mr-3 text-pink-500" />
            Showings & Tours
          </h1>
          <p className="text-slate-400">Schedule property tours and track feedback</p>
        </div>
        <button onClick={() => showToast('Opening Scheduler...')} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Schedule Showing
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Date & Time</th>
              <th className="p-4 font-medium">Property / Client</th>
              <th className="p-4 font-medium">Agent</th>
              <th className="p-4 font-medium">Details</th>
              <th className="p-4 font-medium">Feedback</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_SHOWINGS.map(showing => (
              <tr key={showing.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-slate-400" /> {showing.date}</div>
                </td>
                <td className="p-4">
                  <div className="text-white flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-500" />{showing.property}</div>
                  <div className="text-sm text-slate-400 mt-1 flex items-center"><User className="w-3 h-3 mr-1" />{showing.client}</div>
                </td>
                <td className="p-4 text-sm">{showing.agent}</td>
                <td className="p-4 text-sm text-slate-400">
                  <div>{showing.type}</div>
                  <div>{showing.duration}</div>
                </td>
                <td className="p-4">
                  {showing.feedback === 'Interested' ? (
                    <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded text-xs">Interested</span>
                  ) : (
                    <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">Pending</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => showToast('Opening feedback form...')} className="text-slate-300 hover:text-white bg-slate-700 px-3 py-1.5 rounded text-sm flex items-center ml-auto">
                    <MessageSquare className="w-4 h-4 mr-2" /> Record Feedback
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
