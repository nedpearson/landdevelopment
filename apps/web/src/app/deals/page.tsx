'use client';

import React, { useState, useEffect } from 'react';
import { Columns, List, Filter, Search, Plus, Map, Briefcase, FileText, ChevronRight, DollarSign, Calendar, Target, Settings, Building2, User, Check } from 'lucide-react';
import { getAllProperties } from '@/actions/propertyActions';

const STAGES = [
  'PROSPECT',
  'CONTACTED',
  'QUALIFIED',
  'UNDERWRITING',
  'DUE_DILIGENCE',
  'OFFER_SENT',
  'NEGOTIATION',
  'CONTRACTED',
  'CLOSING',
  'OWNED',
  'LISTED',
  'UNDER_CONTRACT_DISPOSITION',
  'SOLD'
];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    const props = await getAllProperties();
    setDeals(props);
  };

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const advanceStage = (dealId: string, currentStage: string) => {
    showToast(`Advancing deals persistence coming soon`);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

  // Group deals by stage
  const validStages = STAGES.filter(stage => {
    return deals.some(d => d.lifecycleStage === stage) || ['PROSPECT', 'UNDERWRITING', 'CONTRACTED', 'CLOSING', 'SOLD'].includes(stage);
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Columns className="text-amber-500" />
            Deal Pipeline
          </h1>
          <p className="text-slate-400 text-sm mt-1">Track commercial real estate deals through their lifecycle.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar items-start min-h-[calc(100vh-160px)]">
        {validStages.map(stage => {
          const stageDeals = deals.filter(d => d.lifecycleStage === stage);
          const stageTotal = stageDeals.reduce((sum, d) => sum + (d.askingPrice || 0), 0);
          
          return (
            <div key={stage} className="bg-slate-800/50 border border-slate-700/50 rounded-xl w-80 shrink-0 flex flex-col max-h-full">
              <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 rounded-t-xl sticky top-0 z-10">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-semibold text-white">{stage.replace(/_/g, ' ')}</h3>
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
                  <div key={deal.id} className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-sm hover:border-amber-500/50 transition-colors group cursor-pointer">
                    <h4 className="font-medium text-sm text-white mb-2 flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span className="truncate">APN: {deal.apn}</span>
                    </h4>
                    
                    <div className="space-y-1.5 mb-3">
                      <div className="text-xs text-slate-400 flex items-center justify-between">
                        <span className="flex items-center gap-1"><User className="w-3 h-3"/> Owner:</span>
                        <span className="text-slate-300 truncate max-w-[120px]">{deal.ownerName || 'Unknown'}</span>
                      </div>
                      <div className="text-xs font-medium text-emerald-400 flex items-center justify-between pt-1">
                        <span className="flex items-center gap-1 text-slate-400"><DollarSign className="w-3 h-3"/> Ask:</span>
                        {formatCurrency(deal.askingPrice)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <div className="text-[10px] text-slate-500 font-medium bg-slate-900/50 px-2 py-0.5 rounded">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </div>
                      {stage !== 'SOLD' && (
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
