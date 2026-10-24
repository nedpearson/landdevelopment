'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  MapPin, 
  MoreVertical, 
  LayoutGrid, 
  X, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  DollarSign
} from 'lucide-react';
import { getPipelineDeals, updateDealStage, createDeal } from '@/actions/pipelineActions';

const STAGES = [
  'PROSPECT',
  'QUALIFIED',
  'UNDERWRITING',
  'DUE_DILIGENCE',
  'OFFER_SENT',
  'CONTRACTED',
  'OWNED'
];

export default function PipelinePage() {
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState({
    apn: '',
    county: '',
    state: '',
    acreage: 10,
    askingPrice: 0,
    ownerName: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDeals = async () => {
    setLoading(true);
    try {
      const data = await getPipelineDeals();
      setDeals(data);
    } catch (err) {
      showToast('Failed to load deals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  const handleStageChange = async (id: string, newStage: string) => {
    const res = await updateDealStage(id, newStage);
    if (res.success) {
      setDeals((prev) =>
        prev.map((d) => (d.id === id ? { ...d, lifecycleStage: newStage } : d))
      );
      showToast(`Deal moved to ${newStage.replace('_', ' ')}`);
    } else {
      showToast(res.error || 'Failed to update stage', 'error');
    }
  };

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.apn || !newDeal.county || !newDeal.state || !newDeal.ownerName) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createDeal({
        ...newDeal,
        acreage: Number(newDeal.acreage),
        usableAcreage: Number(newDeal.acreage),
        askingPrice: Number(newDeal.askingPrice || 0)
      });

      if (res.success) {
        showToast('Deal successfully added to pipeline!');
        setIsModalOpen(false);
        setNewDeal({ apn: '', county: '', state: '', acreage: 10, askingPrice: 0, ownerName: '' });
        await loadDeals();
      } else {
        showToast(res.error || 'Failed to create deal', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400 flex items-center gap-2">
              <LayoutGrid className="w-6 h-6 text-indigo-500" />
              Acquisition Deal Pipeline
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Visual pipeline tracking {deals.length} active parcels across lifecycle stages with real persistence
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDeals}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Refresh deals"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Pipeline Deal
            </button>
          </div>
        </div>

        {/* Pipeline Kanban Columns */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-sm">Loading pipeline opportunities...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max h-[calc(100vh-210px)]">
              {STAGES.map((col) => {
                const stageDeals = deals.filter((d) => d.lifecycleStage === col);
                return (
                  <div key={col} className="w-72 bg-slate-900/60 rounded-xl p-3 border border-slate-800 flex flex-col h-full shadow-sm">
                    <div className="flex justify-between items-center mb-3 px-1">
                      <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-300">
                        {col.replace('_', ' ')}
                      </h3>
                      <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full text-slate-300 font-mono">
                        {stageDeals.length}
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                      {stageDeals.map((deal) => (
                        <div 
                          key={deal.id}
                          className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-indigo-500/60 transition-all shadow-sm group"
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                              {deal.apn}
                            </span>
                            <Link 
                              href={`/properties/${deal.id}`}
                              className="text-slate-500 hover:text-indigo-400"
                              title="View Property Profile"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center mb-2">
                            <MapPin className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                            <span className="truncate">{deal.county}, {deal.state} • {deal.acreage} AC</span>
                          </div>

                          <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-800/80">
                            <div>
                              <span className="text-[10px] text-slate-500 block">Est. Market Value</span>
                              <span className="font-semibold text-emerald-400">
                                ${deal.estimatedMarketValue ? deal.estimatedMarketValue.toLocaleString() : (deal.askingPrice || 0).toLocaleString()}
                              </span>
                            </div>

                            <select
                              value={deal.lifecycleStage}
                              onChange={(e) => handleStageChange(deal.id, e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded text-[10px] px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500 font-medium"
                            >
                              {STAGES.map((s) => (
                                <option key={s} value={s}>{s.replace('_', ' ')}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageDeals.length === 0 && (
                        <div className="p-4 text-center rounded-lg border border-dashed border-slate-800/80 text-[11px] text-slate-500">
                          No deals in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add Opportunity to Pipeline
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">APN (Parcel Number) *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 504-22-109"
                  value={newDeal.apn}
                  onChange={(e) => setNewDeal({ ...newDeal, apn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Owner Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Miller Family Holdings"
                  value={newDeal.ownerName}
                  onChange={(e) => setNewDeal({ ...newDeal, ownerName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">County *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Reeves"
                    value={newDeal.county}
                    onChange={(e) => setNewDeal({ ...newDeal, county: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">State *</label>
                  <input 
                    type="text" 
                    required
                    maxLength={2}
                    placeholder="e.g. TX"
                    value={newDeal.state}
                    onChange={(e) => setNewDeal({ ...newDeal, state: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Acreage *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    required
                    value={newDeal.acreage}
                    onChange={(e) => setNewDeal({ ...newDeal, acreage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Asking Price ($)</label>
                  <input 
                    type="number" 
                    value={newDeal.askingPrice}
                    onChange={(e) => setNewDeal({ ...newDeal, askingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
