'use client';

import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Layers, Filter, ZoomIn, ZoomOut, MapPin, List, Target } from 'lucide-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapProperties } from '@/actions/mapActions';

export default function MapView() {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [layers, setLayers] = useState({ properties: true, parcels: true, flood: false });
  const [toast, setToast] = useState<{message: string} | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await getMapProperties();
      if (res.success && res.data) {
        setProperties(res.data);
      }
    }
    load();
  }, []);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const viewState = {
    longitude: -97.7431,
    latitude: 30.2672,
    zoom: 6,
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
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-white flex items-center">
              <List className="w-4 h-4 mr-2" /> 
              Properties in View
            </h2>
            <span className="bg-slate-800 text-xs px-2 py-1 rounded text-slate-300">{properties.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {properties.map(pin => (
              <div 
                key={pin.id}
                onMouseEnter={() => setActivePin(pin.id)}
                onMouseLeave={() => setActivePin(null)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${activePin === pin.id ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-slate-800/50 border border-transparent hover:bg-slate-800'}`}
              >
                <div className="font-medium text-white">{pin.apn}</div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-emerald-400 font-semibold">{pin.estimatedMarketValue ? '$' + pin.estimatedMarketValue.toLocaleString() : 'TBD'}</span>
                  <span className="text-slate-400">{pin.lifecycleStage}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative bg-[#0f172a]">
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
            initialViewState={viewState}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/dark-v11"
          >
            <NavigationControl position="bottom-right" />
            
            {layers.properties && properties.map(pin => (
              <Marker 
                key={pin.id} 
                longitude={pin.centroidLng} 
                latitude={pin.centroidLat}
                anchor="bottom"
              >
                <div 
                  onMouseEnter={() => setActivePin(pin.id)}
                  onMouseLeave={() => setActivePin(null)}
                  className="relative group cursor-pointer"
                >
                  <MapPin className={`w-8 h-8 transition-colors ${activePin === pin.id ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]' : 'text-emerald-500 drop-shadow-md'}`} fill="currentColor" />
                  
                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 bg-slate-800 text-white text-xs rounded py-1.5 px-2 text-center border border-slate-700 shadow-xl transition-opacity pointer-events-none ${activePin === pin.id ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="font-bold truncate">{pin.apn}</div>
                    <div className="text-slate-300">{pin.estimatedMarketValue ? '$' + pin.estimatedMarketValue.toLocaleString() : 'TBD'}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </Marker>
            ))}
          </Map>

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
        </main>
      </div>
    </div>
  );
}
