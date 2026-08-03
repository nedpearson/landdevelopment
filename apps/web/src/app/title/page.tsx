'use client';

import React, { useState } from 'react';
import { Upload, Search, X, CheckCircle, FileText, AlertTriangle, ArrowDown } from 'lucide-react';

interface TitleEntry {
  id: string;
  type: string;
  grantor: string;
  grantee: string;
  date: string;
  bookPage: string;
  interest: string;
  defect?: string;
}

const mockChain: TitleEntry[] = [
  { id: '1', type: 'Patent', grantor: 'State of Texas', grantee: 'George W. Bush', date: '1910-04-12', bookPage: 'Vol 1, Pg 10', interest: '100% Fee Simple' },
  { id: '2', type: 'Warranty Deed', grantor: 'George W. Bush', grantee: 'H&P Land Co', date: '1945-11-20', bookPage: 'Vol 45, Pg 211', interest: '100% Surface, 50% Minerals' },
  { id: '3', type: 'Mineral Deed', grantor: 'George W. Bush', grantee: 'Permian Trust', date: '1945-12-05', bookPage: 'Vol 46, Pg 15', interest: '50% Minerals' },
  { id: '4', type: 'Oil & Gas Lease', grantor: 'H&P Land Co', grantee: 'Texaco Inc', date: '1970-02-15', bookPage: 'Vol 120, Pg 44', interest: 'Leasehold' },
  { id: '5', type: 'Assignment', grantor: 'Texaco Inc', grantee: 'Chevron USA', date: '2001-10-09', bookPage: 'Vol 890, Pg 112', interest: 'Leasehold' },
  { id: '6', type: 'Release of Lease', grantor: 'Chevron USA', grantee: 'H&P Land Co', date: '2010-01-15', bookPage: 'Vol 1100, Pg 55', interest: 'N/A' },
  { id: '7', type: 'Oil & Gas Lease', grantor: 'H&P Land Co', grantee: 'ExxonMobil', date: '2023-05-01', bookPage: 'Vol 2040, Pg 12', interest: 'Leasehold', defect: 'Missing Notary Acknowledgment on Grantor Signature' },
];

export default function TitleChainPage() {
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredChain = mockChain.filter(c => 
    c.grantor.toLowerCase().includes(search.toLowerCase()) || 
    c.grantee.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="text-sky-500" />
            Title Chain
          </h1>
          <p className="text-slate-400">Chronological history of title instruments for TR-1045.</p>
        </div>
        <button 
          onClick={() => showToast('Upload modal opened')}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Upload size={20} />
          Upload Instrument
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search grantor, grantee, or instrument type..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700"></div>

          <div className="space-y-6">
            {filteredChain.map((entry, idx) => (
              <div key={entry.id} className="relative pl-24 group">
                {/* Timeline node */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-slate-800 border-2 border-sky-500 z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500 hidden group-hover:block"></div>
                </div>
                
                {/* Connector arrow if not first */}
                {idx > 0 && (
                  <div className="absolute left-[27px] -top-6 text-slate-500">
                    <ArrowDown size={14} />
                  </div>
                )}

                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-sky-500/50 transition-colors cursor-pointer" onClick={() => showToast('View instrument details')}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full text-sm font-medium">
                        {entry.type}
                      </span>
                      <span className="text-slate-400 text-sm">{entry.date}</span>
                    </div>
                    <div className="text-slate-400 font-mono text-sm bg-slate-900 px-2 py-1 rounded">
                      {entry.bookPage}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-lg mb-3">
                    <span className="font-semibold text-slate-200">{entry.grantor}</span>
                    <span className="text-slate-500">→</span>
                    <span className="font-semibold text-white">{entry.grantee}</span>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="text-sm text-slate-400">
                      Interest Conveyed: <span className="text-slate-200">{entry.interest}</span>
                    </div>
                    
                    {entry.defect && (
                      <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                        <AlertTriangle size={16} />
                        {entry.defect}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
