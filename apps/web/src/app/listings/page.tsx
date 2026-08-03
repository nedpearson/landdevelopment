'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Grid, List, Building2, MapPin, DollarSign, Activity, Maximize2, X, AlertCircle, Copy, Check } from 'lucide-react';

type ListingStatus = 'Active' | 'Under Contract' | 'Sold';

interface Listing {
  id: string;
  address: string;
  type: string;
  sf: number;
  price: number;
  capRate: number;
  status: ListingStatus;
  dateAdded: string;
  image: string;
}

const MOCK_LISTINGS: Listing[] = [
  { id: '1', address: '1200 Commerce Blvd, Suite 100', type: 'Office', sf: 15000, price: 3500000, capRate: 6.5, status: 'Active', dateAdded: '2023-10-15', image: 'bg-slate-700' },
  { id: '2', address: '850 Industrial Pkwy', type: 'Industrial', sf: 45000, price: 5200000, capRate: 7.2, status: 'Active', dateAdded: '2023-11-02', image: 'bg-slate-700' },
  { id: '3', address: '400 Main St Retail Center', type: 'Retail', sf: 8500, price: 2100000, capRate: 5.8, status: 'Under Contract', dateAdded: '2023-09-20', image: 'bg-slate-700' },
  { id: '4', address: '9900 Medical Plaza', type: 'Medical Office', sf: 12000, price: 4100000, capRate: 6.0, status: 'Active', dateAdded: '2023-11-10', image: 'bg-slate-700' },
  { id: '5', address: '250 Warehouse Way', type: 'Industrial', sf: 120000, price: 12500000, capRate: 7.8, status: 'Sold', dateAdded: '2023-05-14', image: 'bg-slate-700' },
  { id: '6', address: '77 Downtown Highrise', type: 'Office', sf: 25000, price: 8900000, capRate: 5.5, status: 'Active', dateAdded: '2023-12-01', image: 'bg-slate-700' }
];

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [sortBy, setSortBy] = useState<'price' | 'sf' | 'date'>('date');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const filteredListings = listings
    .filter(l => l.address.toLowerCase().includes(search.toLowerCase()) || l.type.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'sf') return b.sf - a.sf;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

  const StatusBadge = ({ status }: { status: ListingStatus }) => {
    const styles = {
      'Active': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'Under Contract': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      'Sold': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="text-emerald-500" />
            Commercial Listings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage and track your active, under contract, and sold properties.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Listing
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search listings by address or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="date">Sort by Date</option>
            <option value="price">Sort by Price</option>
            <option value="sf">Sort by Sq Ft</option>
          </select>
          
          <div className="flex bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-slate-700 text-emerald-400' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredListings.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No listings found</h3>
          <p className="text-slate-400 text-sm">Try adjusting your search criteria or add a new listing.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className={`h-48 w-full ${listing.image} relative`}>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={listing.status} />
                </div>
                {/* Placeholder for actual image */}
                <div className="w-full h-full flex items-center justify-center opacity-30">
                  <Building2 className="w-12 h-12 text-slate-400" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-white truncate pr-4 cursor-pointer hover:text-emerald-400" onClick={() => handleCopy(listing.address)}>
                    {listing.address}
                  </h3>
                </div>
                <div className="text-sm text-slate-400 mb-4">{listing.type}</div>
                
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Price</div>
                    <div className="font-semibold text-slate-200">{formatCurrency(listing.price)}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Maximize2 className="w-3 h-3"/> Size</div>
                    <div className="font-semibold text-slate-200">{formatNumber(listing.sf)} SF</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> Cap Rate</div>
                    <div className="font-semibold text-slate-200">{listing.capRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Added</div>
                    <div className="font-semibold text-slate-200">{new Date(listing.dateAdded).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-end">
                  <button onClick={() => showToast(`Viewing details for ${listing.address}`)} className="text-sm text-emerald-400 hover:text-emerald-300 font-medium">View Details &rarr;</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Address</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Size (SF)</th>
                <th className="px-4 py-3 font-medium">Cap Rate</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredListings.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                    <div className={`w-8 h-8 rounded bg-slate-700 flex items-center justify-center shrink-0`}>
                       <Building2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="truncate cursor-pointer hover:text-emerald-400" onClick={() => handleCopy(listing.address)}>{listing.address}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{listing.type}</td>
                  <td className="px-4 py-3 text-slate-300">{formatCurrency(listing.price)}</td>
                  <td className="px-4 py-3 text-slate-300">{formatNumber(listing.sf)}</td>
                  <td className="px-4 py-3 text-slate-300">{listing.capRate.toFixed(1)}%</td>
                  <td className="px-4 py-3"><StatusBadge status={listing.status} /></td>
                  <td className="px-4 py-3 text-right">
                     <button onClick={() => showToast(`Viewing details for ${listing.address}`)} className="text-emerald-400 hover:text-emerald-300 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add New Listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); showToast('Listing added successfully'); setIsModalOpen(false); }}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="123 Main St" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Property Type</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                      <option>Office</option>
                      <option>Industrial</option>
                      <option>Retail</option>
                      <option>Medical Office</option>
                      <option>Multifamily</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                      <option>Active</option>
                      <option>Under Contract</option>
                      <option>Sold</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Asking Price ($)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Size (Sq Ft)</label>
                    <input required type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Cap Rate (%)</label>
                    <input type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="0.0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date Added</label>
                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Save Listing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
