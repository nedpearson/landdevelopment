"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { getGlossaryTerm } from "@/lib/glossary";
import { useExperienceMode } from "@/components/providers/ExperienceModeProvider";

interface Props {
  term: string;
  children: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: Props) {
  const { mode } = useExperienceMode();
  const [isOpen, setIsOpen] = useState(false);
  
  const definition = getGlossaryTerm(term);

  if (mode === "EXPERT" || !definition) {
    return <>{children}</>;
  }

  return (
    <span 
      className="relative inline-flex items-center gap-1 cursor-help group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="border-b border-dashed border-emerald-400 text-emerald-400 group-hover:text-emerald-300 transition-colors">
        {mode === "SIMPLE" ? definition.simpleLabel : children}
      </span>
      <HelpCircle className="w-3 h-3 text-emerald-400/70" />

      {isOpen && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 border border-slate-700 text-sm rounded-lg shadow-xl p-3">
          <div className="font-semibold text-emerald-400 mb-1 flex items-center justify-between">
            {definition.simpleLabel}
            <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 font-mono">
              {definition.professionalTerm}
            </span>
          </div>
          <p className="text-slate-300 mb-2">{definition.shortExplanation}</p>
          <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
            <span className="block text-xs font-semibold text-slate-400 mb-1">Why it matters:</span>
            <span className="text-slate-300 text-xs italic">{definition.whyItMatters}</span>
          </div>
        </div>
      )}
    </span>
  );
}
