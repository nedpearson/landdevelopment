'use client';

import React, { useState } from 'react';
import { FileBarChart2, Plus, Download, Search, X, Check, ArrowUpDown } from 'lucide-react';

interface SalesComp {
  id: string;
  address: string;
  type: string;
  saleDate: string;
  price: number;
  sf: number;
  capRate: number;
  buyer: string;
  seller: string;
}

interface LeaseComp {
  id: string;
  address: string;
  tenant: string;
  sf: number;
  startDate: string;
  term: number; // months
  baseRent: number; // per sf / yr
  tiAllowance: number; // per sf
}

const MOCK_SALES: SalesComp[] = [
  { id: 's1', address: '1200 Commerce Blvd', type: 'Office', saleDate: '2023-11-15', price: 3500000, sf: 15000, capRate: 6.5, buyer: 'Apex Logistics', seller: 'Commerce Trust' },
  { id: 's2', address: '850 Industrial Pkwy', type: 'Industrial', saleDate: '2023-10-22', price: 5200000, sf: 45000, capRate: 7.2, buyer: 'TechNova', seller: 'Industrial REIT' },
  { id: 's3', address: '400 Main St Retail', type: 'Retail', saleDate: '2023-09-10', price: 2100000, sf: 8500, capRate: 5.8, buyer: 'Chang Holdings', seller: 'Local Investors' },
  { id: 's4', address: '9900 Medical Plaza', type: 'Medical', saleDate: '2023-08-05', price: 4100000, sf: 12000, capRate: 6.0, buyer: 'Torres Med Group', seller: 'HealthCore' },
  { id: 's5', address: '250 Warehouse Way', type: 'Industrial', saleDate: '2023-12-01', price: 12500000, sf: 120000, capRate: 7.8, buyer: 'Global Dist', seller: 'Family Office' },
];

const MOCK_LEASES: LeaseComp[] = [
  { id: 'l1', address: '500 Tech Park Dr', tenant: 'InnovateAI', sf: 5500, startDate: '2024-01-01', term: 60, baseRent: 35.50, tiAllowance: 25.00 },
  { id: 'l2', address: '100 Market Sq', tenant: 'Fresh Foods', sf: 12000, startDate: '2023-11-01', term: 120, baseRent: 28.00, tiAllowance: 40.00 },
  { id: 'l3', address: '300 Logistics Way', tenant: 'FastShip', sf: 50000, startDate: '2023-09-15', term: 84, baseRent: 12.50, tiAllowance: 10.00 },
  { id: 'l4', address: '77 Downtown Tower', tenant: 'Law Partners LLC', sf: 8500, startDate: '2023-12-01', term: 60, baseRent: 45.00, tiAllowance: 50.00 },
];

export default function CompsPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'leases'>('sales');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNum = (val: number) => new Intl.NumberFormat('en-US').format(val);

  const filteredSales = MOCK_SALES.filter(s => s.address.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()));
  const filteredLeases = MOCK_LEASES.filter(l => l.address.toLowerCase().includes(search.toLowerCase()) || l.tenant.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileBarChart2 className="text-sky-500" />
            Sales & Lease Comps
          </h1>
          <p className="text-slate-400 text-sm mt-1">Database of comparable transactions for market analysis.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => showToast('Exporting data as CSV...')} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Comp
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-800 pb-4">
        <div className="flex bg-slate-800/50 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'sales' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Sales Comps
          </button>
          <button 
            onClick={() => setActiveTab('leases')}
            className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'leases' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Lease Comps
          </button>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          {activeTab === 'sales' ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:text-white flex items-center gap-1">Address <ArrowUpDown className="w-3 h-3"/></th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:text-white">Sale Date</th>
                  <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-white">Price</th>
                  <th className="px-4 py-3 font-medium text-right">SF</th>
                  <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-white">$/SF</th>
                  <th className="px-4 py-3 font-medium text-right">Cap Rate</th>
                  <th className="px-4 py-3 font-medium">Buyer/Seller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredSales.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{comp.address}</td>
                    <td className="px-4 py-3 text-slate-300">{comp.type}</td>
                    <td className="px-4 py-3 text-slate-300">{new Date(comp.saleDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-300 text-right font-medium text-emerald-400/90">{formatCurrency(comp.price)}</td>
                    <td className="px-4 py-3 text-slate-300 text-right">{formatNum(comp.sf)}</td>
                    <td className="px-4 py-3 text-slate-300 text-right font-medium">{formatCurrency(comp.price / comp.sf)}</td>
                    <td className="px-4 py-3 text-slate-300 text-right">{comp.capRate}%</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div className="text-slate-300"><span className="text-slate-500">B:</span> {comp.buyer}</div>
                        <div className="text-slate-400"><span className="text-slate-500">S:</span> {comp.seller}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium cursor-pointer hover:text-white flex items-center gap-1">Address <ArrowUpDown className="w-3 h-3"/></th>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium text-right">SF</th>
                  <th className="px-4 py-3 font-medium">Start Date</th>
                  <th className="px-4 py-3 font-medium text-right">Term (Mo)</th>
                  <th className="px-4 py-3 font-medium text-right cursor-pointer hover:text-white">Base Rent/SF</th>
                  <th className="px-4 py-3 font-medium text-right">TI/SF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeases.map(comp => (
                  <tr key={comp.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{comp.address}</td>
                    <td className="px-4 py-3 text-slate-300">{comp.tenant}</td>
                    <td className="px-4 py-3 text-slate-300 text-right">{formatNum(comp.sf)}</td>
                    <td className="px-4 py-3 text-slate-300">{new Date(comp.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-300 text-right">{comp.term}</td>
                    <td className="px-4 py-3 text-slate-300 text-right font-medium text-emerald-400/90">{formatCurrency(comp.baseRent)}</td>
                    <td className="px-4 py-3 text-slate-300 text-right">{formatCurrency(comp.tiAllowance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add New Comp</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Comp added successfully'); setIsModalOpen(false); }}>
                <div className="flex gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="compType" value="sale" defaultChecked className="accent-sky-500" /> Sale
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input type="radio" name="compType" value="lease" className="accent-sky-500" /> Lease
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Size (SF)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Price / Rent ($)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Cap Rate / Term</label>
                    <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500" placeholder="0" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Comp</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-500">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
