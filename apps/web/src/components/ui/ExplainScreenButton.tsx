"use client";

import React from "react";
import { Info } from "lucide-react";
import { useCoPilot } from "../providers/CoPilotProvider";
import { usePathname } from "next/navigation";

export function ExplainScreenButton() {
  const { setIsOpen, addMessage } = useCoPilot();
  const pathname = usePathname();

  const handleExplain = () => {
    setIsOpen(true);
    
    // In a real app, this would hit the OpenAI backend with the current pathname
    // and serialized page context to generate a dynamic explanation.
    let explanation = "This page allows you to view your active portfolio.";
    
    if (pathname === "/") {
      explanation = "This is your Human Language Dashboard. It aggregates all properties, tasks, and offers across your pipeline and uses AI to surface only what requires your immediate attention today. The 'Estimated Profit' is calculated by subtracting your acquisition costs from the projected retail values of all 'Active' pipeline deals.";
    } else if (pathname === "/discover") {
      explanation = "This is the Discover Map. It shows available parcels in your target counties. The green parcels indicate high AI Confidence for development. You can click any parcel to slide open its intelligence drawer and see why the AI scored it highly.";
    }

    addMessage("user", "Explain this screen to me.");
    
    setTimeout(() => {
      addMessage("ai", explanation);
    }, 600);
  };

  return (
    <button 
      onClick={handleExplain}
      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-300 hover:text-indigo-200 transition-colors text-sm font-medium shadow-sm shadow-indigo-900/20"
    >
      <Info className="w-4 h-4" />
      <span>Explain This Screen</span>
    </button>
  );
}
