'use client';

import React, { useState } from 'react';
import { BarChart3, Download, PieChart, TrendingUp, Map, Users } from 'lucide-react';

const reportsList = [
  { id: 'acq', title: 'Acquisition Summary', icon: <TrendingUp className="w-5 h-5 text-indigo-400" />, desc: 'Monthly summary of accepted offers, spend, and targets.' },
  { id: 'port', title: 'Portfolio Performance', icon: <PieChart className="w-5 h-5 text-emerald-400" />, desc: 'Holding costs, active listings, and ROI metrics.' },
  { id: 'deal', title: 'Deal Flow Analysis', icon: <BarChart3 className="w-5 h-5 text-amber-400" />, desc: 'Conversion rates across pipeline stages.' },
  { id: 'seller', title: 'Seller Outreach Report', icon: <Users className="w-5 h-5 text-sky-400" />, desc: 'Response rates by campaign and motivation levels.' },
  { id: 'buyer', title: 'Buyer Activity Report', icon: <Users className="w-5 h-5 text-lime-400" />, desc: 'VIP buyer interactions and requested criteria matching.' },
  { id: 'roi', title: 'ROI by County', icon: <Map className="w-5 h-5 text-orange-400" />, desc: 'Geographic heatmap of profitability.' },
];

export default function ReportsPage() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerate = (id: string) => {
    setGeneratingId(id);
    setActiveReport(null);
    setTimeout(() => {
      setGeneratingId(null);
      setActiveReport(id);
      showToast('Report Generated Successfully');
    }, 1500);
  };

  const handleDownload = () => {
    showToast('Downloading PDF...');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">Reports Hub</h1>
          <p className="text-slate-400 mt-1">Analytics and insights for your land business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsList.map((report) => (
            <div key={report.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex flex-col">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-700">
                  {report.icon}
                </div>
                <h3 className="font-semibold text-lg">{report.title}</h3>
              </div>
              <p className="text-sm text-slate-400 mb-6 flex-1">{report.desc}</p>
              
              <div className="flex space-x-3 mt-auto">
                <button 
                  onClick={() => handleGenerate(report.id)}
                  disabled={generatingId === report.id}
                  className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded text-sm transition-colors"
                >
                  {generatingId === report.id ? 'Loading...' : 'Generate'}
                </button>
                <button 
                  onClick={handleDownload}
                  className="px-3 py-2 border border-slate-600 hover:bg-slate-700 rounded text-sm transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {activeReport && (
          <div className="mt-8 bg-slate-800 p-6 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-teal-400" />
              Report Results: {reportsList.find(r => r.id === activeReport)?.title}
            </h2>
            <div className="bg-slate-900 h-64 rounded border border-slate-700 flex items-center justify-center flex-col text-slate-500">
              <div className="flex items-end space-x-4 mb-4 h-32">
                {/* Mock Chart */}
                <div className="w-12 bg-indigo-500/50 rounded-t h-16"></div>
                <div className="w-12 bg-emerald-500/50 rounded-t h-32"></div>
                <div className="w-12 bg-amber-500/50 rounded-t h-20"></div>
                <div className="w-12 bg-sky-500/50 rounded-t h-24"></div>
                <div className="w-12 bg-teal-500/50 rounded-t h-12"></div>
              </div>
              <p>Mock Visualization Data</p>
              <p className="text-xs">Generated for Q3 2023</p>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
