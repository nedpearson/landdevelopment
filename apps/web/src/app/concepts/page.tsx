"use client";

import React, { useState } from "react";
import { Plus, Search, Layout, Maximize, CheckCircle, X, GitCompare } from "lucide-react";

type ConceptPlan = {
  id: string;
  name: string;
  site: string;
  productType: string;
  units: number;
  coverage: number;
  far: number;
  features: string[];
};

const initialConcepts: ConceptPlan[] = [
  { id: "1", name: "High Density Scenario A", site: "Oak Creek", productType: "Multifamily", units: 250, coverage: 65, far: 2.1, features: ["Underground Parking", "Roof Deck", "Ground Retail"] },
  { id: "2", name: "Mid Rise Scenario B", site: "Oak Creek", productType: "Multifamily", units: 180, coverage: 45, far: 1.5, features: ["Surface Parking", "More Green Space", "Pool Amenity"] },
  { id: "3", name: "Townhome Layout 1", site: "Pine Ridge", productType: "Townhomes", units: 60, coverage: 55, far: 0.8, features: ["Rear Load Garages", "Park Fronting", "Alley Access"] },
  { id: "4", name: "Single Family Trad", site: "Pine Ridge", productType: "Single Family", units: 45, coverage: 35, far: 0.4, features: ["50' Lots", "Cul-de-sacs", "Detached Garages"] },
  { id: "5", name: "Logistics Hub Max", site: "Sunset Industrial", productType: "Industrial", units: 1, coverage: 75, far: 0.9, features: ["Cross-dock", "130' Truck Courts", "36' Clear"] },
];

export default function ConceptsPage() {
  const [concepts, setConcepts] = useState<ConceptPlan[]>(initialConcepts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredConcepts = concepts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.site.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: ConceptPlan = {
      id: Math.random().toString(36).substring(7),
      name: formData.get("name") as string,
      site: formData.get("site") as string,
      productType: formData.get("productType") as string,
      units: Number(formData.get("units")),
      coverage: Number(formData.get("coverage")),
      far: Number(formData.get("far")),
      features: (formData.get("features") as string).split(',').map(s => s.trim()),
    };
    setIsModalOpen(false);
    showToast("Concepts persistence coming soon");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Concept Plans</h1>
          <p className="text-slate-400 mt-1">Iterate and evaluate site layouts and density</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
          >
            <GitCompare size={20} />
            <span>Compare Scenarios</span>
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus size={20} />
            <span>Create Concept</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search plans or sites..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConcepts.map((concept) => (
          <div key={concept.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-sky-500/50 transition flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{concept.name}</h3>
                <p className="text-sm text-slate-400">{concept.site}</p>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-700 flex items-center justify-center">
                <Layout className="text-sky-400" size={24} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
              <div>
                <div className="text-xs text-slate-400">Product</div>
                <div className="font-medium text-slate-200">{concept.productType}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Yield</div>
                <div className="font-medium text-slate-200">{concept.units} units/sf</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Coverage</div>
                <div className="font-medium text-slate-200">{concept.coverage}%</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">FAR</div>
                <div className="font-medium text-slate-200">{concept.far}</div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-700/50">
              <div className="text-xs text-slate-400 mb-2">Key Features:</div>
              <div className="flex flex-wrap gap-2">
                {concept.features.map((f, i) => (
                  <span key={i} className="text-[10px] uppercase tracking-wider bg-slate-900 border border-slate-700 text-slate-300 px-2 py-1 rounded">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Create Concept Plan</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Plan Name</label>
                  <input required name="name" type="text" placeholder="e.g. Scenario A - High Density" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Site</label>
                  <input required name="site" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Product Type</label>
                  <input required name="productType" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Units / SF Yield</label>
                  <input required name="units" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Lot Coverage (%)</label>
                  <input required name="coverage" type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">FAR</label>
                  <input required name="far" type="number" step="0.01" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Key Features (comma separated)</label>
                  <input required name="features" type="text" placeholder="Pool, Surface Parking, etc." className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg transition">Save Concept</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isCompareOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900">
              <h2 className="text-xl font-bold text-white">Compare Scenarios (Oak Creek)</h2>
              <button onClick={() => setIsCompareOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-700">
                    <th className="p-4 text-slate-400 font-medium">Metric</th>
                    <th className="p-4 text-white font-bold border-l border-slate-700">{concepts[0].name}</th>
                    <th className="p-4 text-white font-bold border-l border-slate-700">{concepts[1].name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  <tr className="hover:bg-slate-700/30">
                    <td className="p-4 text-slate-400">Product Type</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[0].productType}</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[1].productType}</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="p-4 text-slate-400">Yield</td>
                    <td className="p-4 font-bold text-sky-400 border-l border-slate-700">{concepts[0].units} units</td>
                    <td className="p-4 font-bold text-slate-200 border-l border-slate-700">{concepts[1].units} units</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="p-4 text-slate-400">Coverage</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[0].coverage}%</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[1].coverage}%</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="p-4 text-slate-400">FAR</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[0].far}</td>
                    <td className="p-4 text-slate-200 border-l border-slate-700">{concepts[1].far}</td>
                  </tr>
                  <tr className="hover:bg-slate-700/30">
                    <td className="p-4 text-slate-400">Features</td>
                    <td className="p-4 text-sm text-slate-300 border-l border-slate-700">{concepts[0].features.join(", ")}</td>
                    <td className="p-4 text-sm text-slate-300 border-l border-slate-700">{concepts[1].features.join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end">
              <button onClick={() => {
                showToast("Comparison exported");
                setIsCompareOpen(false);
              }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition">Export Comparison</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-sky-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
