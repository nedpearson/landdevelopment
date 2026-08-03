"use client";

import { useState } from "react";
import { runAutonomousTitleAnalysis } from "@/actions/titleActions";
import type { TitleAnalysisResult } from "@/actions/titleActions";
import { Badge, Button } from "@land-intelligence/ui";

export function TitleRiskEngine({
  apn,
  county,
  state
}: {
  apn: string;
  county: string;
  state: string;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TitleAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await runAutonomousTitleAnalysis(apn, county, state);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 20) return "text-green-500";
    if (score < 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Autonomous Title Attorney</h3>
          <p className="text-sm text-slate-500">AI-driven chain of title & defect analysis</p>
        </div>
        <Button 
          onClick={runAnalysis}
          disabled={loading}
          variant="primary"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loading ? "Analyzing Chain of Title..." : "Run Title Analysis"}
        </Button>
      </div>

      {result && (
        <div className="space-y-6 mt-6 border-t border-slate-100 pt-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-500 font-medium">Title Risk Score</span>
              <div className={`text-4xl font-bold mt-1 ${getRiskColor(result.riskScore)}`}>
                {result.riskScore} <span className="text-lg text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-sm text-slate-500 font-medium">Closing Status</span>
              <div className="mt-2">
                {result.isClearToClose ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-lg py-1">Clear to Close</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-lg py-1">Defects Found</Badge>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800 mb-2">AI Summary</h4>
            <p className="text-slate-600 text-sm leading-relaxed bg-indigo-50 p-4 rounded-md border border-indigo-100">
              {result.summary}
            </p>
          </div>

          {result.defects.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Identified Defects & Curative Steps</h4>
              <div className="space-y-3">
                {result.defects.map((defect) => (
                  <div key={defect.id} className="p-4 border border-slate-200 rounded-lg bg-white relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${defect.severity === 'CRITICAL' ? 'bg-red-600' : defect.severity === 'HIGH' ? 'bg-orange-500' : defect.severity === 'MEDIUM' ? 'bg-yellow-400' : 'bg-slate-300'}`} />
                    <div className="flex justify-between items-start pl-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-800">{defect.type}</span>
                          <Badge variant="outline" className="text-xs">{defect.severity}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{defect.description}</p>
                        
                        <div className="bg-slate-50 p-3 rounded border border-slate-100">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1 block">Recommended Curative Action</span>
                          <p className="text-sm text-slate-700">{defect.recommendedCurative}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
