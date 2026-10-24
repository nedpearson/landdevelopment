'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  User, 
  FileText, 
  Briefcase, 
  X, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  DollarSign
} from 'lucide-react';
import { getAllProperties } from '@/actions/propertyActions';
import { getCanonicalOwners, getCanonicalDeals } from '@/actions/canonicalActions';

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  useEffect(() => {
    async function load() {
      const [pData, oData, dData] = await Promise.all([
        getAllProperties(),
        getCanonicalOwners(),
        getCanonicalDeals(),
      ]);
      setProperties(pData);
      setOwners(oData);
      setDeals(dData);
    }
    load();
  }, []);

  const q = query.toLowerCase();

  const filteredProperties = properties.filter(p => 
    !q || 
    p.apn.toLowerCase().includes(q) || 
    p.county.toLowerCase().includes(q) || 
    p.state.toLowerCase().includes(q) || 
    (p.ownerName && p.ownerName.toLowerCase().includes(q))
  );

  const filteredOwners = owners.filter(o =>
    !q ||
    o.name.toLowerCase().includes(q) ||
    o.jurisdiction.toLowerCase().includes(q)
  );

  const filteredDeals = deals.filter(d =>
    !q ||
    d.apn.toLowerCase().includes(q) ||
    d.county.toLowerCase().includes(q) ||
    d.stage.toLowerCase().includes(q)
  );

  const hasResults = filteredProperties.length > 0 || filteredOwners.length > 0 || filteredDeals.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col h-screen overflow-hidden font-sans">
      <div className="p-6 pb-2 shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-500" />
            Universal Search & Canonical Index
          </h1>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            POSTGRESQL REAL-TIME
          </span>
        </div>
        
        <div className="relative max-w-3xl">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search APN, County, State, Owner entity, or Stage across the system..." 
            className="w-full bg-slate-900 border-2 border-slate-700/80 rounded-2xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors shadow-2xl"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 pt-4 gap-6">
        {/* Results Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          {!hasResults && query && (
            <div className="text-center text-slate-400 py-12 bg-slate-900/50 rounded-2xl border border-slate-800">
              No canonical records matching "{query}"
            </div>
          )}

          {/* Properties Section */}
          {filteredProperties.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" /> Canonical Properties ({filteredProperties.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProperties.map(prop => (
                  <div 
                    key={prop.id} 
                    onClick={() => setSelectedResult({ ...prop, type: 'PROPERTY' })}
                    className={`bg-slate-900 border ${selectedResult?.id === prop.id ? 'border-emerald-500 ring-1 ring-emerald-500/40' : 'border-slate-800'} p-4 rounded-xl hover:border-emerald-500/50 cursor-pointer transition-all shadow-md`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-mono font-bold text-white text-base">{prop.apn}</h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {prop.lifecycleStage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{prop.county} County, {prop.state} • Owner: {prop.ownerName}</div>
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-200">{prop.acreage?.toFixed(1)} AC</span>
                      <span className="font-bold text-emerald-400">
                        {prop.estimatedMarketValue ? `$${prop.estimatedMarketValue.toLocaleString()}` : 'Underwriting'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Owners Section */}
          {filteredOwners.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-400" /> Landowners & Sellers ({filteredOwners.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredOwners.map(owner => (
                  <div 
                    key={owner.id} 
                    onClick={() => setSelectedResult({ ...owner, type: 'OWNER' })}
                    className={`bg-slate-900 border ${selectedResult?.id === owner.id ? 'border-emerald-500' : 'border-slate-800'} p-4 rounded-xl hover:border-indigo-400 cursor-pointer transition-colors shadow-md`}
                  >
                    <div className="font-bold text-white text-base mb-1">{owner.name}</div>
                    <div className="text-xs text-slate-400 mb-2">{owner.jurisdiction} • {owner.propertiesCount} Parcels Owned</div>
                    <div className="text-[11px] font-mono text-emerald-400">{owner.email}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Deals Section */}
          {filteredDeals.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-400" /> Pipeline Deals ({filteredDeals.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDeals.map(deal => (
                  <div 
                    key={deal.id} 
                    onClick={() => setSelectedResult({ ...deal, type: 'DEAL' })}
                    className={`bg-slate-900 border ${selectedResult?.id === deal.id ? 'border-emerald-500' : 'border-slate-800'} p-4 rounded-xl hover:border-amber-400 cursor-pointer transition-colors shadow-md`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-bold text-white text-sm">{deal.title}</div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                        {deal.stage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{deal.county}, {deal.state} • Score: {deal.dealScore}/100</div>
                    <div className="mt-2 text-xs font-bold text-emerald-400">${deal.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Selected Result Drilldown Panel */}
        {selectedResult && (
          <aside className="w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl p-5 shrink-0 flex flex-col justify-between shadow-2xl h-fit animate-in slide-in-from-right-4">
            <div>
              <div className="flex justify-between items-start mb-4 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                    {selectedResult.type} RECORD
                  </span>
                  <h3 className="font-bold text-white text-base font-mono mt-0.5">
                    {selectedResult.apn || selectedResult.name || selectedResult.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jurisdiction</span>
                    <span className="text-white font-medium">{selectedResult.county || selectedResult.jurisdiction}, {selectedResult.state}</span>
                  </div>
                  {selectedResult.acreage && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Acreage</span>
                      <span className="text-white font-bold">{selectedResult.acreage} AC</span>
                    </div>
                  )}
                  {selectedResult.estimatedMarketValue && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Market Value</span>
                      <span className="text-emerald-400 font-bold">${selectedResult.estimatedMarketValue.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/40 text-[11px] text-slate-400 space-y-1">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Canonical PostgreSQL Source of Truth
                  </span>
                  <div>Record ID: <span className="font-mono text-slate-300">{selectedResult.id}</span></div>
                </div>
              </div>
            </div>

            <div>
              {selectedResult.type === 'PROPERTY' && (
                <Link
                  href={`/properties/${selectedResult.id}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  Open Complete Property Profile <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {selectedResult.type === 'OWNER' && (
                <Link
                  href="/owners"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  Open Owner Registry <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              {selectedResult.type === 'DEAL' && (
                <Link
                  href={`/properties/${selectedResult.propertyId || selectedResult.id}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
                >
                  Inspect Deal Profile <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
