'use client';

import React, { useState } from 'react';
import { Calculator, Download, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'Income' | 'Expenses' | 'P&L'>('P&L');
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const MOCK_INCOME = [
    { id: '1', date: '2026-08-01', source: 'Alice Smith - 101', desc: 'August Rent', amount: 1200, category: 'Rent' },
    { id: '2', date: '2026-08-01', source: 'Charlie Brown - 201', desc: 'August Rent', amount: 1250, category: 'Rent' },
    { id: '3', date: '2026-08-05', source: 'Bob Jones - 102', desc: 'Late Fee', amount: 50, category: 'Fees' },
  ];

  const MOCK_EXPENSES = [
    { id: '1', date: '2026-08-02', vendor: 'City Utilities', desc: 'Water Bill - Main St', amount: 145.50, category: 'Utilities' },
    { id: '2', date: '2026-08-03', vendor: 'Cool Breeze HVAC', desc: 'AC Repair - B1', amount: 350.00, category: 'Maintenance' },
    { id: '3', date: '2026-08-05', vendor: 'Lawn Care Plus', desc: 'Landscaping', amount: 120.00, category: 'Maintenance' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Calculator className="w-8 h-8 text-teal-500" />
              Property Accounting
            </h1>
            <p className="text-slate-400">Track income, expenses, and view P&L statements.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => showToast('Exporting data')} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => showToast('Add Transaction modal opened')} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> Transaction
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="border-b border-slate-700 flex">
            {['P&L', 'Income', 'Expenses'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-teal-500 text-teal-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'P&L' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 font-medium flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Total Income (Aug)</h3>
                    <p className="text-3xl font-bold text-emerald-400 mt-2">$2,500.00</p>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                    <h3 className="text-slate-400 font-medium flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-400" /> Total Expenses (Aug)</h3>
                    <p className="text-3xl font-bold text-red-400 mt-2">$615.50</p>
                  </div>
                  <div className="bg-slate-900/50 p-6 rounded-lg border border-teal-500/30">
                    <h3 className="text-slate-400 font-medium">Net Operating Income</h3>
                    <p className="text-3xl font-bold text-white mt-2">$1,884.50</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Cash Flow Overview</h3>
                  <div className="h-64 flex items-end gap-4 border-b border-slate-700 pb-2">
                    {/* Mock CSS Bar Chart */}
                    <div className="flex-1 flex flex-col justify-end items-center group relative">
                      <div className="w-full bg-emerald-500/80 rounded-t-sm transition-all" style={{ height: '80%' }}></div>
                      <div className="w-full bg-red-500/80 rounded-t-sm transition-all mt-1" style={{ height: '20%' }}></div>
                      <span className="text-xs text-slate-400 mt-2">Jun</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center group relative">
                      <div className="w-full bg-emerald-500/80 rounded-t-sm transition-all" style={{ height: '85%' }}></div>
                      <div className="w-full bg-red-500/80 rounded-t-sm transition-all mt-1" style={{ height: '25%' }}></div>
                      <span className="text-xs text-slate-400 mt-2">Jul</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center group relative">
                      <div className="w-full bg-emerald-500/80 rounded-t-sm transition-all" style={{ height: '40%' }}></div>
                      <div className="w-full bg-red-500/80 rounded-t-sm transition-all mt-1" style={{ height: '15%' }}></div>
                      <span className="text-xs text-slate-400 mt-2">Aug (MTD)</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-6 mt-4 text-sm">
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Income</span>
                    <span className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Expenses</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Income' && (
              <div className="overflow-x-auto -mx-6 -my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/30 text-slate-400 text-sm border-b border-slate-700">
                      <th className="p-4 pl-6 font-medium">Date</th>
                      <th className="p-4 font-medium">Tenant / Source</th>
                      <th className="p-4 font-medium">Description</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 pr-6 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-sm">
                    {MOCK_INCOME.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-700/30">
                        <td className="p-4 pl-6 text-slate-400">{row.date}</td>
                        <td className="p-4 font-medium text-white">{row.source}</td>
                        <td className="p-4 text-slate-300">{row.desc}</td>
                        <td className="p-4 text-slate-400">{row.category}</td>
                        <td className="p-4 pr-6 text-right font-medium text-emerald-400">+${row.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'Expenses' && (
              <div className="overflow-x-auto -mx-6 -my-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/30 text-slate-400 text-sm border-b border-slate-700">
                      <th className="p-4 pl-6 font-medium">Date</th>
                      <th className="p-4 font-medium">Vendor / Payee</th>
                      <th className="p-4 font-medium">Description</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 pr-6 font-medium text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 text-sm">
                    {MOCK_EXPENSES.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-700/30">
                        <td className="p-4 pl-6 text-slate-400">{row.date}</td>
                        <td className="p-4 font-medium text-white">{row.vendor}</td>
                        <td className="p-4 text-slate-300">{row.desc}</td>
                        <td className="p-4 text-slate-400">{row.category}</td>
                        <td className="p-4 pr-6 text-right font-medium text-red-400">-${row.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}


