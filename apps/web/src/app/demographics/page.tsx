'use client';

import { submitGenericForm } from '@/actions/genericActions';
import React, { useState } from 'react';
import { Users2, Plus, X, MapPin, DollarSign, Target, Check, Search, Filter } from 'lucide-react';

interface DemographicArea {
  id: string;
  name: string;
  radius: number; // miles
  population: number;
  medianHHI: number;
  medianAge: number;
  growth: number; // %
  ageDist: { label: string, value: number }[];
  spending: { category: string, amount: number }[];
}

const MOCK_DATA: DemographicArea[] = [
  { 
    id: '1', name: 'Downtown Core (400 Main)', radius: 1, population: 15400, medianHHI: 85000, medianAge: 32, growth: 4.5,
    ageDist: [{label: '<18', value: 10}, {label: '18-34', value: 45}, {label: '35-54', value: 30}, {label: '55+', value: 15}],
    spending: [{category: 'Food/Drink', amount: 8500}, {category: 'Entertainment', amount: 3200}, {category: 'Apparel', amount: 2100}]
  },
  { 
    id: '2', name: 'Suburban Tech Park (850 Ind.)', radius: 3, population: 45000, medianHHI: 125000, medianAge: 38, growth: 2.1,
    ageDist: [{label: '<18', value: 25}, {label: '18-34', value: 20}, {label: '35-54', value: 40}, {label: '55+', value: 15}],
    spending: [{category: 'Food/Drink', amount: 12000}, {category: 'Housing', amount: 25000}, {category: 'Transportation', amount: 9000}]
  },
  { 
    id: '3', name: 'Retail Corridor (1200 Commerce)', radius: 5, population: 110000, medianHHI: 72000, medianAge: 35, growth: 1.2,
    ageDist: [{label: '<18', value: 20}, {label: '18-34', value: 30}, {label: '35-54', value: 25}, {label: '55+', value: 25}],
    spending: [{category: 'Food/Drink', amount: 6500}, {category: 'Healthcare', amount: 4200}, {category: 'Apparel', amount: 1800}]
  }
];

export default function DemographicsPage() {
  const [areas, setAreas] = useState<DemographicArea[]>(MOCK_DATA);
  const [radiusFilter, setRadiusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitGenericForm(Object.fromEntries(formData.entries()));
    setIsModalOpen(false);
    showToast(result.success ? 'Saved successfully!' : 'Error saving');
  };

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNum = (val: number) => new Intl.NumberFormat('en-US').format(val);

  const filtered = areas.filter(a => radiusFilter === 'All' || a.radius.toString() === radiusFilter);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users2 className="text-fuchsia-500" />
            Demographics Analysis
          </h1>
          <p className="text-slate-400 text-sm mt-1">Population and socioeconomic data by trade area.</p>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            <select value={radiusFilter} onChange={e => setRadiusFilter(e.target.value)} className="bg-transparent text-white focus:outline-none cursor-pointer">
              <option value="All">All Radii</option>
              <option value="1">1 Mile</option>
              <option value="3">3 Miles</option>
              <option value="5">5 Miles</option>
            </select>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Area Study
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map(area => (
          <div key={area.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {area.name}
                </h2>
                <div className="text-sm text-fuchsia-400 font-medium bg-fuchsia-500/10 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <Target className="w-3 h-3" /> {area.radius} Mile Radius
                </div>
              </div>
              <button onClick={() => showToast('Generating detailed PDF report...')} className="text-slate-400 hover:text-white text-sm bg-slate-900 px-3 py-1.5 rounded-md border border-slate-700 transition-colors">
                Export
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase mb-1">Population</div>
                <div className="text-lg font-bold text-white">{formatNum(area.population)}</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase mb-1">Median HHI</div>
                <div className="text-lg font-bold text-emerald-400">{formatCurrency(area.medianHHI)}</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase mb-1">Median Age</div>
                <div className="text-lg font-bold text-white">{area.medianAge}</div>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-xs text-slate-500 uppercase mb-1">5yr Growth</div>
                <div className="text-lg font-bold text-sky-400">+{area.growth}%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Age Distribution</h3>
                <div className="space-y-3">
                  {area.ageDist.map((dist, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{dist.label}</span>
                        <span className="text-slate-200">{dist.value}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2">
                        <div className="bg-fuchsia-500 h-2 rounded-full" style={{ width: `${dist.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Avg Consumer Spending</h3>
                <div className="space-y-4">
                  {area.spending.map((spend, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-700/50 pb-2 last:border-0">
                      <span className="text-sm text-slate-400">{spend.category}</span>
                      <span className="text-sm font-medium text-white">{formatCurrency(spend.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add Area Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Address / Location</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fuchsia-500" placeholder="e.g. 123 Main St" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Radii (Miles)</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-fuchsia-500">
                    <option>1, 3, 5 Miles</option>
                    <option>3, 5, 10 Miles</option>
                    <option>Custom (Specify in notes)</option>
                  </select>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Request Study</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
