'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Calculator, AlertTriangle, TrendingUp, Lightbulb, RefreshCw, DollarSign, Activity } from 'lucide-react';
import { runFinancialScenario } from '../../actions/financialActions';
import type { FinancialScenarioParams, FinancialScenarioResult } from '../../actions/financialActions';

interface FinancialProFormaProps {
  initialPurchasePrice: number;
}

export function FinancialProForma({ initialPurchasePrice }: FinancialProFormaProps) {
  const [params, setParams] = useState<FinancialScenarioParams>({
    purchasePrice: initialPurchasePrice,
    developmentCosts: 50000,
    holdTimeMonths: 24,
    exitStrategy: 'ENTITLE_FLIP',
    subdivisionLots: 0,
    ltvPercent: 65,
    interestRatePercent: 8.5,
  });

  const [result, setResult] = useState<FinancialScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial run
    handleRunScenario();
  }, []);

  const handleRunScenario = async () => {
    setLoading(true);
    try {
      const res = await runFinancialScenario(params);
      setResult(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleParamChange = (field: keyof FinancialScenarioParams, value: any) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatPercent = (val: number) => new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 }).format(val / 100);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            Scenario Modeler
          </CardTitle>
          <CardDescription className="text-slate-400">
            Adjust variables to see real-time AI financial forecasting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">Purchase Price ($)</label>
              <input 
                type="number" 
                value={params.purchasePrice} 
                onChange={(e) => handleParamChange('purchasePrice', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">Dev/Capex Costs ($)</label>
              <input 
                type="number" 
                value={params.developmentCosts} 
                onChange={(e) => handleParamChange('developmentCosts', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">Hold Time (Months): {params.holdTimeMonths}</label>
              <input 
                type="range" 
                min="1" max="120" 
                value={params.holdTimeMonths} 
                onChange={(e) => handleParamChange('holdTimeMonths', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">Exit Strategy</label>
              <select 
                value={params.exitStrategy}
                onChange={(e) => handleParamChange('exitStrategy', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200"
              >
                <option value="AS_IS">Sell As-Is</option>
                <option value="ENTITLE_FLIP">Entitle & Flip</option>
                <option value="SUBDIVIDE">Subdivide</option>
                <option value="BUILD_TO_RENT">Build to Rent</option>
              </select>
            </div>

            {params.exitStrategy === 'SUBDIVIDE' && (
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-medium uppercase">Number of Lots</label>
                <input 
                  type="number" 
                  value={params.subdivisionLots} 
                  onChange={(e) => handleParamChange('subdivisionLots', Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-slate-200"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">LTV ({params.ltvPercent}%)</label>
              <input 
                type="range" 
                min="0" max="100" step="5"
                value={params.ltvPercent} 
                onChange={(e) => handleParamChange('ltvPercent', Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-medium uppercase">Interest Rate ({params.interestRatePercent}%)</label>
              <input 
                type="range" 
                min="0" max="20" step="0.25"
                value={params.interestRatePercent} 
                onChange={(e) => handleParamChange('interestRatePercent', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <Button 
            onClick={handleRunScenario}
            disabled={loading}
            variant="primary"
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
            {loading ? "Running AI Simulation..." : "Simulate Scenario"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase">Levered IRR</p>
                <p className="text-2xl font-bold text-emerald-400">{formatPercent(result.metrics.leveredIrr)}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase">Equity Multiple</p>
                <p className="text-2xl font-bold text-blue-400">{result.metrics.equityMultiple.toFixed(2)}x</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase">Cash on Cash</p>
                <p className="text-2xl font-bold text-amber-400">{formatPercent(result.metrics.cashOnCash)}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-1">
                <p className="text-xs text-slate-400 font-medium uppercase">Total Profit</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(result.metrics.totalProfit)}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-900 border-slate-800 border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-slate-200 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-purple-400" />
                AI Strategy Output
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Recommendation</h4>
                <p className="text-slate-400 text-sm">{result.aiAnalysis.recommendation}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Hidden Risks
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                    {result.aiAnalysis.hiddenRisks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Timeline Warnings
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                    {result.aiAnalysis.timelineWarnings.map((warn, i) => (
                      <li key={i}>{warn}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
