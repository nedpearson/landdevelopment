"use client";

import { Badge, Button } from "@land-intelligence/ui";

export function FundManagerDashboard() {
  // In a real scenario, this data would be calculated server-side across the entire portfolio.
  // We simulate an institutional level macro-view for Phase 29.
  
  const stats = {
    totalCapitalDeployed: "$14,250,000",
    totalUnrealizedAVM: "$28,500,000",
    blendedROI: "100%",
    activeMarkets: 12,
    propertiesOwned: 45
  };

  const marketRecommendations = [
    { market: "Travis County, TX", recommendation: "DOUBLE DOWN", reason: "AI detects 15% YoY appreciation and low inventory.", riskScore: 12 },
    { market: "Maricopa County, AZ", recommendation: "HOLD", reason: "Water rights legislation pending. Wait for clarity.", riskScore: 45 },
    { market: "Polk County, FL", recommendation: "LIQUIDATE", reason: "Zoning restrictions increasing. Exit current positions.", riskScore: 78 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Global Fund Manager</h1>
          <p className="text-slate-500 mt-1">Macro-level capital allocation & AI market strategy</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Generate Quarterly Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm col-span-2">
          <span className="text-sm text-slate-500 font-medium">Total Capital Deployed</span>
          <div className="text-4xl font-bold text-slate-800 mt-2">{stats.totalCapitalDeployed}</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm col-span-2">
          <span className="text-sm text-slate-500 font-medium">Total Unrealized AVM</span>
          <div className="text-4xl font-bold text-emerald-600 mt-2">{stats.totalUnrealizedAVM}</div>
        </div>
        <div className="bg-indigo-600 p-6 rounded-lg shadow-sm text-white flex flex-col justify-center items-center">
          <span className="text-sm font-medium opacity-80">Blended Target ROI</span>
          <div className="text-4xl font-bold mt-2">{stats.blendedROI}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">AI Market Deployment Recommendations</h3>
          <p className="text-sm text-slate-500">Autonomous strategy based on micro-economic shifts & legislative tracking.</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-medium">Market</th>
              <th className="p-4 font-medium">AI Recommendation</th>
              <th className="p-4 font-medium">Strategic Reasoning</th>
              <th className="p-4 font-medium">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {marketRecommendations.map((market, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-semibold text-slate-800">{market.market}</td>
                <td className="p-4">
                  <Badge className={
                    market.recommendation === "DOUBLE DOWN" ? "bg-emerald-100 text-emerald-800" :
                    market.recommendation === "LIQUIDATE" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }>
                    {market.recommendation}
                  </Badge>
                </td>
                <td className="p-4 text-sm text-slate-600">{market.reason}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[100px]">
                      <div 
                        className={`h-2 rounded-full ${market.riskScore > 50 ? 'bg-red-500' : market.riskScore > 25 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${market.riskScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{market.riskScore}/100</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
