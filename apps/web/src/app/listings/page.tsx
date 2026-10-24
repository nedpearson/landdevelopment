'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  Building2, 
  MapPin, 
  DollarSign, 
  Activity, 
  Maximize2, 
  X, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { getCanonicalListings } from '@/actions/canonicalActions';
import { createProperty } from '@/actions/propertyActions';
import { SourceProvenanceModal } from '@/components/common/SourceProvenance';

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [selectedProvenance, setSelectedProvenance] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<'price' | 'acreage' | 'date'>('date');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getCanonicalListings();
      setListings(data);
    }
    load();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const apn = form.get('apn') as string;
    const county = form.get('county') as string;
    const state = form.get('state') as string;
    const acreage = parseFloat(form.get('acreage') as string) || 10;
    const price = parseFloat(form.get('price') as string) || 50000;
    const ownerName = (form.get('ownerName') as string) || 'Private Owner';

    const result = await createProperty({
      apn,
      county,
      state,
      acreage,
      askingPrice: price,
      ownerName,
      lifecycleStage: 'LISTED',
      propertyClass: 'COMMERCIAL_RETAIL',
    });

    if (result.success) {
      showToast('Canonical property listing created successfully!', 'success');
      setIsModalOpen(false);
      const updated = await getCanonicalListings();
      setListings(updated);
    } else {
      showToast((result as any).error || 'Failed to create listing', 'error');
    }
  };

  const filteredListings = listings
    .filter(l => 
      l.address.toLowerCase().includes(search.toLowerCase()) || 
      l.apn.toLowerCase().includes(search.toLowerCase()) ||
      l.county.toLowerCase().includes(search.toLowerCase()) ||
      (l.ownerName && l.ownerName.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'acreage') return b.acreage - a.acreage;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2.5 rounded-xl shadow-2xl z-50 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white text-xs font-semibold animate-in fade-in`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Building2 className="text-emerald-500" />
              Commercial Broker Listings
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              POSTGRESQL GROUNDED
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Canonical properties in active brokerage, disposition, and investment stages.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add Listing
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search listings by APN, County, State, or Owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2">Sort:</span>
            <button 
              onClick={() => setSortBy('date')} 
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sortBy === 'date' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Recent
            </button>
            <button 
              onClick={() => setSortBy('price')} 
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sortBy === 'price' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Price
            </button>
            <button 
              onClick={() => setSortBy('acreage')} 
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${sortBy === 'acreage' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Acreage
            </button>
          </div>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button 
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg font-semibold ${viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-lg font-semibold ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div key={listing.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {listing.status}
                  </span>
                  <button
                    onClick={() => setSelectedProvenance(listing)}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Provenance
                  </button>
                </div>

                <div className="font-mono font-bold text-white text-base truncate mb-1">
                  APN: {listing.apn}
                </div>
                <div className="text-xs text-slate-400 mb-4">
                  {listing.county} County, {listing.state} • {listing.ownerName}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 mb-4">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Price</span>
                    <span className="font-bold text-emerald-400 text-sm">{formatCurrency(listing.price)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Acreage</span>
                    <span className="font-bold text-white text-sm">{listing.acreage} AC</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Cap Rate (Est.)</span>
                    <span className="font-bold text-slate-200">{listing.capRate}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Deal Score</span>
                    <span className="font-bold text-emerald-400">{listing.dealScore}/100</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center">
                <span className="text-[11px] text-slate-500">Added: {listing.dateAdded}</span>
                <Link 
                  href={`/properties/${listing.propertyId}`} 
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-semibold">APN / Location</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Acreage</th>
                <th className="px-4 py-3 font-semibold">Cap Rate</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Drilldown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredListings.map(listing => (
                <tr key={listing.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">
                    <div className="font-mono font-bold">{listing.apn}</div>
                    <div className="text-[11px] text-slate-400">{listing.county}, {listing.state}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{listing.ownerName}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold">{formatCurrency(listing.price)}</td>
                  <td className="px-4 py-3 text-slate-200">{listing.acreage} AC</td>
                  <td className="px-4 py-3 text-slate-300 font-semibold">{listing.capRate}%</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link 
                      href={`/properties/${listing.propertyId}`} 
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline"
                    >
                      Inspect Profile &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900">
              <h2 className="text-base font-bold text-white">Add Canonical Commercial Listing</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4 text-xs" onSubmit={handleCreateListing}>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Assessor Parcel Number (APN)</label>
                <input required name="apn" type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500" placeholder="e.g. 045-88-202" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">County</label>
                  <input required name="county" type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="Reeves" />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">State</label>
                  <input required name="state" type="text" maxLength={2} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white uppercase focus:outline-none focus:border-emerald-500" placeholder="TX" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Acreage</label>
                  <input required name="acreage" type="number" step="0.1" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="40.0" />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Listing / Asking Price ($)</label>
                  <input required name="price" type="number" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="150000" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Owner Name</label>
                <input required name="ownerName" type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Pecos Land & Minerals LLC" />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md">
                  Persist Listing to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedProvenance && (
        <SourceProvenanceModal
          isOpen={Boolean(selectedProvenance)}
          onClose={() => setSelectedProvenance(null)}
          property={selectedProvenance}
        />
      )}
    </div>
  );
}
