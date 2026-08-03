'use client';

import React, { useState } from 'react';
import { Plus, FileText, ChevronRight, X, PenTool } from 'lucide-react';

interface Offer {
  id: string;
  apn: string;
  seller: string;
  amount: number;
  scenario: 'Cash' | 'Owner Finance';
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected' | 'Countered';
  date: string;
}

const mockOffers: Offer[] = [
  { id: '1', apn: '045-123-45', seller: 'John Smith', amount: 3500, scenario: 'Cash', status: 'Accepted', date: '2023-10-25' },
  { id: '2', apn: '102-44-091', seller: 'Sarah Johnson', amount: 8000, scenario: 'Owner Finance', status: 'Sent', date: '2023-10-26' },
  { id: '3', apn: '59-002-11', seller: 'Robert Davis', amount: 15000, scenario: 'Cash', status: 'Countered', date: '2023-10-27' },
  { id: '4', apn: '88-101-02', seller: 'Mary Wilson', amount: 1200, scenario: 'Cash', status: 'Draft', date: '2023-10-28' },
  { id: '5', apn: '303-91-88', seller: 'James Brown', amount: 6500, scenario: 'Owner Finance', status: 'Rejected', date: '2023-10-20' },
];

export default function OffersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Countered': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const handleFinishWizard = () => {
    setIsModalOpen(false);
    setStep(1);
    showToast('Offer Created and Sent for eSign!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-400">Offers Management</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Offer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Active Offers</h3>
            <p className="text-2xl font-semibold">12</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Acceptance Rate</h3>
            <p className="text-2xl font-semibold">18%</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Total Volume Sent</h3>
            <p className="text-2xl font-semibold">$345,000</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Property APN</th>
                <th className="px-4 py-3">Seller</th>
                <th className="px-4 py-3">Offer Amount</th>
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockOffers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-4 font-mono">{offer.apn}</td>
                  <td className="px-4 py-4">{offer.seller}</td>
                  <td className="px-4 py-4 font-semibold text-orange-400">${offer.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-slate-300">{offer.scenario}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(offer.status)}`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-400">{offer.date}</td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => showToast(`Viewing Offer ${offer.id}`)} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Create Offer Wizard</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex mb-8 border-b border-slate-700 pb-4">
              <div className={`flex-1 text-center text-sm ${step >= 1 ? 'text-orange-400' : 'text-slate-500'}`}>1. Property</div>
              <div className={`flex-1 text-center text-sm ${step >= 2 ? 'text-orange-400' : 'text-slate-500'}`}>2. Terms</div>
              <div className={`flex-1 text-center text-sm ${step >= 3 ? 'text-orange-400' : 'text-slate-500'}`}>3. eSign Setup</div>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Select Property / APN</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none">
                    <option>045-123-45 - Costilla, CO</option>
                    <option>102-44-091 - Mohave, AZ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Seller Name</label>
                  <input type="text" defaultValue="John Smith" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => setStep(2)} className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded transition-colors">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Offer Amount ($)</label>
                    <input type="number" defaultValue="3500" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Scenario</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none">
                      <option>Cash</option>
                      <option>Owner Finance</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Closing Date (Est)</label>
                  <input type="date" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Special Terms</label>
                  <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none" placeholder="Buyer pays all closing costs..." />
                </div>
                <div className="flex justify-between mt-6">
                  <button onClick={() => setStep(1)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Back</button>
                  <button onClick={() => setStep(3)} className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded transition-colors">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-slate-900 p-4 rounded border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-200">Standard Purchase Agreement.pdf</h4>
                    <p className="text-xs text-slate-400">Variables merged successfully</p>
                  </div>
                  <FileText className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Signer Email</label>
                  <input type="email" defaultValue="seller@example.com" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="flex justify-between mt-8">
                  <button onClick={() => setStep(2)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Back</button>
                  <button onClick={handleFinishWizard} className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors">
                    <PenTool className="w-4 h-4 mr-2" />
                    Send for eSign
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded shadow-lg">
          {toast.message}
        </div>
      )}
    </div>
  );
}
