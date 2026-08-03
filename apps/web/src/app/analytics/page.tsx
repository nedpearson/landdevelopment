'use client';

import React, { useState } from 'react';
import { LineChart, Download, Filter, TrendingUp, TrendingDown, Building, Activity, DollarSign, Check } from 'lucide-react';

export default function AnalyticsPage() {
  const [propertyType, setPropertyType] = useState('All');
  const [submarket, setSubmarket] = useState('All');
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock data for CSS charts
  const priceSfTrend = [120, 125, 122, 130, 135, 142, 145, 150, 148, 155, 160, 165];
  const maxPrice = Math.max(...priceSfTrend);
  const minPrice = Math.min(...priceSfTrend);
  
  const vacancyRates = [
    { market: 'Downtown', rate: 12.5 },
    { market: 'Suburban North', rate: 8.2 },
    { market: 'Westside', rate: 5.4 },
    { market: 'East Industrial', rate: 3.1 },
    { market: 'South Tech Hub', rate: 9.8 }
  ];
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LineChart className="text-orange-500" />
            Market Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time market insights and trends.</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className="bg-transparent text-white focus:outline-none cursor-pointer">
              <option>All Types</option>
              <option>Office</option>
              <option>Industrial</option>
              <option>Retail</option>
            </select>
          </div>
          <button onClick={() => showToast('Report exported successfully')} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-auto">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Avg Asking Rent / SF', value: '$32.50', trend: '+4.2%', icon: DollarSign, positive: true },
          { label: 'Overall Vacancy', value: '8.4%', trend: '-1.1%', icon: Building, positive: true },
          { label: 'Net Absorption (YTD)', value: '1.2M SF', trend: '+250k', icon: Activity, positive: true },
          { label: 'Avg Cap Rate', value: '6.2%', trend: '+0.3%', icon: LineChart, positive: false },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-900/50 rounded-lg">
                <stat.icon className="w-5 h-5 text-slate-400" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Price / SF Trend (12 Months)</h3>
          <div className="h-64 flex items-end justify-between gap-2 pt-10">
            {priceSfTrend.map((val, i) => {
              const height = ((val - minPrice + 10) / (maxPrice - minPrice + 20)) * 100;
              return (
                <div key={i} className="relative flex flex-col items-center flex-1 group">
                  <div className="absolute -top-8 bg-slate-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    ${val}/SF
                  </div>
                  <div 
                    className="w-full bg-orange-500/20 hover:bg-orange-500/40 border-t-2 border-orange-500 transition-all rounded-t-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                    M{i+1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Vacancy by Submarket</h3>
          <div className="space-y-5">
            {vacancyRates.sort((a, b) => b.rate - a.rate).map((market, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-300 font-medium">{market.market}</span>
                  <span className="text-white">{market.rate}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${market.rate > 10 ? 'bg-red-500' : market.rate > 6 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${(market.rate / 15) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-500">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
