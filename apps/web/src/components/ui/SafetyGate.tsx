"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { useExperienceMode, ExperienceLevel } from "../providers/ExperienceModeProvider";

interface Props {
  actionName: string;
  minimumLevel: ExperienceLevel;
  explanation: string;
  onProceed: () => void;
  children: React.ReactNode;
}

export function SafetyGate({ actionName, minimumLevel, explanation, onProceed, children }: Props) {
  const { mode } = useExperienceMode();
  const [showWarning, setShowWarning] = useState(false);

  const levels: Record<ExperienceLevel, number> = {
    SIMPLE: 1,
    GUIDED: 2,
    EXPERT: 3
  };

  const isAllowed = levels[mode] >= levels[minimumLevel];

  const handleClick = (e: React.MouseEvent) => {
    if (!isAllowed) {
      e.preventDefault();
      e.stopPropagation();
      setShowWarning(true);
    } else {
      onProceed();
    }
  };

  return (
    <>
      <div onClick={handleClick} className="inline-block">
        {children}
      </div>

      {showWarning && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
            
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <ShieldAlert className="w-8 h-8" />
              <h2 className="text-xl font-bold">Safety Gate: {actionName}</h2>
            </div>
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-slate-300 text-sm mb-6 leading-relaxed">
              <p className="mb-2 font-semibold">Why is this blocked?</p>
              <p>{explanation}</p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  setShowWarning(false);
                  onProceed();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                I Understand, Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
