'use client';

import React, { useState } from 'react';
import { Map as MapIcon, Layers, Filter, ZoomIn, ZoomOut, MapPin, List, Eye, Target } from 'lucide-react';

const MOCK_PINS = [
  { id: '1', title: 'Riverside 120 AC', top: '30%', left: '45%', price: '$1.2M', status: 'Available' },
  { id: '2', title: 'Oak Hill Parcels', top: '60%', left: '20%', price: '$850K', status: 'Under Contract' },
  { id: '3', title: 'Smith Tract', top: '45%', left: '75%', price: '$450K', status: 'Sold' },
  { id: '4', title: 'Pine Valley', top: '20%', left: '80%', price: '$2.1M', status: 'Available' },
];

export default function MapView() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [layers, setLayers] = useState({ properties: true, parcels: true, flood: false });
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200 overflow-hidden">
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-800 border border-slate-600 p-4 rounded-md shadow-lg z-50 text-white animate-in fade-in">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex justify-between items-center z-10">
        <div className="flex items-center">
          <MapIcon className="w-6 h-6 text-amber-500 mr-3" />
          <h1 className="text-xl font-bold text-white">Land Explorer</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-md flex items-center border border-slate-700 transition-colors text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
            Save View
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center">
              <List className="w-4 h-4 mr-2" /> 
              Properties in View
            </h2>
            <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">{MOCK_PINS.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {MOCK_PINS.map(pin => (
              <div 
                key={pin.id}
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${activePin === pin.id ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'}`}
              >
                <div className="font-medium text-white">{pin.title}</div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-emerald-400 font-semibold">{pin.price}</span>
                  <span className="text-slate-400">{pin.status}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative bg-[#0f172a]">
          {/* Simulated Map Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
          </div>
          
          {/* Topography simulation */}
          <div className="absolute inset-0 opacity-10 blur-xl mix-blend-screen bg-gradient-to-tr from-slate-900 via-amber-900/20 to-slate-900 pointer-events-none"></div>

          {/* Map Controls */}
          <div className="absolute right-4 top-4 flex flex-col space-y-2 z-20">
            <div className="bg-slate-800 rounded-md shadow-lg border border-slate-700 overflow-hidden flex flex-col">
              <button onClick={() => showToast('Zoom In')} className="p-2 hover:bg-slate-700 text-slate-300 border-b border-slate-700">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => showToast('Zoom Out')} className="p-2 hover:bg-slate-700 text-slate-300">
                <ZoomOut className="w-5 h-5" />
              </button>
            </div>
            <button onClick={() => showToast('Locate Me')} className="bg-slate-800 rounded-md shadow-lg border border-slate-700 p-2 hover:bg-slate-700 text-slate-300 mt-4">
              <Target className="w-5 h-5" />
            </button>
          </div>

          {/* Layer Controls */}
          <div className="absolute left-4 top-4 z-20">
            <div className="bg-slate-800 rounded-md shadow-lg border border-slate-700 p-3 w-48">
              <div className="flex items-center text-sm font-semibold text-white mb-3">
                <Layers className="w-4 h-4 mr-2 text-amber-500" /> Layers
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={layers.properties} onChange={(e) => setLayers({...layers, properties: e.target.checked})} className="mr-2 accent-amber-500" /> Properties
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={layers.parcels} onChange={(e) => setLayers({...layers, parcels: e.target.checked})} className="mr-2 accent-amber-500" /> Parcel Lines
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" checked={layers.flood} onChange={(e) => setLayers({...layers, flood: e.target.checked})} className="mr-2 accent-amber-500" /> Flood Zones
                </label>
              </div>
            </div>
          </div>

          {/* Pins */}
          {layers.properties && MOCK_PINS.map(pin => (
            <div 
              key={pin.id}
              className="absolute z-10 transform -translate-x-1/2 -translate-y-full"
              style={{ top: pin.top, left: pin.left }}
              onMouseEnter={() => setActivePin(pin.id)}
              onMouseLeave={() => setActivePin(null)}
            >
              <div className="relative group cursor-pointer">
                <MapPin className={`w-8 h-8 transition-colors ${activePin === pin.id ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-emerald-500 drop-shadow-md'}`} fill="currentColor" />
                
                {/* Tooltip */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-800 text-white text-xs rounded py-1.5 px-2 text-center border border-slate-700 shadow-xl transition-opacity pointer-events-none ${activePin === pin.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="font-bold truncate">{pin.title}</div>
                  <div className="text-slate-300">{pin.price}</div>
                  {/* Triangle pointer */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
          ))}

        </main>
      </div>
    </div>
  );
}
