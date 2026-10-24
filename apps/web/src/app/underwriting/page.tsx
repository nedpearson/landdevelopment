'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calculator, 
  Save, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw,
  Sliders,
  Scale,
  Building2,
  ChevronRight
} from 'lucide-react';
import { getAllProperties, updateProperty } from '@/actions/propertyActions';

interface PropertyItem {
  id: string;
  apn: string;
  county: string;
  state: string;
  acreage: number;
  askingPrice?: number | null;
  estimatedMarketValue?: number | null;
  suggestedOfferPrice?: number | null;
  dealScore?: number | null;
  ownerName: string;
}

export default function UnderwritingDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropId, setSelectedPropId] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Financial Inputs
  const [askingPrice, setAskingPrice] = useState(75000);
  const [targetMAO, setTargetMAO] = useState(48000);
  const [resalePrice, setResalePrice] = useState(96000);
  const [developmentCostsPerAcre, setDevelopmentCostsPerAcre] = useState(500);
  const [closingCosts, setClosingCosts] = useState(2500);
  const [holdingMonths, setHoldingMonths] = useState(12);
  const [annualPropertyTax, setAnnualPropertyTax] = useState(850);
  const [annualInsurance, setAnnualInsurance] = useState(400);
  const [contingencyPct, setContingencyPct] = useState(10); // 10%
  const [scenarioMode, setScenarioMode] = useState<'BASE' | 'CONSERVATIVE' | 'AGGRESSIVE'>('BASE');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllProperties();
        setProperties(data as PropertyItem[]);
        if (data.length > 0) {
          const first = data[0];
          setSelectedPropId(first.id);
          applyPropertyValues(first);
        }
      } catch (err) {
        showToast('Failed to load properties for underwriting', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropId) || properties[0];
  }, [properties, selectedPropId]);

  const applyPropertyValues = (prop: PropertyItem) => {
    const ask = prop.askingPrice || 75000;
    const emv = prop.estimatedMarketValue || (ask * 1.35);
    const mao = prop.suggestedOfferPrice || Math.round(emv * 0.55);
    setAskingPrice(ask);
    setResalePrice(emv);
    setTargetMAO(mao);
  };

  const handleSelectProperty = (prop: PropertyItem) => {
    setSelectedPropId(prop.id);
    applyPropertyValues(prop);
  };

  // Scenario Multiplier
  const scenarioMultiplier = scenarioMode === 'CONSERVATIVE' ? 0.88 : scenarioMode === 'AGGRESSIVE' ? 1.15 : 1.0;
  const effectiveResale = Math.round(resalePrice * scenarioMultiplier);

  // Exact Reproducible Financial Underwriting Model
  const acreage = selectedProperty?.acreage || 10;
  const totalDevelopmentCosts = Math.round(developmentCostsPerAcre * acreage);
  const totalHoldingCosts = Math.round(((annualPropertyTax + annualInsurance) / 12) * holdingMonths);
  const rawSubtotal = targetMAO + totalDevelopmentCosts + closingCosts + totalHoldingCosts;
  const contingencyAmount = Math.round(rawSubtotal * (contingencyPct / 100));
  const totalCostBasis = rawSubtotal + contingencyAmount;

  const grossProfit = effectiveResale - targetMAO;
  const netProfit = effectiveResale - totalCostBasis;
  const roi = totalCostBasis > 0 ? (netProfit / totalCostBasis) * 100 : 0;
  const annualizedROI = holdingMonths > 0 ? roi * (12 / holdingMonths) : roi;
  const breakEvenResale = totalCostBasis;

  // Investment Viability Recommendation
  const recommendation = useMemo(() => {
    if (roi >= 50) return { label: 'STRONG BUY', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' };
    if (roi >= 30) return { label: 'BUY', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
    if (roi >= 15) return { label: 'MARGINAL / RE-OFFER', color: 'text-amber-400 bg-amber-500/20 border-amber-500/30' };
    return { label: 'PASS / REJECT', color: 'text-red-400 bg-red-500/20 border-red-500/30' };
  }, [roi]);

  const handleSaveAnalysis = async () => {
    if (!selectedProperty) return;
    setSaving(true);
    try {
      const dealScore = Math.min(99, Math.max(10, Math.round(roi)));
      const res = await updateProperty(selectedProperty.id, {
        askingPrice,
        estimatedMarketValue: effectiveResale,
        suggestedOfferPrice: targetMAO,
        lifecycleStage: 'UNDERWRITING'
      } as any);

      if (res.success) {
        showToast(`Underwriting saved! MAO set to $${targetMAO.toLocaleString()} for APN ${selectedProperty.apn}`);
        setProperties(prev => prev.map(p => p.id === selectedProperty.id ? {
          ...p,
          askingPrice,
          estimatedMarketValue: effectiveResale,
          suggestedOfferPrice: targetMAO,
          dealScore
        } : p));
      } else {
        showToast((res as any).error || 'Failed to save analysis', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCreateOffer = () => {
    router.push(`/offers?propertyId=${selectedProperty?.id}&amount=${targetMAO}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <ShieldAlert className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Investment Underwriting Engine</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Deterministic real estate financial modeling, Max Allowable Offer (MAO) formulation, and sensitivity analysis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAnalysis}
              disabled={saving || !selectedProperty}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              {saving ? 'Saving...' : 'Save to Record'}
            </button>
            <button
              onClick={handleCreateOffer}
              disabled={!selectedProperty}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Prepare Offer ($ {targetMAO.toLocaleString()})
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden max-w-7xl mx-auto w-full">
        {/* Left Deal Selector Sidebar */}
        <aside className="w-72 bg-slate-900/40 border-r border-slate-800/80 p-4 shrink-0 overflow-y-auto space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Active Parcels ({properties.length})
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-500">Loading parcels...</div>
          ) : properties.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">No properties in database</div>
          ) : (
            properties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => handleSelectProperty(prop)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedProperty?.id === prop.id
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                    : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="font-mono font-bold text-white truncate">{prop.apn}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{prop.acreage} AC • {prop.county}, {prop.state}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-slate-500">Asking:</span>
                  <span className="font-semibold text-white">${(prop.askingPrice || 0).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </aside>

        {/* Main Underwriting Workspace */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {selectedProperty ? (
            <>
              {/* Selected Property Hero Banner */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 font-mono">
                      APN: {selectedProperty.apn}
                    </span>
                    <span className="text-xs text-slate-400">{selectedProperty.acreage} Gross Acres • {selectedProperty.county}, {selectedProperty.state}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">Owner of Record: {selectedProperty.ownerName}</div>
                </div>

                {/* Scenario Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  {(['CONSERVATIVE', 'BASE', 'AGGRESSIVE'] as const).map((sc) => (
                    <button
                      key={sc}
                      onClick={() => setScenarioMode(sc)}
                      className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                        scenarioMode === sc ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Target Max Offer (MAO)</span>
                  <div className="text-2xl font-bold text-white mt-1">${targetMAO.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">{(targetMAO / (selectedProperty.acreage || 1)).toFixed(0)}/acre</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Basis In Deal</span>
                  <div className="text-2xl font-bold text-slate-200 mt-1">${totalCostBasis.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500">Purchase + Dev + Carry</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Net Profit</span>
                  <div className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ${netProfit.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500">At ${effectiveResale.toLocaleString()} exit</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Projected Return</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">{roi.toFixed(1)}% <span className="text-xs text-slate-500">ROI</span></div>
                  <div className="mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${recommendation.color}`}>
                      {recommendation.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Input Parameters and Calculations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs Box */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                    Underwriting Assumptions & Inputs
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Max Allowable Offer (MAO):</span>
                        <span className="font-bold text-indigo-400">${targetMAO.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min={5000}
                        max={resalePrice * 0.9}
                        step={1000}
                        value={targetMAO}
                        onChange={(e) => setTargetMAO(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Estimated Resale Value (Exit):</span>
                        <span className="font-bold text-emerald-400">${resalePrice.toLocaleString()}</span>
                      </div>
                      <input
                        type="number"
                        value={resalePrice}
                        onChange={(e) => setResalePrice(Number(e.target.value) || 0)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Dev Costs ($/Acre)</label>
                        <input
                          type="number"
                          value={developmentCostsPerAcre}
                          onChange={(e) => setDevelopmentCostsPerAcre(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Closing & Legal ($)</label>
                        <input
                          type="number"
                          value={closingCosts}
                          onChange={(e) => setClosingCosts(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Holding Period (Months)</label>
                        <input
                          type="number"
                          value={holdingMonths}
                          onChange={(e) => setHoldingMonths(Number(e.target.value) || 1)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Contingency Buffer (%)</label>
                        <input
                          type="number"
                          value={contingencyPct}
                          onChange={(e) => setContingencyPct(Number(e.target.value) || 0)}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calculation Breakdown Table */}
                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <Scale className="w-4 h-4 text-emerald-400" />
                      Detailed Cost Basis & Waterfall
                    </h3>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Target Acquisition Price</span>
                        <span className="font-semibold text-white">${targetMAO.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Land Dev / Clearing ({acreage} AC @ ${developmentCostsPerAcre}/AC)</span>
                        <span className="font-semibold text-white">${totalDevelopmentCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Holding Carrying Costs ({holdingMonths} mos)</span>
                        <span className="font-semibold text-white">${totalHoldingCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Closing & Title Transaction Fees</span>
                        <span className="font-semibold text-white">${closingCosts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Contingency Reserve ({contingencyPct}%)</span>
                        <span className="font-semibold text-amber-400">${contingencyAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-slate-700 text-sm">
                        <span className="font-bold text-white">Total Cost Basis</span>
                        <span className="font-bold text-white">${totalCostBasis.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-t border-slate-800">
                        <span className="text-slate-400">Break-Even Resale Requirement</span>
                        <span className="font-semibold text-slate-300">${breakEvenResale.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Target Annualized IRR:</span>
                    <span className="text-base font-bold text-cyan-400">{annualizedROI.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
