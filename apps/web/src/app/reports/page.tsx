'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  PieChart, 
  TrendingUp, 
  Map, 
  Users, 
  RefreshCw,
  Building2,
  DollarSign,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { getReportData, exportReportCSV } from '@/actions/reportActions';

export default function ReportsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<'pipeline' | 'portfolio' | 'geo'>('pipeline');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getReportData();
      if (res.success && res.data) {
        setData(res.data);
      } else {
        showToast(res.error || 'Failed to generate report data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadCSV = async (type: string) => {
    const res = await exportReportCSV(type);
    if (res.success && res.data) {
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `land_intelligence_${type}_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${type} report to CSV`);
    } else {
      showToast('Failed to export CSV', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border bg-emerald-950/90 border-emerald-500/50 text-emerald-200 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Financial & Operational Reports</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Automated reconciliation of acquisition velocity, pipeline conversion, portfolio returns, and geographic distribution
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleDownloadCSV('portfolio')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Export Portfolio CSV
            </button>
            <button
              onClick={() => handleDownloadCSV('properties')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" /> Export All Properties CSV
            </button>
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
            <p className="text-sm">Calculating financial metrics from database...</p>
          </div>
        ) : !data ? (
          <div className="p-12 text-center text-slate-400">Failed to load analytics.</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400">Total System Parcels</span>
                <p className="text-2xl font-bold mt-1 text-white">{data.totalProperties}</p>
                <span className="text-[10px] text-slate-500">{data.totalSellers} sellers • {data.totalBuyers} buyers</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400">Invested Capital Basis</span>
                <p className="text-2xl font-bold mt-1 text-white">${data.portfolioMetrics.totalBasis.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">{data.portfolioMetrics.totalHoldings} active portfolio holdings</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400">Current Portfolio Equity</span>
                <p className="text-2xl font-bold mt-1 text-emerald-400">${data.portfolioMetrics.totalValue.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">Market valuation total</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] uppercase text-slate-400">Unrealized Capital Gain</span>
                <p className="text-2xl font-bold mt-1 text-emerald-400">+${data.portfolioMetrics.unrealizedGain.toLocaleString()}</p>
                <span className="text-[10px] text-slate-500">
                  {data.portfolioMetrics.totalBasis > 0 
                    ? ((data.portfolioMetrics.unrealizedGain / data.portfolioMetrics.totalBasis) * 100).toFixed(1) + '% overall ROI'
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Report Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
              <button
                onClick={() => setSelectedReport('pipeline')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedReport === 'pipeline' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pipeline Stage Conversion
              </button>
              <button
                onClick={() => setSelectedReport('geo')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedReport === 'geo' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Geographic Breakdown
              </button>
            </div>

            {/* Report Body */}
            {selectedReport === 'pipeline' ? (
              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                  Acquisition Pipeline Conversion & Volume
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {Object.entries(data.stageDistribution).map(([stage, count]: any) => (
                    <div key={stage} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">{stage.replace(/_/g, ' ')}</span>
                      <span className="text-xl font-bold text-white mt-1 block">{count} Parcels</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Map className="w-4 h-4 text-teal-400" />
                  Geographic County & State Portfolio Breakdown
                </h3>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">County & State</th>
                        <th className="p-3">Parcel Count</th>
                        <th className="p-3">Gross Acreage</th>
                        <th className="p-3">Total Estimated Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {Object.entries(data.countyBreakdown).map(([key, info]: any) => (
                        <tr key={key} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-white">{key}</td>
                          <td className="p-3 text-slate-300">{info.count}</td>
                          <td className="p-3 text-slate-300">{info.acreage} AC</td>
                          <td className="p-3 font-bold text-emerald-400">${info.totalValue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
