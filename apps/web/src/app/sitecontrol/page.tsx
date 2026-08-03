'use client';
import React, { useState } from 'react';
import { Target, Map as MapIcon, AlertTriangle, Plus, PhoneCall, Check } from 'lucide-react';

const MOCK_GAPS = [
  { id: 'G-01', location: 'Williamson, TX', acreage: 45, landowner: 'Elm Grove LLC', priority: 'Critical' },
  { id: 'G-02', location: 'Travis, TX', acreage: 12, landowner: 'Unknown', priority: 'High' },
  { id: 'G-03', location: 'Bastrop, TX', acreage: 8.5, landowner: 'Smith Heirs', priority: 'Medium' },
  { id: 'G-04', location: 'Travis, TX', acreage: 105, landowner: 'Rivera Trust', priority: 'High' },
  { id: 'G-05', location: 'Williamson, TX', acreage: 2.1, landowner: 'State of Texas', priority: 'Low' },
];

export default function SiteControlPage() {
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Control Dashboard</h1>
          <p className="text-sm text-slate-400">Overview of project footprint and acquisition progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Total Target Acres</span>
          <span className="text-3xl font-bold text-white mt-2">2,450</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Acres Under Control</span>
          <span className="text-3xl font-bold text-emerald-400 mt-2">1,820</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">% Control</span>
          <span className="text-3xl font-bold text-white mt-2">74.3%</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Gaps / Holdouts</span>
          <span className="text-3xl font-bold text-red-400 mt-2">12</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-6 flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
        <MapIcon className="w-12 h-12 mb-4 opacity-50" />
        <p className="font-medium">Interactive Map View</p>
        <p className="text-sm mt-1">Map integration placeholder. Shows footprint and gaps.</p>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-lg font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" /> Site Control Gaps
          </h2>
          <button onClick={() => showToast('Opening add gap modal...')} className="flex items-center px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition-colors text-sm">
            <Plus className="w-4 h-4 mr-2" /> Add Gap
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Gap ID</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Acreage</th>
                <th className="px-6 py-3">Landowner</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_GAPS.map((gap) => (
                <tr key={gap.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-amber-400">{gap.id}</td>
                  <td className="px-6 py-4">{gap.location}</td>
                  <td className="px-6 py-4">{gap.acreage} ac</td>
                  <td className="px-6 py-4">{gap.landowner}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${
                      gap.priority === 'Critical' ? 'bg-red-900/50 text-red-400 border-red-700/50' :
                      gap.priority === 'High' ? 'bg-amber-900/50 text-amber-400 border-amber-700/50' :
                      'bg-slate-700 text-slate-300 border-slate-600'
                    }`}>
                      {gap.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => showToast(`Recording contact for ${gap.landowner}`)} className="flex items-center ml-auto px-3 py-1.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-xs">
                      <PhoneCall className="w-3 h-3 mr-1.5" /> Record Contact
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-amber-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
