"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspace } from '@/components/providers/WorkspaceProvider';
import { getAllProperties } from '@/actions/propertyActions';
import { useDrilldown } from '@/components/providers/DrilldownProvider';
import { Search, Filter, Map as MapIcon, List, ArrowRight, Download, Plus, LayoutGrid, FileWarning, Target, CheckCircle2 } from 'lucide-react';
import { DiscoverMap } from '@/components/gis/DiscoverMap';

export function PropertiesIndex({ initialProperties }: { initialProperties: any[] }) {
  const { activeWorkspace } = useWorkspace();
  const { push } = useDrilldown();
  const [properties, setProperties] = useState(initialProperties);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = properties.filter(p => 
    (p.apn && p.apn.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.ownerName && p.ownerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.county && p.county.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <activeWorkspace.icon className={`w-6 h-6 ${activeWorkspace.themeColor}`} />
              Properties Index
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Viewing as {activeWorkspace.label}. {properties.length} total records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className={`px-4 py-2 ${activeWorkspace.themeColor.replace('text-', 'bg-').replace('400', '600')} hover:opacity-90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors`}>
              <Plus className="w-4 h-4" /> Add Property
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by APN, Owner, or County..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
            />
          </div>
          <div className="flex items-center bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button 
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${viewMode === 'map' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <MapIcon className="w-4 h-4" /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        {viewMode === "map" ? (
          <DiscoverMap />
        ) : (
          <div className="h-full overflow-auto p-6">
            {filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <FileWarning className="w-12 h-12 mb-4 opacity-50" />
                <p>No properties found matching your search.</p>
              </div>
            ) : (
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
                      <th className="p-4 font-semibold">APN / Location</th>
                      <th className="p-4 font-semibold">Size</th>
                      <th className="p-4 font-semibold">Status</th>
                      <th className="p-4 font-semibold">Owner</th>
                      {activeWorkspace.type === 'LAND_INVESTOR' && <th className="p-4 font-semibold">AI Match</th>}
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredProperties.map(property => (
                      <tr key={property.id} className="hover:bg-slate-800/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-medium text-white">{property.apn}</div>
                          <div className="text-xs text-slate-400 mt-1">{property.county}, {property.state}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-300">{property.acreage?.toFixed(2) || 'N/A'} Acres</div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                            {property.lifecycleStage?.replace(/_/g, ' ') || 'LEAD'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="text-slate-300">{property.ownerName || 'Unknown'}</div>
                        </td>
                        {activeWorkspace.type === 'LAND_INVESTOR' && (
                          <td className="p-4">
                            {property.acreage && property.acreage > 10 ? (
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                <Target className="w-3.5 h-3.5" /> High Match
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs">—</span>
                            )}
                          </td>
                        )}
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => push({ id: property.id, type: "PROPERTY", label: property.apn || property.id })}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-sm font-medium transition-colors opacity-0 group-hover:opacity-100"
                          >
                            Open <ArrowRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
