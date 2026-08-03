'use client';

import React, { useState } from 'react';
import { Car, Plus, X, Search, Check, MapPin, Calendar, Activity, Info, Navigation2 } from 'lucide-react';

interface TrafficData {
  id: string;
  address: string;
  dailyTraffic: number;
  source: string;
  date: string;
  pedestrianCount: number;
  peakHours: string;
  nearbyBusinesses: string[];
}

const MOCK_TRAFFIC: TrafficData[] = [
  { id: '1', address: '1200 Commerce Blvd', dailyTraffic: 45000, source: 'DOT Sensor A12', date: '2023-11-01', pedestrianCount: 1200, peakHours: '7AM-9AM, 4PM-6PM', nearbyBusinesses: ['Starbucks', 'Target', 'CVS'] },
  { id: '2', address: '400 Main St Retail', dailyTraffic: 62000, source: 'City Study 2023', date: '2023-08-15', pedestrianCount: 4500, peakHours: '11AM-2PM, 5PM-7PM', nearbyBusinesses: ['Whole Foods', 'Lululemon', 'Sweetgreen'] },
  { id: '3', address: '850 Industrial Pkwy', dailyTraffic: 15000, source: 'Manual Count', date: '2023-10-10', pedestrianCount: 50, peakHours: '6AM-8AM, 3PM-5PM', nearbyBusinesses: ['FedEx Hub', 'Prologis Park'] },
  { id: '4', address: '9900 Medical Plaza', dailyTraffic: 32000, source: 'DOT Sensor B44', date: '2023-09-22', pedestrianCount: 800, peakHours: '8AM-10AM, 3PM-5PM', nearbyBusinesses: ['General Hospital', 'Walgreens'] },
  { id: '5', address: '250 Warehouse Way', dailyTraffic: 8500, source: 'Logistics Study', date: '2023-11-20', pedestrianCount: 10, peakHours: '5AM-7AM, 8PM-10PM', nearbyBusinesses: ['Amazon Center'] }
];

export default function TrafficPage() {
  const [selected, setSelected] = useState<TrafficData | null>(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = MOCK_TRAFFIC.filter(t => t.address.toLowerCase().includes(search.toLowerCase()));

  const formatNum = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans flex gap-6">
      <div className={`flex-1 transition-all ${selected ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Car className="text-lime-500" />
              Traffic Studies
            </h1>
            <p className="text-slate-400 text-sm mt-1">Vehicle and pedestrian traffic counts for commercial sites.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Traffic Study
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-lime-500 transition-colors"
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium text-right">Daily Traffic (VPD)</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filtered.map(data => (
                <tr 
                  key={data.id} 
                  onClick={() => setSelected(data)}
                  className={`hover:bg-slate-700/50 transition-colors cursor-pointer ${selected?.id === data.id ? 'bg-slate-700/50 border-l-2 border-l-lime-500' : 'border-l-2 border-l-transparent'}`}
                >
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500"/> {data.address}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-lime-400/90">{formatNum(data.dailyTraffic)}</td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{data.source}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(data.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="w-full lg:w-1/3 bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-3rem)] sticky top-6">
          <div className="p-5 border-b border-slate-700 flex justify-between items-start bg-slate-900/30 rounded-t-xl">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Traffic Details</h2>
              <p className="text-slate-400 text-sm flex items-center gap-1">{selected.address}</p>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white bg-slate-800 p-1 rounded-md">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Car className="w-3 h-3"/> Vehicles/Day</div>
                <div className="text-xl font-bold text-white">{formatNum(selected.dailyTraffic)}</div>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <div className="text-slate-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Pedestrians</div>
                <div className="text-xl font-bold text-white">{formatNum(selected.pedestrianCount)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Info</h3>
              <div className="bg-slate-900/50 rounded-lg p-3 space-y-3 border border-slate-700/50">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Info className="w-4 h-4 text-slate-500" /> Source: <span className="text-white">{selected.source}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500" /> Date: <span className="text-white">{new Date(selected.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Activity className="w-4 h-4 text-slate-500" /> Peak: <span className="text-white">{selected.peakHours}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nearby Drivers / Businesses</h3>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex flex-wrap gap-2">
                {selected.nearbyBusinesses.map((biz, i) => (
                  <span key={i} className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Navigation2 className="w-3 h-3 text-lime-500" /> {biz}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add Traffic Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Traffic study persistence coming soon'); setIsModalOpen(false); }}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-500" placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Daily Traffic (VPD)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Source / Method</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-lime-500" placeholder="DOT Sensor..." />
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Study</button>
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
