"use client";

import React from "react";
import { History, FileText, User, DollarSign, Construction } from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "OWNERSHIP" | "TAX" | "PERMIT" | "DOCUMENT";
}

// Simulated data
const mockEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    date: "Aug 1, 2026",
    title: "Listed for Sale",
    description: "Property hit the market with an asking price of $185,000.",
    type: "DOCUMENT"
  },
  {
    id: "evt-2",
    date: "Jan 14, 2024",
    title: "Tax Value Increased",
    description: "County assessor raised the unimproved land value by 12% to $142,000.",
    type: "TAX"
  },
  {
    id: "evt-3",
    date: "Sep 30, 2018",
    title: "Deed Transfer",
    description: "Property transferred from John Doe to Smith Holdings LLC via Warranty Deed.",
    type: "OWNERSHIP"
  },
  {
    id: "evt-4",
    date: "May 12, 2005",
    title: "Zoning Variance Denied",
    description: "Previous owner attempted to rezone from Agricultural to Light Commercial. Request denied due to access constraints.",
    type: "PERMIT"
  }
];

export function PropertyTimeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case "OWNERSHIP": return <User className="w-4 h-4 text-emerald-400" />;
      case "TAX": return <DollarSign className="w-4 h-4 text-rose-400" />;
      case "PERMIT": return <Construction className="w-4 h-4 text-amber-400" />;
      case "DOCUMENT": return <FileText className="w-4 h-4 text-sky-400" />;
      default: return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "OWNERSHIP": return "bg-emerald-500/10 border-emerald-500/30";
      case "TAX": return "bg-rose-500/10 border-rose-500/30";
      case "PERMIT": return "bg-amber-500/10 border-amber-500/30";
      case "DOCUMENT": return "bg-sky-500/10 border-sky-500/30";
      default: return "bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <History className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-white text-lg">Historical Timeline</h3>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-3 space-y-8 pb-4">
        {mockEvents.map((event) => (
          <div key={event.id} className="relative pl-8 group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border flex items-center justify-center bg-slate-950 ${getBadgeColor(event.type)} transition-transform group-hover:scale-110`}>
              {getIcon(event.type)}
            </div>

            <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <span className="text-xs font-mono text-indigo-400 font-bold mb-1 block">
                {event.date}
              </span>
              <h4 className="text-sm font-bold text-white mb-1">{event.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
