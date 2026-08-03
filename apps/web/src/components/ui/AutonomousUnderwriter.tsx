"use client";

import React, { useEffect, useState } from 'react';
import { Calculator, TrendingUp, AlertOctagon, CheckCircle2, DollarSign, Activity, Loader2, RefreshCw } from 'lucide-react';
import { generateUnderwritingAnalysis } from '@/actions/underwritingActions';
import type { UnderwritingAnalysis } from '@/actions/underwritingActions';
import type { Property } from '@land-intelligence/database';

interface Props {
  propertyData: Property;
}

export function AutonomousUnderwriter({ propertyData }: Props) {
  const [analysis, setAnalysis] = useState<UnderwritingAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    setLoading(true);
    const data = await generateUnderwritingAnalysis(propertyData.id);
    setAnalysis(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalysis();
  }, [propertyData.id]);

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] shadow-sm">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-slate-200">AI Underwriter is running...</h3>
        <p className="text-sm text-slate-500 text-center max-w-sm mt-2">
          Analyzing comparables, estimating development costs, and calculating the exact Max Allowable Offer (MAO).
        </p>
      </div>
    );
  }

  if (!analysis) return null;

  const recColor = 
    analysis.recommendation === 'STRONG BUY' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
    analysis.recommendation === 'BUY' ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20' :
    analysis.recommendation === 'HOLD' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
    'text-rose-400 bg-rose-400/10 border-rose-400/20';

  const formatCurrency = (num: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl relative">
      {/* Decorative Header */}
      <div className="bg-slate-950/50 p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <Calculator className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Autonomous AVM Underwriting</h2>
            <p className="text-xs text-slate-500">Live AI Financial Modeling</p>
          </div>
        </div>
        <button onClick={fetchAnalysis} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6">
        {/* Recommendation Banner */}
        <div className={`flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-xl border ${recColor} mb-8`}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {analysis.recommendation.includes('BUY') ? <CheckCircle2 className="w-5 h-5" /> : <AlertOctagon className="w-5 h-5" />}
              <span className="font-bold tracking-wide uppercase text-sm">{analysis.recommendation}</span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              {analysis.reasoning}
            </p>
          </div>
          <div className="shrink-0 text-center md:text-right border-t md:border-t-0 md:border-l border-current/20 pt-4 md:pt-0 md:pl-6">
            <div className="text-xs uppercase tracking-wider font-semibold opacity-80 mb-1">Max Allowable Offer</div>
            <div className="text-3xl font-bold font-mono tracking-tight">{formatCurrency(analysis.maxAllowableOffer)}</div>
          </div>
        </div>

        {/* Financial Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <DollarSign className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-medium uppercase">Resale Value (ARV)</span>
            </div>
            <div className="text-xl font-semibold text-slate-200">{formatCurrency(analysis.estimatedResaleValue)}</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-medium uppercase">Dev + Hold Costs</span>
            </div>
            <div className="text-xl font-semibold text-slate-200">{formatCurrency(analysis.developmentCosts + analysis.holdingCosts)}</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium uppercase">Projected Net</span>
            </div>
            <div className="text-xl font-semibold text-emerald-400">{formatCurrency(analysis.netProfit)}</div>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Calculator className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-medium uppercase">ROI Yield</span>
            </div>
            <div className="text-xl font-semibold text-purple-400">{analysis.projectedROI}%</div>
          </div>
        </div>

        {/* Risk Factors */}
        {analysis.riskFactors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" /> Key Risk Factors
            </h3>
            <ul className="space-y-2">
              {analysis.riskFactors.map((risk, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-400 bg-slate-950/30 p-2.5 rounded-md border border-slate-800/50">
                  <span className="text-rose-500 mt-0.5">•</span> {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
