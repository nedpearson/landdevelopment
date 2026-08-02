"use client";

import React, { useState } from "react";
import { BookOpen, AlertTriangle } from "lucide-react";
import { LAND_DICTIONARY } from "@/lib/dictionary";

interface Props {
  termKey: string;
  children: React.ReactNode;
}

export function TermTranslator({ termKey, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const term = LAND_DICTIONARY[termKey];

  if (!term) {
    return <span className="border-b border-dashed border-slate-500 cursor-help">{children}</span>;
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="border-b border-dashed border-indigo-400 text-indigo-300 cursor-help transition-colors hover:text-indigo-200">
        {children}
      </span>

      {isOpen && (
        <div className="absolute z-[200] bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <div>
              <h4 className="font-bold text-white text-sm leading-none">{term.professionalName}</h4>
              <p className="text-[10px] text-indigo-400 font-mono mt-1 uppercase">AKA: {term.simpleName}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm text-slate-300 font-medium leading-snug">
              "{term.oneSentence}"
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {term.detailedExplanation}
            </p>

            <div className="bg-rose-950/30 border border-rose-900/50 p-2 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-0.5">Why it matters</p>
                <p className="text-xs text-rose-200/80 leading-relaxed">{term.whyItMatters}</p>
              </div>
            </div>

            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Example</p>
              <p className="text-xs text-slate-300 italic">{term.example}</p>
            </div>
          </div>
          
          {/* Triangle pointer */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
