"use client";

import React, { useState } from "react";
import { Plus, Search, CheckCircle, X, Compass, Activity, FileCheck2 } from "lucide-react";

type EngItem = {
  id: string;
  project: string;
  discipline: string;
  firm: string;
  phase: "Concept" | "Schematic" | "Design Dev" | "Construction Docs";
  status: "Drafting" | "Internal Review" | "Submitted to City" | "Approved" | "Revisions Required";
  percentComplete: number;
  submissionDate: string;
};

const initialItems: EngItem[] = [
  { id: "1", project: "Oak Creek Dev", discipline: "Civil", firm: "Apex Engineering", phase: "Construction Docs", status: "Submitted to City", percentComplete: 100, submissionDate: "2024-04-10" },
  { id: "2", project: "Oak Creek Dev", discipline: "Structural", firm: "SteelCore", phase: "Construction Docs", status: "Internal Review", percentComplete: 95, submissionDate: "2024-04-20" },
  { id: "3", project: "Pine Ridge", discipline: "Civil", firm: "Apex Engineering", phase: "Schematic", status: "Drafting", percentComplete: 40, submissionDate: "2024-06-15" },
  { id: "4", project: "Sunset Industrial", discipline: "MEP", firm: "Current Systems", phase: "Design Dev", status: "Revisions Required", percentComplete: 85, submissionDate: "2024-03-28" },
  { id: "5", project: "Riverfront Mixed", discipline: "Geotech", firm: "TerraFirma", phase: "Concept", status: "Approved", percentComplete: 100, submissionDate: "2024-01-15" },
];

export default function EngineeringPage() {
  const [items, setItems] = useState<EngItem[]>(initialItems);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredItems = items.filter(i =>
    i.project.toLowerCase().includes(search.toLowerCase()) ||
    i.discipline.toLowerCase().includes(search.toLowerCase()) ||
    i.firm.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: EngItem = {
      id: Math.random().toString(36).substring(7),
      project: formData.get("project") as string,
      discipline: formData.get("discipline") as string,
      firm: formData.get("firm") as string,
      phase: formData.get("phase") as any,
      status: formData.get("status") as any,
      percentComplete: Number(formData.get("percentComplete")),
      submissionDate: formData.get("submissionDate") as string,
    };
    setItems([newItem, ...items]);
    setIsModalOpen(false);
    showToast("Engineering item added");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Drafting": "bg-slate-700 text-slate-300",
      "Internal Review": "bg-purple-900/50 text-purple-400 border border-purple-700/50",
      "Submitted to City": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
      "Approved": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Revisions Required": "bg-red-900/50 text-red-400 border border-red-700/50",
    }[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles}`}>{status}</span>;
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "Concept": return <Compass size={14} className="text-amber-400" />;
      case "Schematic": return <Activity size={14} className="text-indigo-400" />;
      case "Design Dev": return <Activity size={14} className="text-indigo-400" />;
      case "Construction Docs": return <FileCheck2 size={14} className="text-emerald-400" />;
      default: return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Engineering Coordination</h1>
          <p className="text-slate-400 mt-1">Track design phases, document progress, and submissions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Engineering Item</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search project or discipline..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
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
                <th className="p-4 font-semibold">Project & Firm</th>
                <th className="p-4 font-semibold">Discipline & Phase</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold w-48">Progress</th>
                <th className="p-4 font-semibold text-right">Target Submission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white">{item.project}</div>
                    <div className="text-sm text-slate-400 mt-1">{item.firm}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-200">{item.discipline}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      {getPhaseIcon(item.phase)} {item.phase}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.percentComplete === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          style={{ width: `${item.percentComplete}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{item.percentComplete}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-sm font-medium text-slate-300">{item.submissionDate}</div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">No engineering items found matching "{search}"</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Add Engineering Item</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                  <input required name="project" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Discipline</label>
                  <select required name="discipline" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option>Civil</option>
                    <option>Structural</option>
                    <option>MEP</option>
                    <option>Geotech</option>
                    <option>Landscape</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Firm</label>
                  <input required name="firm" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phase</label>
                  <select required name="phase" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option>Concept</option>
                    <option>Schematic</option>
                    <option>Design Dev</option>
                    <option>Construction Docs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select required name="status" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none">
                    <option>Drafting</option>
                    <option>Internal Review</option>
                    <option>Submitted to City</option>
                    <option>Approved</option>
                    <option>Revisions Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">% Complete</label>
                  <input required name="percentComplete" type="number" min="0" max="100" defaultValue="0" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Submission</label>
                  <input required name="submissionDate" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">Save Engineering Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-blue-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
