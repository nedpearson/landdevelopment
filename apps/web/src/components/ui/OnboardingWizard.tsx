"use client";

import React, { useState } from "react";
import { ArrowRight, MapPin, Building2, Landmark, Tent } from "lucide-react";
import { useExperienceMode } from "../providers/ExperienceModeProvider";

const GOALS = [
  { id: "build", label: "I want to build a house", icon: Building2 },
  { id: "invest", label: "I want to invest for profit", icon: Landmark },
  { id: "recreation", label: "I want land for hunting/camping", icon: Tent },
  { id: "explore", label: "I'm just exploring map data", icon: MapPin },
];

export function OnboardingWizard() {
  const { completeTour } = useExperienceMode();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const handleComplete = () => {
    // In a real app, we'd save this to the OnboardingProfile Prisma model via API
    completeTour();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400" />
        
        <h2 className="text-2xl font-bold text-white mb-2">Welcome to Land OS</h2>
        <p className="text-slate-400 mb-8">Let's set up your simple map experience. What is your primary goal?</p>
        
        <div className="grid gap-3 mb-8">
          {GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => setSelectedGoal(goal.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300" 
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800 text-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${isSelected ? "bg-emerald-900/50" : "bg-slate-700"}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{goal.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            disabled={!selectedGoal}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
          >
            Start Exploring Map
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
