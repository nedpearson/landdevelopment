"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, AlertCircle } from "lucide-react";
import { generateExecutiveSummary, AIAnalysisResult } from "@/app/actions/ai";

interface Props {
  entityId: string;
  entityType: string;
}

export function ExecutiveSummary({ entityId, entityType }: Props) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchSummary() {
      try {
        setLoading(true);
        setError(null);
        const result = await generateExecutiveSummary(entityId, entityType);
        if (isMounted) setData(result);
      } catch (err: any) {
        if (isMounted) setError(err.message || "An error occurred fetching AI insights.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSummary();

    return () => {
      isMounted = false;
    };
  }, [entityId, entityType]);

  if (error) {
    return (
      <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-rose-400">AI Engine Unavailable</h3>
          <p className="text-xs text-rose-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4 text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold">AI Synthesizing Data...</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-indigo-900/40 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-900/40 rounded w-full"></div>
          <div className="h-4 bg-indigo-900/40 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-xl overflow-hidden shadow-lg relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold text-lg text-white">AI Executive Summary</h3>
          </div>
          <div className="bg-indigo-950 text-indigo-300 text-xs px-2 py-1 rounded-md font-mono border border-indigo-500/30">
            Confidence: {data.confidence}%
          </div>
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {data.summary}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Positive Indicators
            </h4>
            <ul className="space-y-2">
              {data.positiveIndicators.map((item, i) => (
                <li key={i} className="text-sm text-slate-400 flex gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Concerns & Risks
            </h4>
            <ul className="space-y-2">
              {data.concerns.map((item, i) => (
                <li key={i} className="text-sm text-slate-400 flex gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
          <h4 className="text-sm font-semibold text-white mb-3">Recommended Next Steps</h4>
          <div className="space-y-2">
            {data.recommendedSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 bg-slate-800 p-3 rounded-md border border-slate-700">
                <div className="w-6 h-6 rounded-full bg-indigo-900/50 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30 shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm text-slate-300 flex-1">{step}</span>
                <button className="text-slate-500 hover:text-indigo-400 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
