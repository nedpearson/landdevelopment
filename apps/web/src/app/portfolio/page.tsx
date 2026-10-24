'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PieChart, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  MapPin,
  DollarSign
} from 'lucide-react';
import { 
  getPortfolioHoldings, 
  createPortfolioHolding, 
  updateHoldingValue, 
  deletePortfolioHolding,
  getPropertiesForDropdown 
} from '@/actions/portfolioActions';

export default function PortfolioManager() {
  const [holdings, setHoldings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newValInput, setNewValInput] = useState<number>(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Holding Form State
  const [newHolding, setNewHolding] = useState({
    propertyId: '',
    apn: '',
    county: '',
    state: '',
    acreage: 10,
    purchasePrice: 50000,
    closingCosts: 1500,
    holdingCosts: 500,
    estimatedCurrentValue: 75000,
    status: 'OWNED'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [holdingsData, propsData] = await Promise.all([
        getPortfolioHoldings(),
        getPropertiesForDropdown()
      ]);
      setHoldings(holdingsData);
      setProperties(propsData);
      if (propsData.length > 0 && !newHolding.propertyId) {
        const first = propsData[0];
        setNewHolding(prev => ({
          ...prev,
          propertyId: first.id,
          apn: first.apn,
          county: first.county,
          state: first.state
        }));
      }
    } catch (err) {
      showToast('Failed to load portfolio holdings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBasis = holdings.reduce((acc, curr) => acc + (curr.totalCostBasis || curr.purchasePrice || 0), 0);
  const totalValue = holdings.reduce((acc, curr) => acc + (curr.estimatedCurrentValue || 0), 0);
  const totalGain = totalValue - totalBasis;
  const roiPct = totalBasis > 0 ? (totalGain / totalBasis) * 100 : 0;

  const handleUpdateValuation = async (id: string) => {
    if (newValInput <= 0) return;
    const res = await updateHoldingValue(id, newValInput);
    if (res.success) {
      setHoldings(prev => prev.map(h => h.id === id ? { 
        ...h, 
        estimatedCurrentValue: newValInput,
        unrealizedProfit: newValInput - h.totalCostBasis 
      } : h));
      setEditingId(null);
      showToast('Valuation updated');
    } else {
      showToast(res.error || 'Failed to update valuation', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this asset from portfolio?')) return;
    const res = await deletePortfolioHolding(id);
    if (res.success) {
      setHoldings(prev => prev.filter(h => h.id !== id));
      showToast('Holding removed');
    } else {
      showToast(res.error || 'Failed to delete holding', 'error');
    }
  };

  const handleCreateHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolding.propertyId || !newHolding.apn) return;

    setIsSubmitting(true);
    try {
      const basis = Number(newHolding.purchasePrice) + Number(newHolding.closingCosts) + Number(newHolding.holdingCosts);
      const estVal = Number(newHolding.estimatedCurrentValue);
      const res = await createPortfolioHolding({
        propertyId: newHolding.propertyId,
        apn: newHolding.apn,
        county: newHolding.county,
        state: newHolding.state,
        acreage: Number(newHolding.acreage),
        acquisitionDate: new Date(),
        purchasePrice: Number(newHolding.purchasePrice),
        closingCosts: Number(newHolding.closingCosts),
        holdingCosts: Number(newHolding.holdingCosts),
        totalCostBasis: basis,
        estimatedCurrentValue: estVal,
        unrealizedProfit: estVal - basis,
        status: newHolding.status
      });

      if (res.success) {
        showToast('Asset added to portfolio!');
        setIsModalOpen(false);
        await loadData();
      } else {
        showToast(res.error || 'Failed to add asset', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <PieChart className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Portfolio & Asset Management</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Real-time portfolio basis, property equity, asset disposition tracking, and owner finance notes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add Holding
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Total Cost Basis</span>
            <div className="text-2xl font-bold text-white mt-1">${totalBasis.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500">Capital invested in {holdings.length} assets</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Current Portfolio Value</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">${totalValue.toLocaleString()}</div>
            <span className="text-[10px] text-slate-500">Market valuation across land holdings</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Total Unrealized Gain</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center">
              <ArrowUpRight className="w-5 h-5 mr-1" />
              +${totalGain.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500">Appreciation above purchase & carry</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase text-slate-400">Portfolio Return (ROI)</span>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{roiPct.toFixed(1)}%</div>
            <span className="text-[10px] text-slate-500">Aggregate equity return</span>
          </div>
        </div>

        {/* Holdings Table */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <p className="text-sm">Loading portfolio assets...</p>
          </div>
        ) : holdings.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400">
            No assets currently recorded in portfolio. Close an acquisition in Transactions or click "Add Holding".
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Asset / APN</th>
                    <th className="p-3.5">Acquired</th>
                    <th className="p-3.5">Cost Basis</th>
                    <th className="p-3.5">Current Value</th>
                    <th className="p-3.5">Unrealized Gain</th>
                    <th className="p-3.5">Holding Days</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {holdings.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                          {h.apn}
                          {h.propertyId && (
                            <Link href={`/properties/${h.propertyId}`} className="text-slate-500 hover:text-indigo-400">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {h.county}, {h.state} • {h.acreage} AC
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-300 font-mono">
                        {new Date(h.acquisitionDate).toLocaleDateString()}
                      </td>

                      <td className="p-3.5 font-medium text-white">
                        ${(h.totalCostBasis || h.purchasePrice).toLocaleString()}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        {editingId === h.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={newValInput}
                              onChange={(e) => setNewValInput(Number(e.target.value))}
                              className="w-24 bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white"
                            />
                            <button
                              onClick={() => handleUpdateValuation(h.id)}
                              className="px-1.5 py-0.5 bg-emerald-600 rounded text-[10px] text-white"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-slate-400 text-xs ml-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span>${(h.estimatedCurrentValue || 0).toLocaleString()}</span>
                            <button
                              onClick={() => { setEditingId(h.id); setNewValInput(h.estimatedCurrentValue || 0); }}
                              className="text-slate-500 hover:text-slate-300"
                              title="Update Valuation"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-3.5 font-bold text-emerald-400">
                        +${(h.unrealizedProfit || 0).toLocaleString()}
                      </td>

                      <td className="p-3.5 text-slate-300 font-mono">
                        {h.holdingDays || 0} days
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[10px] font-bold uppercase font-mono">
                          {h.status}
                        </span>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDelete(h.id)}
                          className="p-1 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete holding"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Holding Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Capitalize Holding into Portfolio
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHolding} className="space-y-4 mt-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Select Property *</label>
                <select
                  required
                  value={newHolding.propertyId}
                  onChange={(e) => {
                    const p = properties.find(prop => prop.id === e.target.value);
                    setNewHolding({
                      ...newHolding,
                      propertyId: e.target.value,
                      apn: p?.apn || '',
                      county: p?.county || '',
                      state: p?.state || ''
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>APN {p.apn} ({p.county}, {p.state})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Purchase Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newHolding.purchasePrice}
                    onChange={(e) => setNewHolding({ ...newHolding, purchasePrice: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Acreage *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newHolding.acreage}
                    onChange={(e) => setNewHolding({ ...newHolding, acreage: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Closing & Title Fees ($)</label>
                  <input
                    type="number"
                    value={newHolding.closingCosts}
                    onChange={(e) => setNewHolding({ ...newHolding, closingCosts: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Current Market Valuation ($) *</label>
                  <input
                    type="number"
                    required
                    value={newHolding.estimatedCurrentValue}
                    onChange={(e) => setNewHolding({ ...newHolding, estimatedCurrentValue: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
