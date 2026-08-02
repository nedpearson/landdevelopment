"use client";

import React, { useState } from "react";
import { Activity, CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";

import type { Property } from "@land-intelligence/database";

export type HealthStatus = "HEALTHY" | "NEEDS_REVIEW" | "HIGH_RISK" | "UNKNOWN";

interface Props {
  entityId: string;
  propertyData?: Property | null;
}

export function PropertyHealthBadge({ entityId, propertyData }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Live logic based on propertyData
  let status: HealthStatus = "UNKNOWN";
  let reason = "Insufficient data to determine property health.";
  
  if (propertyData) {
    const envAssessment = propertyData.environmentalAssessment as Record<string, any> | null;
    const utilityAssessment = propertyData.utilityAssessment as Record<string, any> | null;

    if (envAssessment?.floodZoneVerified === false) {
      status = "HIGH_RISK";
      reason = "FEMA flood zone unverified or detected on buildable area.";
    } else if (utilityAssessment?.waterTapVerified === false) {
      status = "NEEDS_REVIEW";
      reason = "Zoning allows development, but utility capacity (water/sewer) is currently unverified.";
    } else {
      status = "HEALTHY";
      reason = "All primary diligence complete. Clean title, confirmed utilities, and surveyed boundaries.";
    }
  }

  const styles = {
    HEALTHY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    NEEDS_REVIEW: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    HIGH_RISK: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    UNKNOWN: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  };

  const icons = {
    HEALTHY: <CheckCircle2 className="w-4 h-4" />,
    NEEDS_REVIEW: <AlertTriangle className="w-4 h-4" />,
    HIGH_RISK: <AlertOctagon className="w-4 h-4" />,
    UNKNOWN: <HelpCircle className="w-4 h-4" />,
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold uppercase tracking-wider transition-colors hover:opacity-80 ${styles[status]}`}
      >
        {icons[status]}
        <span>{status.replace("_", " ")}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 z-[120] animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h4 className="font-bold text-white text-sm">Health Diagnostics</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {reason}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
