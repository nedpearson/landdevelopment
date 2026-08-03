'use client';

import React, { useState } from 'react';
import { FileDown, Plus, FileText, CheckCircle, X, Search, ChevronRight, AlertCircle } from 'lucide-react';

interface Runsheet {
  id: string;
  name: string;
  project: string;
  tract: string;
  updatedAt: string;
}

interface RunsheetEntry {
  id: string;
  entryNum: number;
  instrument: string;
  date: string;
  volPage: string;
  grantor: string;
  grantee: string;
  notes: string;
  defect?: boolean;
}

const runsheetsList: Runsheet[] = [
  { id: '1', name: 'Permian TR-1045 SO/MI', project: 'Permian Alpha', tract: 'TR-1045', updatedAt: '2024-02-15' },
  { id: '2', name: 'Permian TR-1046 SO/MI', project: 'Permian Alpha', tract: 'TR-1046', updatedAt: '2024-02-14' },
  { id: '3', name: 'Eagle Ford TR-2201 MI', project: 'Eagle Ford Extension', tract: 'TR-2201', updatedAt: '2024-02-10' },
];

const mockEntries: RunsheetEntry[] = [
  { id: '1', entryNum: 1, instrument: 'Patent', date: '1910-04-12', volPage: '1/10', grantor: 'State of Texas', grantee: 'John Smith', notes: 'Patents all of Sec 12 to Smith' },
  { id: '2', entryNum: 2, instrument: 'WD', date: '1945-11-20', volPage: '45/211', grantor: 'John Smith', grantee: 'H&P Land Co', notes: 'Conveys surface and 50% minerals' },
  { id: '3', entryNum: 3, instrument: 'MD', date: '1945-12-05', volPage: '46/15', grantor: 'John Smith', grantee: 'Permian Trust', notes: 'Conveys remaining 50% minerals' },
  { id: '4', entryNum: 4, instrument: 'OGL', date: '1970-02-15', volPage: '120/44', grantor: 'H&P Land Co', grantee: 'Texaco Inc', notes: 'Primary term 3 yrs, 1/8 royalty' },
  { id: '5', entryNum: 5, instrument: 'Release', date: '2010-01-15', volPage: '1100/55', grantor: 'Chevron USA', grantee: 'H&P Land Co', notes: 'Releases lease at entry 4' },
  { id: '6', entryNum: 6, instrument: 'OGL', date: '2023-05-01', volPage: '2040/12', grantor: 'H&P Land Co', grantee: 'ExxonMobil', notes: 'Primary term 3 yrs, 1/4 royalty', defect: true },
];

export default function RunsheetsPage() {
  const [selectedRunsheet, setSelectedRunsheet] = useState<Runsheet>(runsheetsList[0]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    showToast('Runsheet PDF generated and downloading...');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="text-orange-500" />
            Title Runsheets
          </h1>
          <p className="text-slate-400">Generate and review title runsheets for projects.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FileDown size={20} />
            Export PDF
          </button>
          <button 
            onClick={() => showToast('New runsheet draft created')}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Generate Runsheet
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden shrink-0">
          <div className="p-4 border-b border-slate-700 bg-slate-800/80">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search runsheets..." 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {runsheetsList.map(rs => (
              <button
                key={rs.id}
                onClick={() => setSelectedRunsheet(rs)}
                className={`w-full text-left p-4 border-b border-slate-700/50 transition-colors flex flex-col gap-1 ${
                  selectedRunsheet.id === rs.id ? 'bg-orange-500/10 border-l-2 border-l-orange-500' : 'hover:bg-slate-700/50'
                }`}
              >
                <div className={`font-medium text-sm ${selectedRunsheet.id === rs.id ? 'text-orange-400' : 'text-slate-200'}`}>
                  {rs.name}
                </div>
                <div className="text-xs text-slate-500 flex justify-between w-full">
                  <span>{rs.project}</span>
                  <span>{rs.tract}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/80">
            <div>
              <h2 className="font-semibold text-lg text-white">{selectedRunsheet.name}</h2>
              <div className="text-sm text-slate-400">Last updated: {selectedRunsheet.updatedAt}</div>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1 p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-600 text-left text-slate-400">
                  <th className="pb-2 w-12 text-center">Entry</th>
                  <th className="pb-2 px-2">Instrument</th>
                  <th className="pb-2 px-2">Date</th>
                  <th className="pb-2 px-2">Vol/Pg</th>
                  <th className="pb-2 px-2">Grantor</th>
                  <th className="pb-2 px-2">Grantee</th>
                  <th className="pb-2 px-2">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {mockEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-700/30">
                    <td className="py-3 text-center text-slate-500 font-mono">{entry.entryNum}</td>
                    <td className="py-3 px-2 font-medium text-slate-300">{entry.instrument}</td>
                    <td className="py-3 px-2 text-slate-400">{entry.date}</td>
                    <td className="py-3 px-2 text-slate-400">{entry.volPage}</td>
                    <td className="py-3 px-2 text-slate-300">{entry.grantor}</td>
                    <td className="py-3 px-2 text-slate-300">{entry.grantee}</td>
                    <td className="py-3 px-2 text-slate-400">
                      <div className="flex items-start gap-2">
                        {entry.defect && <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />}
                        {entry.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
