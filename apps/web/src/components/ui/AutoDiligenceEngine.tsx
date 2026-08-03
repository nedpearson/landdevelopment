"use client";

import React, { useState } from 'react';
import { Map, ScanSearch, Droplets, MapPin, Trees, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { runAutoDiligence } from '@/actions/autoDiligenceActions';
import type { DiligenceAssessment } from '@/actions/autoDiligenceActions';

interface Props {
  propertyId: string;
}

export function AutoDiligenceEngine({ propertyId }: Props) {
  const [assessment, setAssessment] = useState<DiligenceAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    const result = await runAutoDiligence(propertyId);
    setAssessment(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6 shadow-xl relative">
      <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 rounded-lg border border-sky-500/20">
            <ScanSearch className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Autonomous Geospatial Diligence</h2>
            <p className="text-xs text-slate-500">AI Satellite & Records Scan</p>
          </div>
        </div>
        {!assessment && !loading && (
          <button 
            onClick={handleScan}
            className="flex items-center gap-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Map className="w-4 h-4" /> Run Deep Scan
          </button>
        )}
      </div>

      <div className="p-6">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <ScanSearch className="w-12 h-12 text-sky-400 animate-pulse mb-4" />
            <h3 className="text-lg font-medium text-slate-200">Scanning Satellite Imagery...</h3>
            <p className="text-sm text-slate-500 mt-2">Checking FEMA flood maps, wetlands, and road access points.</p>
          </div>
        )}

        {!loading && !assessment && (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-70">
            <Map className="w-16 h-16 text-slate-700 mb-4" />
            <p className="text-sm text-slate-400">Click "Run Deep Scan" to generate an automated due diligence report.</p>
          </div>
        )}

        {assessment && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {/* Grade Circle */}
              <div className="shrink-0 flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-slate-800 bg-slate-900 shadow-inner relative">
                <div className={`text-5xl font-black ${
                  ['A', 'B'].includes(assessment.overallGrade) ? 'text-emerald-400' :
                  assessment.overallGrade === 'C' ? 'text-amber-400' : 'text-rose-500'
                }`}>
                  {assessment.overallGrade}
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider absolute bottom-4">Grade</div>
              </div>
              
              <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Droplets className="w-4 h-4 text-sky-400" /> <span className="text-xs uppercase font-bold">Wetlands / Flood</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-200">{assessment.wetlandsPercentage}% / {assessment.floodZone}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <MapPin className="w-4 h-4 text-emerald-400" /> <span className="text-xs uppercase font-bold">Access</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-200">{assessment.roadAccess}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" /> <span className="text-xs uppercase font-bold">Zoning</span>
                  </div>
                  <div className="text-lg font-semibold text-slate-200">{assessment.zoning}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Trees className="w-4 h-4 text-amber-400" /> <span className="text-xs uppercase font-bold">Buildable Acres</span>
                  </div>
                  <div className="text-lg font-semibold text-amber-400">{assessment.buildableAcreage.toFixed(2)} ac</div>
                </div>
              </div>
            </div>

            {assessment.redFlags.length > 0 && (
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" /> Detected Risks
                </h4>
                <ul className="space-y-2">
                  {assessment.redFlags.map((flag, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-rose-500 font-bold">•</span> {flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
