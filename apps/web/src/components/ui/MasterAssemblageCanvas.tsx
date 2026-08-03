"use client";

import React, { useState } from 'react';
import { Layers, Plus, Box, Link as LinkIcon, Calculator, ArrowRight } from 'lucide-react';
import { Property } from '@land-intelligence/database';

export function MasterAssemblageCanvas() {
  const [assemblage, setAssemblage] = useState<Partial<Property>[]>([]);
  const [newApn, setNewApn] = useState('');

  // Mock property lookup for demo
  const handleAddParcel = () => {
    if (!newApn) return;
    
    // Create a mock property based on the APN entered
    const mockProperty: Partial<Property> = {
      id: Math.random().toString(),
      apn: newApn,
      county: "Simulated County",
      state: "TX",
      acreage: Math.floor(Math.random() * 50) + 10,
      askingPrice: Math.floor(Math.random() * 500000) + 50000,
    };
    
    setAssemblage(prev => [...prev, mockProperty]);
    setNewApn('');
  };

  const totalAcreage = assemblage.reduce((acc, curr) => acc + (curr.acreage || 0), 0);
  const totalAsking = assemblage.reduce((acc, curr) => acc + (curr.askingPrice || 0), 0);
  
  // Simulated AVM math for assemblage
  const projectedValuePerAcre = 25000;
  const grossRetailValue = totalAcreage * projectedValuePerAcre;
  const developmentCost = totalAcreage * 5000; // $5k/acre dev cost
  const netProfit = grossRetailValue - developmentCost - totalAsking;
  const roi = totalAsking > 0 ? (netProfit / totalAsking) * 100 : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-7xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-fuchsia-500" /> Master Assemblage Canvas
          </h1>
          <p className="text-slate-400 mt-2">Combine adjacent parcels to model massive subdivision plays.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
        
        {/* Left Side: Parcel Node Graph / List */}
        <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-4">
            <input 
              type="text" 
              value={newApn}
              onChange={e => setNewApn(e.target.value)}
              placeholder="Enter APN to add to assemblage..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500"
              onKeyDown={e => e.key === 'Enter' && handleAddParcel()}
            />
            <button 
              onClick={handleAddParcel}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Parcel
            </button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
            {assemblage.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <Box className="w-16 h-16 text-slate-600 mb-4" />
                <p className="text-slate-400 font-medium">Canvas is empty.</p>
                <p className="text-slate-500 text-sm">Add an APN to start building your assemblage.</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-6 items-center justify-center min-h-full">
                {assemblage.map((parcel, idx) => (
                  <React.Fragment key={parcel.id}>
                    <div className="bg-slate-950 border border-slate-700 rounded-xl p-4 shadow-lg w-64 transform transition-all hover:scale-105 hover:border-fuchsia-500/50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">APN {parcel.apn}</div>
                          <div className="text-xs text-slate-500">{parcel.county}, {parcel.state}</div>
                        </div>
                        <div className="bg-slate-900 px-2 py-1 rounded text-xs font-bold text-slate-300">
                          {parcel.acreage} ac
                        </div>
                      </div>
                      <div className="text-xl font-black text-white">
                        ${parcel.askingPrice?.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Asking Price</div>
                    </div>
                    {idx < assemblage.length - 1 && (
                      <LinkIcon className="w-6 h-6 text-slate-700 shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: AVM Mathematics */}
        <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center gap-3">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">Assemblage AVM Math</h2>
          </div>
          
          <div className="p-6 space-y-6 overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Combined Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <div className="text-2xl font-black text-sky-400">{totalAcreage}</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Total Acres</div>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <div className="text-lg font-black text-rose-400">${(totalAsking / 1000).toFixed(0)}k</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold mt-1">Total Asking</div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800 w-full" />

            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Projected ROI Model</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Gross Retail Value</span>
                  <span className="font-semibold text-emerald-400">+ ${grossRetailValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Acquisition Cost</span>
                  <span className="font-semibold text-rose-400">- ${totalAsking.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Development Cost</span>
                  <span className="font-semibold text-amber-400">- ${developmentCost.toLocaleString()}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-white font-bold">Net Profit</span>
                  <span className="font-black text-emerald-500">${netProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-6 text-center mt-6">
              <div className="text-4xl font-black text-emerald-400 mb-2">
                {roi.toFixed(1)}%
              </div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Projected ROI</div>
            </div>

            <button 
              disabled={assemblage.length < 2}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              Export Pro Forma <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
