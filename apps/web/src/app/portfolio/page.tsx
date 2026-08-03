'use client';

import React, { useState } from 'react';
import { PieChart, Plus, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const MOCK_HOLDINGS = [
  { id: '1', address: 'Riverside 120 AC', apn: '123-456-789', acqDate: '2022-05-10', costBasis: 1200000, currentVal: 1850000, status: 'Owned' },
  { id: '2', address: 'Smith Tract - 40 AC', apn: '987-654-321', acqDate: '2023-01-15', costBasis: 450000, currentVal: 480000, status: 'Under Contract' },
  { id: '3', address: 'Pine Valley Lot 4', apn: '456-789-123', acqDate: '2021-11-20', costBasis: 150000, currentVal: 320000, status: 'Listed' },
];

export default function PortfolioManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const totalBasis = MOCK_HOLDINGS.reduce((acc, curr) => acc + curr.costBasis, 0);
  const totalValue = MOCK_HOLDINGS.reduce((acc, curr) => acc + curr.currentVal, 0);
  const totalGain = totalValue - totalBasis;
  const roiPct = (totalGain / totalBasis) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-emerald-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <PieChart className="w-6 h-6 mr-3 text-emerald-500" />
            Portfolio Manager
          </h1>
          <p className="text-slate-400">Track holdings and asset valuations</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Holding
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Total Cost Basis</div>
          <div className="text-3xl font-bold text-white">${(totalBasis/1000000).toFixed(2)}M</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Current Value</div>
          <div className="text-3xl font-bold text-emerald-400">${(totalValue/1000000).toFixed(2)}M</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Unrealized Gain</div>
          <div className="text-3xl font-bold text-emerald-400 flex items-center">
            <ArrowUpRight className="w-6 h-6 mr-1" /> ${(totalGain/1000000).toFixed(2)}M
          </div>
        </div>
        <div className="bg-slate-800 p-5 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm mb-1">Portfolio ROI</div>
          <div className="text-3xl font-bold text-white">{roiPct.toFixed(1)}%</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Asset / APN</th>
              <th className="p-4 font-medium">Acq. Date</th>
              <th className="p-4 font-medium">Cost Basis</th>
              <th className="p-4 font-medium">Current Value</th>
              <th className="p-4 font-medium">Gain</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_HOLDINGS.map(holding => (
              <tr key={holding.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-white">{holding.address}</div>
                  <div className="text-xs text-slate-400">APN: {holding.apn}</div>
                </td>
                <td className="p-4 text-sm text-slate-300">{holding.acqDate}</td>
                <td className="p-4 font-medium">${holding.costBasis.toLocaleString()}</td>
                <td className="p-4 font-medium text-emerald-400">${holding.currentVal.toLocaleString()}</td>
                <td className="p-4 text-emerald-400 text-sm flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 mr-1" /> {(((holding.currentVal - holding.costBasis)/holding.costBasis)*100).toFixed(0)}%
                </td>
                <td className="p-4">
                  <span className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300">{holding.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => showToast('Opened valuation update modal')} className="text-slate-400 hover:text-emerald-400 p-2 bg-slate-900 rounded border border-slate-700 text-xs flex items-center ml-auto">
                    <RefreshCw className="w-3 h-3 mr-1" /> Update Val
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
