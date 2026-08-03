'use client';

import React, { useState } from 'react';
import { Calculator, Save, FileText, TrendingUp, DollarSign, Percent, ArrowRight } from 'lucide-react';

const MOCK_PROPERTIES = [
  { id: '1', name: 'Riverside 120 AC', price: 1200000 },
  { id: '2', name: 'Smith Tract', price: 450000 },
  { id: '3', name: 'Oak Hill Parcels', price: 850000 },
];

export default function UnderwritingDashboard() {
  const [selectedProp, setSelectedProp] = useState(MOCK_PROPERTIES[0]);
  const [inputs, setInputs] = useState({
    askingPrice: 1200000,
    targetMAO: 950000,
    downPaymentPct: 20,
    interestRate: 6.5,
    term: 30,
    resalePrice: 1800000,
    holdingMonths: 12
  });

  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Simple calcs for UI demonstration
  const downPayment = inputs.targetMAO * (inputs.downPaymentPct / 100);
  const loanAmount = inputs.targetMAO - downPayment;
  const grossProfit = inputs.resalePrice - inputs.targetMAO;
  const roi = (grossProfit / inputs.targetMAO) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      {toast && (
        <div className="fixed top-4 right-4 p-4 rounded-md shadow-lg bg-indigo-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="p-6 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <Calculator className="w-6 h-6 mr-3 text-indigo-500" />
              Underwriting Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Financial analysis and deal structuring</p>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => showToast('Analysis saved to deal file')} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md flex items-center border border-slate-700">
              <Save className="w-4 h-4 mr-2" /> Save Analysis
            </button>
            <button onClick={() => showToast('Generating PDF Report...')} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Generate Report
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 overflow-y-auto">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Select Deal</h2>
          <div className="space-y-2">
            {MOCK_PROPERTIES.map(prop => (
              <button 
                key={prop.id}
                onClick={() => { setSelectedProp(prop); setInputs({...inputs, askingPrice: prop.price, targetMAO: prop.price * 0.8}); }}
                className={`w-full text-left p-3 rounded-md transition-colors ${selectedProp.id === prop.id ? 'bg-indigo-900/40 border border-indigo-700/50' : 'hover:bg-slate-800 border border-transparent'}`}
              >
                <div className="font-medium text-white">{prop.name}</div>
                <div className="text-sm text-slate-400">${prop.price.toLocaleString()}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Inputs Panel */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-2">Assumptions & Inputs</h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Asking Price</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input type="number" name="askingPrice" value={inputs.askingPrice} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-9 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-indigo-400 mb-1">Target MAO</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-indigo-500" />
                      <input type="number" name="targetMAO" value={inputs.targetMAO} onChange={handleInputChange} className="w-full bg-slate-900 border border-indigo-500/50 rounded p-2 pl-9 text-white focus:border-indigo-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Down Payment %</label>
                    <div className="relative">
                      <Percent className="w-4 h-4 absolute right-3 top-2.5 text-slate-500" />
                      <input type="number" name="downPaymentPct" value={inputs.downPaymentPct} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 pr-9 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Est. Resale Price</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                      <input type="number" name="resalePrice" value={inputs.resalePrice} onChange={handleInputChange} className="w-full bg-slate-900 border border-slate-700 rounded p-2 pl-9 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outputs Panel */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-6 border-b border-slate-700 pb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-500" /> Outputs & Returns
              </h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Total Cash Needed</div>
                  <div className="text-3xl font-bold text-white">${downPayment.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Est. Gross Profit</div>
                  <div className="text-3xl font-bold text-emerald-400">${grossProfit.toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded border border-slate-700">
                  <span className="text-slate-300">Simple ROI</span>
                  <span className="font-bold text-white">{roi.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900 rounded border border-slate-700">
                  <span className="text-slate-300">Loan Amount</span>
                  <span className="font-medium text-slate-200">${loanAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
