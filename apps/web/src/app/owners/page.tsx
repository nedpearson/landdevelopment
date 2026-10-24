'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Plus, 
  Search, 
  Building, 
  User, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { getCanonicalOwners } from '@/actions/canonicalActions';
import { createSeller } from '@/actions/sellerActions';

export default function OwnersDatabase() {
  const [owners, setOwners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getCanonicalOwners();
      setOwners(data);
    }
    load();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateOwner = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get('name') as string;
    const email = form.get('email') as string;
    const phone = form.get('phone') as string;

    const result = await createSeller({
      name,
      email,
      phone,
      motivationLevel: 'MEDIUM',
    });

    if (result.success) {
      showToast('Landowner record created in database!', 'success');
      setIsModalOpen(false);
      const updated = await getCanonicalOwners();
      setOwners(updated);
    } else {
      showToast((result as any).error || 'Failed to save owner', 'error');
    }
  };

  const filteredOwners = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.jurisdiction.toLowerCase().includes(search.toLowerCase()) ||
    o.properties.some((p: any) => p.apn.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
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
              <Database className="w-6 h-6 text-emerald-500" />
              Verified Landowner Registry
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              POSTGRESQL SOURCE OF TRUTH
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Authoritative property owners, deed record references, and linked parcel holdings.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Owner
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 mb-6 flex justify-between items-center">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by owner name, county, state, or owned APN..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500" 
          />
        </div>
        <div className="text-xs text-slate-400">
          Tracking <span className="text-white font-bold">{filteredOwners.length}</span> verified landholder entities
        </div>
      </div>

      {/* Owners Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
              <th className="p-4 font-semibold">Owner / Entity</th>
              <th className="p-4 font-semibold">Contact Information</th>
              <th className="p-4 font-semibold">Associated Parcels</th>
              <th className="p-4 font-semibold">Total Acreage</th>
              <th className="p-4 font-semibold">Jurisdiction</th>
              <th className="p-4 font-semibold text-right">Drilldown Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredOwners.map(owner => (
              <tr 
                key={owner.id} 
                className="hover:bg-slate-800/40 transition-colors"
              >
                <td className="p-4 font-medium text-white flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{owner.name}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Certified Deed Owner
                    </span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  <div>{owner.phone}</div>
                  <div className="text-[11px] text-slate-500 font-mono">{owner.email}</div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {owner.properties.map((p: any) => (
                      <Link
                        key={p.id}
                        href={`/properties/${p.id}`}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:underline border border-slate-700 text-[10px] font-mono font-bold"
                        title={`Click to open APN ${p.apn}`}
                      >
                        {p.apn}
                      </Link>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-semibold text-slate-200">
                  {owner.totalAcreage.toFixed(1)} Gross Acres
                </td>
                <td className="p-4 text-slate-300 font-medium">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-500" />
                  {owner.jurisdiction}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedOwner(owner)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Holdings
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Holdings Modal */}
      {selectedOwner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 text-xs">
            <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400">Landowner Holdings Profile</span>
                <h2 className="text-lg font-bold text-white">{selectedOwner.name}</h2>
              </div>
              <button onClick={() => setSelectedOwner(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-slate-400">
                Verified portfolio of <span className="text-white font-bold">{selectedOwner.properties.length} parcels</span> across {selectedOwner.jurisdiction}:
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {selectedOwner.properties.map((p: any) => (
                  <div key={p.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 flex justify-between items-center">
                    <div>
                      <div className="font-mono font-bold text-white text-sm">{p.apn}</div>
                      <div className="text-slate-400 text-[11px]">{p.acreage} AC • {p.county}, {p.state}</div>
                    </div>
                    <Link
                      href={`/properties/${p.id}`}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      Open Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOwner(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-900">
              <h2 className="text-base font-bold text-white">Add Certified Landowner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form className="p-6 space-y-4 text-xs" onSubmit={handleCreateOwner}>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Landowner / Entity Name</label>
                <input required name="name" type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Permian Mineral Partners LLC" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Contact Phone</label>
                  <input name="phone" type="text" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="(555) 234-5678" />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Contact Email</label>
                  <input name="email" type="email" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="landowner@contact.com" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md">
                  Save Landowner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
