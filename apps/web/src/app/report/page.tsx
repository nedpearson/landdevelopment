import React from "react";
import { PropertyReport } from "@/components/gis/PropertyReport";

export const metadata = {
  title: 'Property Report | Land OS',
  description: 'Plain-English translations of complex land data.',
};

export default function ReportPage() {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Property Reports</h1>
          <p className="text-slate-400 text-lg">View plain-English translations of complex land data for your active properties.</p>
        </div>
        
        <PropertyReport />
      </div>
    </div>
  );
}
