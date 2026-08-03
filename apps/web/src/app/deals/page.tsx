'use client';

import React, { useState } from 'react';
import { LayoutKanban, Plus, X, Building2, User, DollarSign, ChevronRight, Check } from 'lucide-react';

const STAGES = ['Prospect', 'Tour Scheduled', 'LOI', 'PSA', 'Due Diligence', 'Closing', 'Closed'] as const;
type Stage = typeof STAGES[number];

interface Deal {
  id: string;
  address: string;
  buyer: string;
  seller: string;
  price: number;
  stage: Stage;
  daysInStage: number;
}

const INITIAL_DEALS: Deal[] = [
  { id: 'd1', address: '1200 Commerce Blvd', buyer: 'Apex Logistics', seller: 'Commerce Trust', price: 3500000, stage: 'LOI', daysInStage: 5 },
  { id: 'd2', address: '850 Industrial Pkwy', buyer: 'TechNova', seller: 'Industrial REIT', price: 5200000, stage: 'Tour Scheduled', daysInStage: 2 },
  { id: 'd3', address: '400 Main St Retail', buyer: 'Chang Holdings', seller: 'Local Investors', price: 2100000, stage: 'Due Diligence', daysInStage: 14 },
  { id: 'd4', address: '9900 Medical Plaza', buyer: 'Torres Med Group', seller: 'HealthCore', price: 4100000, stage: 'PSA', daysInStage: 8 },
  { id: 'd5', address: '250 Warehouse Way', buyer: 'Global Dist', seller: 'Family Office', price: 12500000, stage: 'Closed', daysInStage: 1 },
  { id: 'd6', address: '77 Downtown Highrise', buyer: 'City Fund', seller: 'Downtown Dev', price: 8900000, stage: 'Prospect', daysInStage: 12 }
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const advanceStage = (dealId: string, currentStage: Stage) => {
    const currentIndex = STAGES.indexOf(currentStage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1];
      setDeals(deals.map(d => d.id === dealId ? { ...d, stage: nextStage, daysInStage: 0 } : d));
      showToast(`Deal advanced to ${nextStage}`);
    }
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutKanban className="text-amber-500" />
            Deal Pipeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track commercial real estate deals through their lifecycle.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Deal
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar items-start min-h-[calc(100vh-160px)]">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.price, 0);
          
          return (
            <div key={stage} className="bg-slate-800/50 border border-slate-700/50 rounded-xl w-80 shrink-0 flex flex-col max-h-full">
              <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 rounded-t-xl sticky top-0 z-10">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-white">{stage}</h3>
                  <span className="bg-slate-700 text-slate-300 text-xs py-0.5 px-2 rounded-full font-medium">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-amber-400/80 text-xs font-medium">
                  {formatCurrency(stageTotal)}
                </div>
              </div>
              
              <div className="p-3 overflow-y-auto space-y-3 custom-scrollbar flex-1">
                {stageDeals.map(deal => (
                  <div key={deal.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-sm hover:border-amber-500/50 transition-colors group cursor-grab active:cursor-grabbing">
                    <h4 className="font-medium text-sm text-white mb-2 flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="truncate">{deal.address}</span>
                    </h4>
                    
                    <div className="space-y-1.5 mb-3">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1"><User className="w-3 h-3"/> Buyer:</span>
                        <span className="text-slate-300 truncate max-w-[120px]">{deal.buyer}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1"><User className="w-3 h-3"/> Seller:</span>
                        <span className="text-slate-300 truncate max-w-[120px]">{deal.seller}</span>
                      </div>
                      <div className="text-xs font-medium text-emerald-400 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-slate-400"><DollarSign className="w-3 h-3"/> Price:</span>
                        {formatCurrency(deal.price)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <div className="text-[10px] text-slate-500 font-medium bg-slate-900/50 px-2 py-0.5 rounded">
                        {deal.daysInStage} days in stage
                      </div>
                      {stage !== 'Closed' && (
                        <button 
                          onClick={() => advanceStage(deal.id, stage)}
                          className="text-amber-500 hover:bg-amber-500/10 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 flex items-center text-xs gap-1 font-medium"
                          title="Advance Stage"
                        >
                          Advance <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {stageDeals.length === 0 && (
                  <div className="border-2 border-dashed border-slate-700/50 rounded-lg p-4 text-center text-slate-500 text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add New Deal</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={(e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const newDeal: Deal = {
                  id: `d${Date.now()}`,
                  address: (form.elements.namedItem('address') as HTMLInputElement).value,
                  buyer: (form.elements.namedItem('buyer') as HTMLInputElement).value,
                  seller: (form.elements.namedItem('seller') as HTMLInputElement).value,
                  price: parseInt((form.elements.namedItem('price') as HTMLInputElement).value) || 0,
                  stage: (form.elements.namedItem('stage') as HTMLSelectElement).value as Stage,
                  daysInStage: 0
                };
                setDeals([...deals, newDeal]);
                showToast('Deal added successfully'); 
                setIsModalOpen(false); 
              }}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                  <input name="address" required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Buyer</label>
                    <input name="buyer" required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="Buyer Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Seller</label>
                    <input name="seller" required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="Seller Name" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Price ($)</label>
                    <input name="price" required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Initial Stage</label>
                    <select name="stage" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500">
                      {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Deal</button>
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
