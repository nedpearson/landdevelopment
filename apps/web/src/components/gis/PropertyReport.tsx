"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { GlossaryTooltip } from "../ui/GlossaryTooltip";

interface ReportItem {
  id: string;
  category: string;
  status: "GREEN" | "YELLOW" | "RED" | "GRAY";
  title: string;
  description: string;
}

const mockReport: ReportItem[] = [
  {
    id: "legal-access",
    category: "Access",
    status: "GREEN",
    title: "Direct Road Access",
    description: "This property touches a public paved road."
  },
  {
    id: "flood-risk",
    category: "Environment",
    status: "YELLOW",
    title: "Partial Flood Zone",
    description: "About 15% of the property is in a 100-year flood zone. You can still build, but need to be careful where you put the house."
  },
  {
    id: "minerals",
    category: "Ownership",
    status: "GRAY",
    title: "Mineral Rights Unknown",
    description: "We don't know who owns the rights to oil or gas under this land. You'll need a title search to be sure."
  },
  {
    id: "utilities",
    category: "Development",
    status: "RED",
    title: "No Public Water/Sewer",
    description: "You will need to drill a well and install a septic tank to build here."
  }
];

export function PropertyReport() {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden max-w-2xl mx-auto shadow-2xl">
      <div className="p-6 border-b border-slate-800 bg-slate-800/50">
        <h2 className="text-xl font-bold text-white mb-2">Plain-English Property Report</h2>
        <p className="text-slate-400 text-sm">
          We analyzed this <GlossaryTooltip term="TRACT">Tract</GlossaryTooltip> against 4 major risk factors.
        </p>
      </div>

      <div className="p-4 space-y-3">
        {mockReport.map((item) => (
          <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors">
            <div className="shrink-0 mt-1">
              {item.status === "GREEN" && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
              {item.status === "YELLOW" && <AlertTriangle className="w-6 h-6 text-amber-500" />}
              {item.status === "RED" && <XCircle className="w-6 h-6 text-rose-500" />}
              {item.status === "GRAY" && <HelpCircle className="w-6 h-6 text-slate-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  {item.category}
                </span>
              </div>
              <h3 className="font-semibold text-slate-200">{item.title}</h3>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
