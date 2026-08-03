'use client';

import React, { useState } from 'react';
import { Plus, Search, X, User } from 'lucide-react';
import { createSeller } from '@/actions/sellerActions';

interface Seller {
  id: string;
  name: string;
  phone: string;
  email: string;
  properties: number;
  motivation: 'Low' | 'Med' | 'High' | 'Urgent';
  lastContact: string;
  status: string;
}

const mockSellers: Seller[] = [
  { id: '1', name: 'John Smith', phone: '(555) 123-4567', email: 'john@example.com', properties: 2, motivation: 'Med', lastContact: '2023-10-15', status: 'Active' },
  { id: '2', name: 'Sarah Johnson', phone: '(555) 987-6543', email: 'sarah.j@example.com', properties: 1, motivation: 'Urgent', lastContact: '2023-10-20', status: 'Negotiating' },
  { id: '3', name: 'Robert Davis', phone: '(555) 456-7890', email: 'rdavis88@example.com', properties: 5, motivation: 'Low', lastContact: '2023-09-01', status: 'Nurture' },
  { id: '4', name: 'Mary Wilson', phone: '(555) 234-5678', email: 'm.wilson@example.com', properties: 1, motivation: 'High', lastContact: '2023-10-18', status: 'Active' },
  { id: '5', name: 'James Brown', phone: '(555) 876-5432', email: 'jbrown@example.com', properties: 3, motivation: 'Med', lastContact: '2023-10-10', status: 'Closed' },
];

export default function SellersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSeller = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await createSeller({
      name: (formData.get('name') as string) || 'New Seller',
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      askingPrice: Number(formData.get('price')) || 0,
      motivationLevel: formData.get('motivation') as string || 'LOW'
    });
    setIsModalOpen(false);
    showToast(result.success ? 'Seller Added!' : 'Error adding seller');
  };

  const getMotivationColor = (level: string) => {
    switch (level) {
      case 'Urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Med': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sky-400">Seller CRM</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Seller
          </button>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex items-center">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Search sellers by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-white"
          />
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-white">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white">Properties</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white">Motivation</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white">Last Contact</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockSellers.filter(s => s.name.toLowerCase().includes(search.toLowerCase())).map((seller) => (
                <tr key={seller.id} className="hover:bg-slate-700/50 cursor-pointer transition-colors" onClick={() => setSelectedSeller(seller)}>
                  <td className="px-4 py-4 font-medium flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-3">
                      {seller.name.charAt(0)}
                    </div>
                    {seller.name}
                  </td>
                  <td className="px-4 py-4 text-slate-300">{seller.phone}</td>
                  <td className="px-4 py-4 text-slate-300">{seller.email}</td>
                  <td className="px-4 py-4">{seller.properties}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs border ${getMotivationColor(seller.motivation)}`}>
                      {seller.motivation}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{seller.lastContact}</td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs">{seller.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Add New Seller</h2>
            <form onSubmit={handleAddSeller} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input type="text" name="name" required className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Phone</label>
                  <input type="text" name="phone" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Email</label>
                  <input type="email" name="email" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Target Property / APN</label>
                <input type="text" name="property" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Asking Price ($)</label>
                  <input type="number" name="price" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Motivation Level</label>
                  <select name="motivation" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none">
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded transition-colors">Save Seller</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedSeller && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl p-6 z-50 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Seller Profile</h2>
            <button onClick={() => setSelectedSeller(null)} className="p-1 hover:bg-slate-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl">
              <User className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <div className="text-lg font-semibold">{selectedSeller.name}</div>
              <span className={`px-2 py-0.5 mt-1 inline-block rounded text-xs border ${getMotivationColor(selectedSeller.motivation)}`}>
                {selectedSeller.motivation} Motivation
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-900 p-3 rounded border border-slate-700">
              <div className="text-sm text-slate-400">Contact Info</div>
              <div className="mt-1">{selectedSeller.phone}</div>
              <div className="mt-1 text-sky-400">{selectedSeller.email}</div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Linked Properties ({selectedSeller.properties})</h3>
              <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm">
                <div className="flex justify-between py-1">
                  <span>APN: 123-456-78</span>
                  <span className="text-slate-400">Costilla, CO</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <div className="text-sm text-slate-400 space-y-2">
                <div className="flex justify-between"><span>Called left VM</span><span>{selectedSeller.lastContact}</span></div>
                <div className="flex justify-between"><span>Sent Offer Letter</span><span>2023-10-01</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg bg-sky-600`}>
          {toast}
        </div>
      )}
    </div>
  );
}
