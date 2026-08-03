'use client';

import React, { useState } from 'react';
import { Plus, Search, Download, CheckCircle, X } from 'lucide-react';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  budgetRange: string;
  preferredArea: string;
  verified: boolean;
  lastActivity: string;
}

const mockBuyers: Buyer[] = [
  { id: '1', name: 'Acme Land Trust', email: 'acquisitions@acme.com', phone: '(555) 111-2222', budgetRange: '$100k - $500k', preferredArea: 'Texas (Any)', verified: true, lastActivity: '2 days ago' },
  { id: '2', name: 'Mike Tyson', email: 'mike@tysonland.net', phone: '(555) 333-4444', budgetRange: '$10k - $50k', preferredArea: 'Costilla, CO', verified: true, lastActivity: '1 week ago' },
  { id: '3', name: 'Sarah Connor', email: 'sconnor@gmail.com', phone: '(555) 555-6666', budgetRange: '$5k - $20k', preferredArea: 'Mohave, AZ', verified: false, lastActivity: '3 weeks ago' },
  { id: '4', name: 'Investco Partners', email: 'deals@investco.io', phone: '(555) 777-8888', budgetRange: '$500k+', preferredArea: 'Florida, North Carolina', verified: true, lastActivity: '1 day ago' },
  { id: '5', name: 'David Lee', email: 'dlee88@yahoo.com', phone: '(555) 999-0000', budgetRange: '$20k - $80k', preferredArea: 'Elko, NV', verified: false, lastActivity: '1 month ago' },
];

export default function BuyersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleExport = () => {
    showToast('Exporting CSV...');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-lime-400">Buyer Database</h1>
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              className="flex items-center px-4 py-2 border border-slate-600 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white rounded-md transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Buyer
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-3" />
            <input 
              type="text" 
              placeholder="Filter buyers..."
              className="bg-transparent border-none outline-none w-full text-white"
            />
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Budget Range</th>
                <th className="px-4 py-3">Preferred Area</th>
                <th className="px-4 py-3">Verified</th>
                <th className="px-4 py-3">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockBuyers.map((buyer) => (
                <tr key={buyer.id} className="hover:bg-slate-700/50 cursor-pointer transition-colors" onClick={() => setSelectedBuyer(buyer)}>
                  <td className="px-4 py-4 font-medium">{buyer.name}</td>
                  <td className="px-4 py-4 text-slate-300">
                    <div>{buyer.email}</div>
                    <div className="text-xs text-slate-500">{buyer.phone}</div>
                  </td>
                  <td className="px-4 py-4">{buyer.budgetRange}</td>
                  <td className="px-4 py-4">{buyer.preferredArea}</td>
                  <td className="px-4 py-4">
                    {buyer.verified ? <CheckCircle className="w-5 h-5 text-lime-500" /> : <span className="text-slate-500">-</span>}
                  </td>
                  <td className="px-4 py-4 text-slate-400">{buyer.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add VIP Buyer</h2>
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); showToast('Buyer Profile Created!'); }} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Company / Name</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-lime-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input required type="email" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-lime-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone</label>
                  <input type="tel" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-lime-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Budget Range</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-lime-500 outline-none">
                    <option>$0 - $10k</option>
                    <option>$10k - $50k</option>
                    <option>$50k - $100k</option>
                    <option>$100k+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Preferred State/County</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-lime-500 outline-none" />
                </div>
              </div>
              <div className="flex items-center mt-4">
                <input type="checkbox" id="verified" className="mr-2 accent-lime-500" />
                <label htmlFor="verified" className="text-sm text-slate-300">Mark as Verified Cash Buyer</label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-lime-600 hover:bg-lime-500 text-white rounded transition-colors">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedBuyer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Buyer Details</h2>
            <button onClick={() => setSelectedBuyer(null)} className="p-1 hover:bg-slate-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">{selectedBuyer.name}</h3>
                {selectedBuyer.verified && <CheckCircle className="w-4 h-4 text-lime-500" />}
              </div>
              <p className="text-slate-400">{selectedBuyer.email}</p>
              <p className="text-slate-400">{selectedBuyer.phone}</p>
            </div>

            <div className="bg-slate-900 p-4 rounded border border-slate-700 space-y-3">
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Buying Criteria</div>
                <div className="mt-1">{selectedBuyer.preferredArea}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-semibold">Budget</div>
                <div className="mt-1 font-mono text-lime-400">{selectedBuyer.budgetRange}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Matching Inventory (2)</h4>
              <div className="space-y-2">
                <div className="bg-slate-900 p-3 rounded border border-slate-700 hover:border-lime-500 cursor-pointer transition-colors" onClick={() => showToast('Sending Property via Email...')}>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">APN: 045-123-45</span>
                    <button className="text-xs text-lime-400 hover:underline">Send</button>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Costilla, CO • 5.0 ac</div>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-700 hover:border-lime-500 cursor-pointer transition-colors" onClick={() => showToast('Sending Property via Email...')}>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">APN: 77-11-002</span>
                    <button className="text-xs text-lime-400 hover:underline">Send</button>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Costilla, CO • 10.0 ac</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded shadow-lg flex items-center">
          <CheckCircle className="w-4 h-4 text-lime-500 mr-2" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
