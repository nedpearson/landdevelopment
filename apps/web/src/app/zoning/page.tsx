"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Plus, Search, Map, CheckCircle, X, AlertTriangle } from "lucide-react";
import { getDeveloperSites, updatePropertyZoning } from "@/actions/developerActions";

export default function ZoningPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complianceCheck, setComplianceCheck] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedPropId, setSelectedPropId] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const sites = await getDeveloperSites();
    setRecords(sites);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRecords = records.filter(r =>
    r.address?.toLowerCase().includes(search.toLowerCase()) ||
    r.apn?.toLowerCase().includes(search.toLowerCase()) ||
    r.zoningAssessment?.zoningCode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const zoningData = {
      zoningCode: formData.get("zoningCode") as string,
      description: formData.get("description") as string,
      maxFAR: Number(formData.get("maxFAR")),
      maxHeight: formData.get("maxHeight") as string,
      minLotSize: formData.get("minLotSize") as string,
      setbacks: formData.get("setbacks") as string,
      overlay: formData.get("overlay") as string,
      varianceStatus: formData.get("varianceStatus") as string,
    };
    
    startTransition(() => {
      (async () => {
        if (!selectedPropId) {
          showToast("Please select a property", "error");
          return;
        }
        const res = await updatePropertyZoning(selectedPropId, zoningData);
        if (res.success) {
          showToast("Zoning record updated");
          setIsModalOpen(false);
          loadRecords();
        } else {
          showToast("Failed to update zoning", "error");
        }
      })();
    });
  };

  const getVarianceColor = (status: string) => {
    switch (status) {
      case "None Needed": return "bg-slate-700 text-slate-300";
      case "Required": return "bg-amber-900/50 text-amber-400 border border-amber-700/50";
      case "Approved": return "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50";
      case "Denied": return "bg-red-900/50 text-red-400 border border-red-700/50";
      default: return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Zoning Research</h1>
          <p className="text-slate-400 mt-1">Track land use regulations and development standards</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add / Update Zoning</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search address or code..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Address / APN</th>
                <th className="p-4 font-semibold">Zoning Code</th>
                <th className="p-4 font-semibold">Max FAR / Height</th>
                <th className="p-4 font-semibold">Setbacks / Min Lot</th>
                <th className="p-4 font-semibold">Overlay / Variance</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredRecords.map((record) => {
                const z = record.zoningAssessment || {};
                return (
                <tr key={record.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-medium text-white flex items-center gap-2">
                      <Map size={16} className="text-indigo-400" /> {record.address || record.apn}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-slate-700 text-indigo-300 rounded font-mono text-sm border border-slate-600">
                      {z.zoningCode || 'N/A'}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">{z.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">FAR: {z.maxFAR}</div>
                    <div className="text-xs text-slate-400">Height: {z.maxHeight}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{z.setbacks}</div>
                    <div className="text-xs text-slate-400">Lot: {z.minLotSize}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm truncate max-w-[150px]" title={z.overlay}>{z.overlay}</div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getVarianceColor(z.varianceStatus)}`}>
                        {z.varianceStatus || 'None'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setComplianceCheck(record)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 px-3 py-1.5 rounded transition"
                    >
                      Check Compliance
                    </button>
                  </td>
                </tr>
              )})}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No zoning records found matching "{search}"</td>
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
              <h2 className="text-xl font-bold text-white">Add/Update Zoning Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property</label>
                  <select required value={selectedPropId} onChange={e => setSelectedPropId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                    <option value="" disabled>Select Property</option>
                    {records.map(r => (
                      <option key={r.id} value={r.id}>{r.address || r.apn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Zoning Code</label>
                  <input required name="zoningCode" type="text" placeholder="e.g. R-3" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <input required name="description" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Max FAR</label>
                  <input required name="maxFAR" type="number" step="0.1" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Max Height</label>
                  <input required name="maxHeight" type="text" placeholder="e.g. 45 ft" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Min Lot Size</label>
                  <input required name="minLotSize" type="text" placeholder="e.g. 5,000 sqft" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Setbacks</label>
                  <input required name="setbacks" type="text" placeholder="F:20' S:10' R:15'" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Overlay Districts</label>
                  <input required name="overlay" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Variance Status</label>
                  <select required name="varianceStatus" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                    <option>None Needed</option>
                    <option>Required</option>
                    <option>Approved</option>
                    <option>Denied</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {complianceCheck && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900">
              <h2 className="text-xl font-bold text-white">Compliance Checklist</h2>
              <button onClick={() => setComplianceCheck(null)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-400 mb-4">Evaluating {complianceCheck.address || complianceCheck.apn} against {complianceCheck.zoningAssessment?.zoningCode} ({complianceCheck.zoningAssessment?.description}) standards.</p>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-medium text-white">FAR Compliance</div>
                  <div className="text-xs text-slate-400">Proposed FAR is within max {complianceCheck.zoningAssessment?.maxFAR}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-medium text-white">Height Restrictions</div>
                  <div className="text-xs text-slate-400">Building height meets {complianceCheck.zoningAssessment?.maxHeight} limit</div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
                <button onClick={() => {
                  showToast("Compliance report generated");
                  setComplianceCheck(null);
                }} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition text-sm">
                  Download Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-indigo-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
