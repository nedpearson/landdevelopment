"use client";

import React, { useEffect, useState } from "react";
import { X, ChevronLeft, Map, FileText, User, FileKey, Layers } from "lucide-react";
import { useDrilldown, EntityType } from "../providers/DrilldownProvider";
import { ExecutiveSummary } from "../ai/ExecutiveSummary";
import { DiligenceGaps } from "./DiligenceGaps";
import { PropertyReport } from "../gis/PropertyReport";

import { PropertyHealthBadge } from "./PropertyHealthBadge";
import { NextBestAction } from "./NextBestAction";
import { PropertyTimeline } from "./PropertyTimeline";
import { DecisionSimulator } from "./DecisionSimulator";

import type { Property } from "@land-intelligence/database";
import { getPropertyById } from "@/actions/propertyActions";

const ICONS: Record<EntityType, React.ReactNode> = {
  PROPERTY: <Map className="w-5 h-5 text-emerald-400" />,
  OWNER: <User className="w-5 h-5 text-sky-400" />,
  LEASE: <FileText className="w-5 h-5 text-amber-400" />,
  TRACT: <Layers className="w-5 h-5 text-purple-400" />,
  DOCUMENT: <FileKey className="w-5 h-5 text-rose-400" />
};

export function UniversalDrilldown() {
  const { stack, push, pop, clear } = useDrilldown();
  const [isOpen, setIsOpen] = useState(false);
  const [propertyData, setPropertyData] = useState<Property | null>(null);

  const currentEntity = stack.length > 0 ? stack[stack.length - 1] : null;

  useEffect(() => {
    if (stack.length > 0) {
      setIsOpen(true);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
      
      if (currentEntity?.type === "PROPERTY") {
        getPropertyById(currentEntity.id).then(data => {
          setPropertyData(data);
        });
      }
    } else {
      setIsOpen(false);
      document.body.style.overflow = "auto";
      setPropertyData(null);
    }
  }, [stack.length, currentEntity]);

  if (stack.length === 0 || !currentEntity) return null;

  const hasHistory = stack.length > 1;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={clear}
      />

      {/* Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 z-[101] w-full max-w-4xl bg-slate-950 shadow-2xl border-l border-slate-800 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 gap-4">
          <div className="flex items-center gap-3">
            {hasHistory && (
              <button onClick={pop} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                {ICONS[currentEntity.type]}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium tracking-wider uppercase">{currentEntity.type}</div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-white leading-tight">{currentEntity.label}</h2>
                  {currentEntity.type === "PROPERTY" && (
                    <PropertyHealthBadge entityId={currentEntity.id} propertyData={propertyData} />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {currentEntity.type === "PROPERTY" && propertyData && (
              <div className="flex items-center gap-4 border-r border-slate-800 pr-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Deal Score</div>
                  <div className="text-lg font-black text-emerald-400">{propertyData.dealScore || 50}/100</div>
                </div>
                
                <button 
                  className="flex items-center px-3 py-1.5 rounded-md gap-2 text-indigo-400 border border-indigo-900/30 hover:bg-indigo-950 transition-colors"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/documents', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          apn: propertyData.apn,
                          acreage: propertyData.acreage,
                          county: propertyData.county,
                          state: propertyData.state,
                          price: propertyData.askingPrice,
                          sellerName: 'Land Owner'
                        })
                      });
                      if (!response.ok) throw new Error('Generation failed');
                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `contract_${propertyData.apn || 'draft'}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (err) {
                      console.error(err);
                      alert('Failed to generate contract');
                    }
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Draft Contract
                </button>
              </div>
            )}
            <div className="text-xs text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 hidden sm:block">
              ID: {currentEntity.id.slice(0, 8)}...
            </div>
            <button onClick={clear} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* AI Executive Summary Injection */}
          <ExecutiveSummary entityId={currentEntity.id} entityType={currentEntity.type} />

          {/* Phase 3.2: Next Best Action Engine */}
          <NextBestAction entityId={currentEntity.id} entityType={currentEntity.type} propertyData={propertyData} />
          
          {/* What Am I Missing? Rule Engine */}
          <DiligenceGaps entityId={currentEntity.id} entityType={currentEntity.type} propertyData={propertyData} />

          {/* Conditional Content based on Entity Type */}
          {currentEntity.type === "PROPERTY" && (
            <>
              {/* Omni-Asset Decision Simulator */}
              <DecisionSimulator propertyData={propertyData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col gap-6">
                  <PropertyReport />
                </div>
                <div>
                  <PropertyTimeline />
                </div>
              </div>
            </>
          )}

          {currentEntity.type === "OWNER" && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Ownership Portfolio</h3>
              <p className="text-slate-400 text-sm">Owner details, related LLCs, and transaction history will render here.</p>
            </div>
          )}
          
          {/* Example of linking further down the rabbit hole */}
          <div className="border-t border-slate-800 pt-6 mt-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-3">Related Entities (Click to Drilldown)</h4>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => push({ id: "owner-789", type: "OWNER", label: "John Doe LLC" })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-sky-400" />
                John Doe LLC
              </button>
              <button 
                onClick={() => push({ id: "lease-456", type: "LEASE", label: "Oil & Gas Lease 2023" })}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-sm transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                Oil & Gas Lease 2023
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
