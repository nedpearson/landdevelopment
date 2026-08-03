'use client';

import React, { useState } from 'react';
import { Plus, MapPin, MoreVertical, LayoutGrid, X } from 'lucide-react';

interface Deal {
  id: string;
  apn: string;
  county: string;
  acreage: number;
  askingPrice: number;
  status: string;
}

const initialDeals: Deal[] = [
  { id: '1', apn: '045-123-45', county: 'Costilla, CO', acreage: 5.0, askingPrice: 4500, status: 'Prospect' },
  { id: '2', apn: '102-44-091', county: 'Mohave, AZ', acreage: 10.0, askingPrice: 12000, status: 'Contacted' },
  { id: '3', apn: '59-002-11', county: 'Navajo, AZ', acreage: 40.0, askingPrice: 25000, status: 'Qualified' },
  { id: '4', apn: '88-101-02', county: 'Valencia, NM', acreage: 2.5, askingPrice: 1500, status: 'Underwriting' },
  { id: '5', apn: '303-91-88', county: 'Elko, NV', acreage: 20.0, askingPrice: 8000, status: 'Offer Sent' },
  { id: '6', apn: '12-99-444', county: 'Brevard, FL', acreage: 1.2, askingPrice: 15000, status: 'Negotiation' },
  { id: '7', apn: '404-55-11', county: 'Kern, CA', acreage: 5.0, askingPrice: 18000, status: 'Contracted' },
  { id: '8', apn: '77-11-002', county: 'Costilla, CO', acreage: 5.0, askingPrice: 4000, status: 'Closed' },
];

const COLUMNS = ['Prospect', 'Contacted', 'Qualified', 'Underwriting', 'Offer Sent', 'Negotiation', 'Contracted', 'Closed'];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Deal Added Successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center shrink-0">
          <h1 className="text-2xl font-bold text-indigo-400">Deal Pipeline</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </button>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-4 h-full">
            {COLUMNS.map(col => (
              <div key={col} className="w-72 bg-slate-800 rounded-lg p-3 border border-slate-700 flex flex-col h-[calc(100vh-160px)]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-300">{col}</h3>
                  <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-400">
                    {deals.filter(d => d.status === col).length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {deals.filter(d => d.status === col).map(deal => (
                    <div 
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="bg-slate-900 p-3 rounded border border-slate-700 cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-mono text-slate-300">{deal.apn}</span>
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="text-sm text-slate-400 flex items-center mb-2">
                        <MapPin className="w-3 h-3 mr-1" />
                        {deal.county}
                      </div>
                      <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-800">
                        <span>{deal.acreage} ac</span>
                        <span className="font-semibold text-indigo-400">${deal.askingPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add New Deal</h2>
            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">APN</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">County/State</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Acreage</label>
                  <input required type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Asking Price</label>
                  <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDeal && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Deal Details</h2>
            <button onClick={() => setSelectedDeal(null)} className="p-1 hover:bg-slate-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400">APN</div>
              <div className="text-lg font-mono">{selectedDeal.apn}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">Location</div>
              <div className="text-lg">{selectedDeal.county}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400">Acreage</div>
                <div className="text-lg">{selectedDeal.acreage} ac</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Asking Price</div>
                <div className="text-lg font-semibold text-indigo-400">${selectedDeal.askingPrice.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Status</div>
              <select defaultValue={selectedDeal.status} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                {COLUMNS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-700">
              <button onClick={() => { showToast('Deal Updated!'); setSelectedDeal(null); }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-indigo-600 rounded shadow-lg">
          {toast.message}
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
