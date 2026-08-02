'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '@land-intelligence/ui';
import {
  Compass,
  MapPin,
  DollarSign,
  Layers,
  Sparkles,
  TrendingUp,
  Building2,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useExperienceMode } from '@/components/providers/ExperienceModeProvider';
import { TractMap } from '@/components/gis/TractMap';
import { PropertyReport } from '@/components/gis/PropertyReport';
import { OnboardingWizard } from '@/components/ui/OnboardingWizard';
import { AIGuide } from '@/components/ui/AIGuide';
import { SafetyGate } from '@/components/ui/SafetyGate';
import { useDrilldown } from '@/components/providers/DrilldownProvider';
import { getAllProperties } from '@/actions/propertyActions';

export default function DashboardPage() {
  const { mode, isTourCompleted } = useExperienceMode();
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    if (mode === "SIMPLE") {
      getAllProperties().then(data => {
        setProperties(data);
      });
    }
  }, [mode]);

  if (mode === "SIMPLE") {
    return (
      <div className="h-full flex flex-col gap-6 relative">
        {!isTourCompleted && <OnboardingWizard />}
        <AIGuide />
        
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold text-white mb-2">My Property View</h1>
          <p className="text-slate-400">Safely explore land data with plain-English translations.</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="lg:col-span-2 h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700">
            <TractMap tracts={properties} />
          </div>
          
          <div className="overflow-y-auto pr-2 flex flex-col gap-6">
            <PropertyReport />
            
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl">
              <h3 className="font-bold text-white mb-4">Ready to move forward?</h3>
              <SafetyGate 
                actionName="Send Binding Offer"
                minimumLevel="GUIDED"
                explanation="Sending a legally binding offer requires you to understand the Title and Access risks first. Please upgrade your experience mode to Guided to unlock contract features."
                onProceed={() => console.log("Proceeding to contract")}
              >
                <button className="w-full py-3 bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 rounded-lg font-semibold cursor-not-allowed">
                  Draft Purchase Contract
                </button>
              </SafetyGate>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HUMAN LANGUAGE DASHBOARD
  const { push } = useDrilldown();

  return (
    <div className="space-y-8 max-w-4xl mx-auto mt-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-light text-slate-100 tracking-tight">
          Good Morning, <span className="font-semibold text-white">Ned</span>.
        </h1>
        <p className="text-lg text-slate-400">Here is your land intelligence briefing for today.</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <h2 className="text-xl font-medium text-slate-200 border-b border-slate-800/80 pb-4">
          Today I recommend:
        </h2>
        
        <ul className="space-y-5">
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
            <button onClick={() => push({ id: "prop-48200", type: "PROPERTY", label: "Action Required" })} className="hover:text-white transition-colors text-left text-lg group flex items-center gap-2">
              <span><strong className="text-white font-medium">1 SFR development</strong> is waiting on a final permit.</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
            </button>
          </li>
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-lg"><strong className="text-white font-medium">2 rental leases</strong> expire next month across your BTR portfolio.</span>
          </li>
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <span className="text-lg"><strong className="text-white font-medium">1 commercial plot</strong> is waiting on utility capacity verification.</span>
          </li>
          <li className="flex items-center gap-4 text-slate-300">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
            <span className="text-lg"><strong className="text-white font-medium">3 raw land parcels</strong> are ready for subdivision modeling.</span>
          </li>
        </ul>

        <div className="pt-8 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 font-medium">Estimated potential profit across active pipeline</p>
            <p className="text-4xl font-bold text-emerald-400 mt-1 tracking-tight">$142,000</p>
          </div>
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold transition-colors flex items-center gap-3 shadow-xl shadow-emerald-900/30">
            Click to Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
