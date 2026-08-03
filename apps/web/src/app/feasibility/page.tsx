"use client";

import React, { useState } from "react";
import { Plus, Search, FileText, CheckCircle, X, Download, TrendingUp } from "lucide-react";

type FeasibilityStudy = {
  id: string;
  siteName: string;
  address: string;
  acres: number;
  proposedUse: string;
  units: number;
  landCost: number;
  totalDevCost: number;
  estRevenue: number;
  profit: number;
  score: number;
};

const initialStudies: FeasibilityStudy[] = [
  { id: "1", siteName: "Oak Creek Dev", address: "123 Oak St", acres: 15, proposedUse: "Multifamily", units: 150, landCost: 2000000, totalDevCost: 15000000, estRevenue: 22000000, profit: 5000000, score: 85 },
  { id: "2", siteName: "Pine Ridge", address: "456 Pine Ave", acres: 35, proposedUse: "Single Family", units: 75, landCost: 1500000, totalDevCost: 12000000, estRevenue: 16000000, profit: 2500000, score: 65 },
  { id: "3", siteName: "Riverfront Mixed", address: "789 River Rd", acres: 5, proposedUse: "Mixed Use", units: 200, landCost: 4000000, totalDevCost: 25000000, estRevenue: 35000000, profit: 6000000, score: 92 },
  { id: "4", siteName: "Sunset Logistics", address: "321 Industrial Pkwy", acres: 50, proposedUse: "Industrial", units: 500000, landCost: 5000000, totalDevCost: 35000000, estRevenue: 48000000, profit: 8000000, score: 78 },
  { id: "5", siteName: "Cedar Heights", address: "555 Cedar Ln", acres: 12, proposedUse: "Townhomes", units: 80, landCost: 1800000, totalDevCost: 10000000, estRevenue: 14000000, profit: 2200000, score: 70 },
];

export default function FeasibilityPage() {
  const [studies, setStudies] = useState<FeasibilityStudy[]>(initialStudies);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<FeasibilityStudy | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredStudies = studies.filter(s =>
    s.siteName.toLowerCase().includes(search.toLowerCase()) ||
    s.proposedUse.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudy: FeasibilityStudy = {
      id: Math.random().toString(36).substring(7),
      siteName: formData.get("siteName") as string,
      address: formData.get("address") as string,
      acres: Number(formData.get("acres")),
      proposedUse: formData.get("proposedUse") as string,
      units: Number(formData.get("units")),
      landCost: Number(formData.get("landCost")),
      totalDevCost: Number(formData.get("totalDevCost")),
      estRevenue: Number(formData.get("estRevenue")),
      profit: Number(formData.get("estRevenue")) - Number(formData.get("totalDevCost")) - Number(formData.get("landCost")),
      score: Math.floor(Math.random() * 40) + 60, // random score for mock
    };
    setIsModalOpen(false);
    showToast("Feasibility studies persistence coming soon");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Feasibility Analysis</h1>
          <p className="text-slate-400 mt-1">Evaluate potential deals and pro formas</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>New Feasibility Study</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search site or use..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Site Name & Address</th>
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold text-right">Costs & Revenue</th>
                <th className="p-4 font-semibold text-right">Profit</th>
                <th className="p-4 font-semibold text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredStudies.map((study) => (
                <tr 
                  key={study.id} 
                  className="hover:bg-slate-700/50 cursor-pointer transition"
                  onClick={() => setSelectedStudy(study)}
                >
                  <td className="p-4">
                    <div className="font-medium text-white">{study.siteName}</div>
                    <div className="text-sm text-slate-400">{study.address}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{study.proposedUse}</div>
                    <div className="text-xs text-slate-400">{study.acres} acres • {study.units} units</div>
                  </td>
                  <td className="p-4 text-right text-sm">
                    <div className="text-slate-300">Cost: {formatCurrency(study.landCost + study.totalDevCost)}</div>
                    <div className="text-emerald-400">Rev: {formatCurrency(study.estRevenue)}</div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium text-white">{formatCurrency(study.profit)}</div>
                    <div className="text-xs text-slate-400">
                      {((study.profit / (study.landCost + study.totalDevCost)) * 100).toFixed(1)}% ROI
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center">
                      <div className="relative w-12 h-12 flex items-center justify-center rounded-full border-4 border-slate-700">
                        <div 
                          className={`absolute inset-0 rounded-full border-4 ${study.score >= 80 ? 'border-emerald-500' : study.score >= 60 ? 'border-amber-500' : 'border-red-500'}`}
                          style={{ clipPath: `polygon(0 0, 100% 0, 100% ${study.score}%, 0 ${study.score}%)` }}
                        />
                        <span className="relative text-sm font-bold text-white">{study.score}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudies.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">No studies found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">New Feasibility Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Site Name</label>
                  <input required name="siteName" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input required name="address" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Total Acres</label>
                  <input required name="acres" type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Proposed Use</label>
                  <select required name="proposedUse" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                    <option>Multifamily</option>
                    <option>Single Family</option>
                    <option>Mixed Use</option>
                    <option>Industrial</option>
                    <option>Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Units / SF</label>
                  <input required name="units" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Land Cost ($)</label>
                  <input required name="landCost" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Total Dev Cost ($)</label>
                  <input required name="totalDevCost" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Est. Revenue ($)</label>
                  <input required name="estRevenue" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition">Create Study</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStudy && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-start p-6 border-b border-slate-700 bg-slate-800/50">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedStudy.siteName}</h2>
                <p className="text-slate-400">{selectedStudy.address}</p>
              </div>
              <button onClick={() => setSelectedStudy(null)} className="text-slate-400 hover:text-white transition bg-slate-700 rounded-full p-1">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Score</div>
                  <div className="text-2xl font-bold text-emerald-400">{selectedStudy.score}/100</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Yield</div>
                  <div className="text-2xl font-bold text-white">
                    {((selectedStudy.profit / (selectedStudy.landCost + selectedStudy.totalDevCost)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-white">{formatCurrency(selectedStudy.landCost + selectedStudy.totalDevCost)}</div>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Total Rev</div>
                  <div className="text-xl font-bold text-emerald-400">{formatCurrency(selectedStudy.estRevenue)}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-700 pb-2">Pro Forma Breakdown</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Land Acquisition Cost</span>
                  <span className="font-medium text-white">{formatCurrency(selectedStudy.landCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Hard Construction Costs (Est.)</span>
                  <span className="font-medium text-white">{formatCurrency(selectedStudy.totalDevCost * 0.65)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Soft Costs (Est.)</span>
                  <span className="font-medium text-white">{formatCurrency(selectedStudy.totalDevCost * 0.25)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Financing & Contingency (Est.)</span>
                  <span className="font-medium text-white">{formatCurrency(selectedStudy.totalDevCost * 0.10)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50 font-bold">
                  <span className="text-slate-300">Total Uses</span>
                  <span className="text-white">{formatCurrency(selectedStudy.landCost + selectedStudy.totalDevCost)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50 font-bold mt-4">
                  <span className="text-emerald-400">Gross Revenue / Exit Value</span>
                  <span className="text-emerald-400">{formatCurrency(selectedStudy.estRevenue)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-emerald-900/50 font-bold text-lg bg-emerald-900/20 px-3 rounded mt-2">
                  <span className="text-white">Net Operating Profit</span>
                  <span className="text-white">{formatCurrency(selectedStudy.profit)}</span>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => {
                  showToast("Pro forma exported to PDF");
                  setSelectedStudy(null);
                }} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">
                  <Download size={16} /> Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
