'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Droplet, 
  Wifi, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  ExternalLink,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { getAllProperties } from '@/actions/propertyActions';

export default function UtilitiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getAllProperties();
        setProperties(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = properties.filter(p =>
    search === '' ||
    p.apn.toLowerCase().includes(search.toLowerCase()) ||
    p.county.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                <Zap className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Utility Infrastructure & Access Center</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Electric service distances, water rights, well permit status, septic feasibility, and broadband coverage
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* Search */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by APN, County, or State..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Utilities Cards */}
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-yellow-400" />
            <p className="text-sm">Loading parcel utility assessments...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((prop) => (
              <div 
                key={prop.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono font-bold text-white text-sm">
                        APN: {prop.apn}
                      </span>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {prop.county}, {prop.state} • {prop.acreage} AC
                      </div>
                    </div>

                    <Link 
                      href={`/properties/${prop.id}`}
                      className="text-slate-500 hover:text-yellow-400"
                      title="Open Profile"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-2 mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-yellow-400" /> Electric Grid:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {prop.utilityAssessment?.electricOnSite ? 'On-Site' : prop.utilityAssessment?.electricDistanceFeet ? `${prop.utilityAssessment.electricDistanceFeet} ft` : 'Power at Road'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-sky-400" /> Water Source:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {prop.utilityAssessment?.waterSource || 'Well Permit Eligible'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Sewer / Septic:
                      </span>
                      <span className="font-semibold text-slate-200">
                        {prop.utilityAssessment?.sewer || 'Septic Feasible'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Stage: <strong className="text-slate-200">{prop.lifecycleStage}</strong></span>
                  <Link href={`/properties/${prop.id}`} className="text-yellow-400 hover:underline">
                    View Full Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
