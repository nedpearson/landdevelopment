"use client";

import { useState } from "react";
import { runPredictiveMatchmaking } from "@/actions/dispositionActions";
import type { BuyerMatch } from "@/actions/dispositionActions";
import { Badge, Button } from "@land-intelligence/ui";

export function PredictiveMatchmaker({
  propertyDetails
}: {
  propertyDetails: { apn: string; county: string; state: string; acreage: number; type: string };
}) {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<BuyerMatch[] | null>(null);

  const runMatchmaking = async () => {
    setLoading(true);
    try {
      const data = await runPredictiveMatchmaking(propertyDetails);
      setMatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm mt-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Predictive Buyer Matchmaker</h3>
          <p className="text-sm text-slate-500">Auto-find buyers & generate disposition pitches</p>
        </div>
        <Button 
          onClick={runMatchmaking}
          disabled={loading}
          variant="primary"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {loading ? "Scanning Buyer Network..." : "Find Buyers"}
        </Button>
      </div>

      {matches && (
        <div className="space-y-6 mt-6 border-t border-slate-100 pt-6">
          <h4 className="font-semibold text-slate-800">Top 3 Institutional Matches</h4>
          
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.buyerId} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-slate-800 text-lg">{match.buyerName}</h5>
                    <p className="text-sm text-slate-500 mt-1">Match Reason: {match.matchReason}</p>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Match Score</span>
                    <Badge className={match.matchScore > 85 ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"}>
                      {match.matchScore}%
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Drafted Pitch Email</span>
                    <Button variant="outline" size="sm" className="text-xs h-7">Send Email</Button>
                  </div>
                  <div className="bg-slate-50 p-4 rounded text-sm text-slate-700 whitespace-pre-wrap font-mono border border-slate-100">
                    {match.draftEmail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
