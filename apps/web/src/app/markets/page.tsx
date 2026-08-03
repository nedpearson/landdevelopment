'use client';

import React, { useState } from 'react';
import { Globe, Plus, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const MOCK_MARKETS = [
  { id: '1', name: 'Travis County, TX', price: '$45,000', dom: 45, active: 124, sold: 32, trend: 'up', trendPct: '5.2%' },
  { id: '2', name: 'Williamson County, TX', price: '$38,000', dom: 52, active: 89, sold: 18, trend: 'up', trendPct: '2.1%' },
  { id: '3', name: 'Hays County, TX', price: '$42,500', dom: 61, active: 56, sold: 12, trend: 'down', trendPct: '1.5%' },
];

export default function MarketsPage() {
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-lime-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Globe className="w-6 h-6 mr-3 text-lime-500" />
            Market Intelligence
          </h1>
          <p className="text-slate-400">Track regional land metrics and trends</p>
        </div>
        <button onClick={() => showToast('Opening Add Market modal...')} className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Market
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {MOCK_MARKETS.map(market => (
          <div key={market.id} className="bg-slate-800 rounded-lg border border-slate-700 p-5 hover:border-lime-500/50 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${market.name} details`)}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-white text-lg">{market.name}</h3>
              <Activity className="w-5 h-5 text-slate-500" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-400">Median Price / Acre</div>
                <div className="text-2xl font-bold text-white flex items-center mt-1">
                  {market.price}
                  {market.trend === 'up' ? 
                    <span className="text-emerald-400 text-sm ml-2 flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> {market.trendPct}</span> : 
                    <span className="text-red-400 text-sm ml-2 flex items-center"><TrendingDown className="w-4 h-4 mr-1" /> {market.trendPct}</span>
                  }
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700">
                <div>
                  <div className="text-xs text-slate-400">Avg DOM</div>
                  <div className="font-medium text-white">{market.dom}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Active</div>
                  <div className="font-medium text-white">{market.active}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Sold (90d)</div>
                  <div className="font-medium text-white">{market.sold}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
