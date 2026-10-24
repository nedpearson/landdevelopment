'use client';

import { submitGenericForm } from '@/actions/genericActions';
import { createSubscriptionCheckout } from '@/actions/expansionActions';
import React, { useState } from 'react';
import { Plus, Receipt, Search, FileText, CheckCircle, X, Filter, CreditCard, Sparkles, Check, Shield } from 'lucide-react';

interface BillingEntry {
  id: string;
  landman: string;
  date: string;
  project: string;
  hours: number;
  rate: number;
  mileage: number;
  perDiem: number;
}

const mockBilling: BillingEntry[] = [
  { id: '1', landman: 'John Landman', date: '2024-02-15', project: 'Permian Alpha', hours: 8, rate: 100, mileage: 45, perDiem: 150 },
  { id: '2', landman: 'John Landman', date: '2024-02-16', project: 'Permian Alpha', hours: 10, rate: 100, mileage: 0, perDiem: 150 },
  { id: '3', landman: 'Sarah Broker', date: '2024-02-15', project: 'Eagle Ford Extension', hours: 8, rate: 125, mileage: 120, perDiem: 0 },
  { id: '4', landman: 'Sarah Broker', date: '2024-02-16', project: 'Eagle Ford Extension', hours: 8, rate: 125, mileage: 0, perDiem: 0 },
  { id: '5', landman: 'Mike Field', date: '2024-02-15', project: 'Bakken Infill', hours: 12, rate: 90, mileage: 200, perDiem: 200 },
];

export default function BillingPage() {
  const [entries, setEntries] = useState<BillingEntry[]>(mockBilling);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (tierId: 'STARTER' | 'PRO' | 'ENTERPRISE') => {
    setIsSubscribing(true);
    try {
      const res = await createSubscriptionCheckout(tierId);
      if (res.success && res.data) {
        if (res.data.checkoutUrl.startsWith('http')) {
          window.location.href = res.data.checkoutUrl;
        } else {
          showToast(`Subscribed to ${res.data.tierName}! Session active.`);
        }
      } else {
        showToast((res as any).error || 'Checkout initiation failed', 'error');
      }
    } catch {
      showToast('Error connecting to billing service', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitGenericForm(Object.fromEntries(formData.entries()));
    setIsEntryModalOpen(false);
    showToast(result.success ? 'Saved successfully!' : 'Error saving');
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredEntries = entries.filter(e => e.landman.toLowerCase().includes(search.toLowerCase()) || e.project.toLowerCase().includes(search.toLowerCase()));

  const mileageRate = 0.67; // IRS 2024 rate

  const totals = filteredEntries.reduce((acc, curr) => ({
    hours: acc.hours + curr.hours,
    dayRateTotal: acc.dayRateTotal + (curr.hours * curr.rate),
    mileageTotal: acc.mileageTotal + (curr.mileage * mileageRate),
    perDiemTotal: acc.perDiemTotal + curr.perDiem,
  }), { hours: 0, dayRateTotal: 0, mileageTotal: 0, perDiemTotal: 0 });

  const grandTotal = totals.dayRateTotal + totals.mileageTotal + totals.perDiemTotal;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-8 space-y-10">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl text-xs font-bold text-white ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} animate-in fade-in`}>
          {toast.message}
        </div>
      )}

      {/* Subscription Tiering Section */}
      <section className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <CreditCard className="w-3.5 h-3.5" /> STRIPE BILLING & SUBSCRIPTIONS
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Commercial Subscription Plans</h2>
            <p className="text-slate-400 text-xs mt-1">Metered GIS parcel exports, automated title runsheets, and enterprise underwriting.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            <Shield className="w-4 h-4 text-emerald-400" /> 256-Bit Encrypted Payments via Stripe
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter Plan */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <h3 className="font-bold text-white text-base">Land Investor Starter</h3>
              <p className="text-xs text-slate-400 mt-1">Essential toolkit for independent landmen & investors.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white">$99</span>
                <span className="text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Access to all 81 workspace modules</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 250 GIS parcel exports / month</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automated MAO underwriting</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> AI Co-Pilot (GPT-4o engine)</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribe('STARTER')}
              disabled={isSubscribing}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              Select Starter
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900/90 border-2 border-emerald-500 rounded-xl p-6 flex flex-col justify-between shadow-xl shadow-emerald-500/5 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
              Most Popular
            </span>
            <div>
              <h3 className="font-bold text-white text-base">Commercial Broker Pro</h3>
              <p className="text-xs text-slate-400 mt-1">High-volume parcel intelligence and verified comps.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white">$299</span>
                <span className="text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 1,500 GIS parcel exports / month</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> County Assessor certified roll drilldowns</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Deed book & page comp verification</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Outbound LOI Email & SMS dispatch</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribe('PRO')}
              disabled={isSubscribing}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
            >
              Upgrade to Pro (Active Plan)
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <h3 className="font-bold text-white text-base">Developer & Energy Enterprise</h3>
              <p className="text-xs text-slate-400 mt-1">Full-scale title chain runsheets & infrastructure GIS.</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-white">$899</span>
                <span className="text-slate-400 text-xs"> / month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 10,000 GIS parcel exports / month</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Automated County GIS REST Scrapers</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Surface & mineral run sheet automation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Substation & 345kV transmission proximity</li>
              </ul>
            </div>
            <button
              onClick={() => handleSubscribe('ENTERPRISE')}
              disabled={isSubscribing}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* Landman Hours & Invoicing Table */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Receipt className="text-fuchsia-500" />
              Landman Billing & Invoicing
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">Track field hours, travel mileage, per diem, and generate client invoices.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsInvoiceModalOpen(true)}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FileText size={20} />
              Generate Invoice
            </button>
            <button 
              onClick={() => setIsEntryModalOpen(true)}
              className="flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add Entry
            </button>
          </div>
        </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search landman or project..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-fuchsia-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Landman</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4 text-right">Hours</th>
                <th className="px-6 py-4 text-right">Rate</th>
                <th className="px-6 py-4 text-right">Mileage</th>
                <th className="px-6 py-4 text-right">Per Diem</th>
                <th className="px-6 py-4 text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredEntries.map((entry) => {
                const dailyTotal = (entry.hours * entry.rate) + (entry.mileage * mileageRate) + entry.perDiem;
                return (
                  <tr key={entry.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-fuchsia-400">{entry.landman}</td>
                    <td className="px-6 py-4 text-slate-300">{entry.date}</td>
                    <td className="px-6 py-4 text-slate-300">{entry.project}</td>
                    <td className="px-6 py-4 text-right">{entry.hours}</td>
                    <td className="px-6 py-4 text-right">${entry.rate}</td>
                    <td className="px-6 py-4 text-right">{entry.mileage} mi</td>
                    <td className="px-6 py-4 text-right">${entry.perDiem}</td>
                    <td className="px-6 py-4 text-right font-medium text-white">${dailyTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 border-t-2 border-slate-600 font-semibold">
                <td colSpan={3} className="px-6 py-4 text-right text-slate-400 uppercase text-xs tracking-wider">Totals</td>
                <td className="px-6 py-4 text-right text-white">{totals.hours}</td>
                <td className="px-6 py-4 text-right text-white">${totals.dayRateTotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-white">${totals.mileageTotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-white">${totals.perDiemTotal.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-fuchsia-400 text-lg">${grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      </section>

      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add Time Entry</h2>
              <button onClick={() => setIsEntryModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Landman</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Project</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none">
                  <option>Permian Alpha</option>
                  <option>Eagle Ford Extension</option>
                  <option>Bakken Infill</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Hours</label>
                  <input type="number" step="0.5" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Hourly Rate ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Mileage (Miles)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" defaultValue="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Per Diem ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-fuchsia-500 focus:outline-none" defaultValue="0" />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700">Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-8">
            <div className="flex justify-between items-start mb-8 border-b border-slate-700 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">INVOICE</h2>
                <p className="text-slate-400">Date: {new Date().toLocaleDateString()}</p>
                <p className="text-slate-400">Invoice #: INV-2024-001</p>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6 mb-8">
              <div className="flex justify-between text-sm">
                <div>
                  <div className="font-bold text-slate-300">Bill To:</div>
                  <div className="text-slate-400">ExxonMobil<br/>123 Energy Way<br/>Houston, TX 77002</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-300">Project:</div>
                  <div className="text-slate-400">Permian Alpha</div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">Professional Services ({totals.hours} hrs)</span>
                  <span>${totals.dayRateTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400">Mileage Expense</span>
                  <span>${totals.mileageTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Per Diem</span>
                  <span>${totals.perDiemTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-4 font-bold text-lg text-fuchsia-400">
                  <span>Total Amount Due</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
              <button onClick={() => { setIsInvoiceModalOpen(false); showToast('Invoice generated and sent to client!'); }} className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700">Send Invoice</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        } text-white animate-fade-in-up`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
