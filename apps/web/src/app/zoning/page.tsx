"use client";

import React, { useState } from "react";
import { Plus, Search, Map, CheckCircle, X, AlertTriangle } from "lucide-react";

type ZoningRecord = {
  id: string;
  address: string;
  zoningCode: string;
  description: string;
  maxFAR: number;
  maxHeight: string;
  minLotSize: string;
  setbacks: string;
  overlay: string;
  varianceStatus: "None Needed" | "Required" | "Approved" | "Denied";
};

const initialRecords: ZoningRecord[] = [
  { id: "1", address: "123 Oak St", zoningCode: "R-3", description: "High-Density Residential", maxFAR: 2.5, maxHeight: "45 ft", minLotSize: "5,000 sqft", setbacks: "F:20' S:10' R:15'", overlay: "Transit Oriented", varianceStatus: "None Needed" },
  { id: "2", address: "456 Pine Ave", zoningCode: "C-2", description: "General Commercial", maxFAR: 3.0, maxHeight: "65 ft", minLotSize: "10,000 sqft", setbacks: "F:10' S:0' R:10'", overlay: "Historic District", varianceStatus: "Required" },
  { id: "3", address: "789 River Rd", zoningCode: "MU-1", description: "Mixed-Use Low", maxFAR: 1.5, maxHeight: "35 ft", minLotSize: "7,500 sqft", setbacks: "F:15' S:5' R:15'", overlay: "Floodplain", varianceStatus: "Approved" },
  { id: "4", address: "321 Industrial Pkwy", zoningCode: "I-1", description: "Light Industrial", maxFAR: 1.0, maxHeight: "50 ft", minLotSize: "20,000 sqft", setbacks: "F:30' S:20' R:30'", overlay: "None", varianceStatus: "None Needed" },
  { id: "5", address: "555 Cedar Ln", zoningCode: "R-1", description: "Single-Family", maxFAR: 0.5, maxHeight: "30 ft", minLotSize: "10,000 sqft", setbacks: "F:25' S:10' R:20'", overlay: "Tree Conservation", varianceStatus: "Required" },
];

export default function ZoningPage() {
  const [records, setRecords] = useState<ZoningRecord[]>(initialRecords);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [complianceCheck, setComplianceCheck] = useState<ZoningRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredRecords = records.filter(r =>
    r.address.toLowerCase().includes(search.toLowerCase()) ||
    r.zoningCode.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: ZoningRecord = {
      id: Math.random().toString(36).substring(7),
      address: formData.get("address") as string,
      zoningCode: formData.get("zoningCode") as string,
      description: formData.get("description") as string,
      maxFAR: Number(formData.get("maxFAR")),
      maxHeight: formData.get("maxHeight") as string,
      minLotSize: formData.get("minLotSize") as string,
      setbacks: formData.get("setbacks") as string,
      overlay: formData.get("overlay") as string,
      varianceStatus: formData.get("varianceStatus") as any,
    };
    setRecords([newRecord, ...records]);
    setIsModalOpen(false);
    showToast("Zoning record added");
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
          <span>Add Zoning Record</span>
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
                <th className="p-4 font-semibold">Address</th>
                <th className="p-4 font-semibold">Zoning Code</th>
                <th className="p-4 font-semibold">Max FAR / Height</th>
                <th className="p-4 font-semibold">Setbacks / Min Lot</th>
                <th className="p-4 font-semibold">Overlay / Variance</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-medium text-white flex items-center gap-2">
                      <Map size={16} className="text-indigo-400" /> {record.address}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block px-2 py-1 bg-slate-700 text-indigo-300 rounded font-mono text-sm border border-slate-600">
                      {record.zoningCode}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">{record.description}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">FAR: {record.maxFAR}</div>
                    <div className="text-xs text-slate-400">Height: {record.maxHeight}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">{record.setbacks}</div>
                    <div className="text-xs text-slate-400">Lot: {record.minLotSize}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm truncate max-w-[150px]" title={record.overlay}>{record.overlay}</div>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getVarianceColor(record.varianceStatus)}`}>
                        {record.varianceStatus}
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
              ))}
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
              <h2 className="text-xl font-bold text-white">Add Zoning Record</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input required name="address" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
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
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition">Save Record</button>
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
              <p className="text-sm text-slate-400 mb-4">Evaluating {complianceCheck.address} against {complianceCheck.zoningCode} ({complianceCheck.description}) standards.</p>
              
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-medium text-white">FAR Compliance</div>
                  <div className="text-xs text-slate-400">Proposed FAR is within max {complianceCheck.maxFAR}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-medium text-white">Height Restrictions</div>
                  <div className="text-xs text-slate-400">Building height meets {complianceCheck.maxHeight} limit</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={20} />
                <div>
                  <div className="text-sm font-medium text-white">Setback Encroachment</div>
                  <div className="text-xs text-slate-400">Warning: Porch design encroaches on Front setback ({complianceCheck.setbacks})</div>
                </div>
              </div>
              {complianceCheck.overlay !== "None" && (
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-indigo-400 mt-0.5 shrink-0" size={20} />
                  <div>
                    <div className="text-sm font-medium text-white">Overlay Review Required</div>
                    <div className="text-xs text-slate-400">Subject to {complianceCheck.overlay} design guidelines</div>
                  </div>
                </div>
              )}
              
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
