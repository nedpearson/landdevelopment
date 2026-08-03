"use client";

import React, { useState } from "react";
import { Plus, Search, Calendar, Clock, CheckCircle, X, MapPin } from "lucide-react";

type Entitlement = {
  id: string;
  project: string;
  type: string;
  status: "Not Started" | "Submitted" | "Under Review" | "Hearing Scheduled" | "Approved" | "Denied";
  submittedDate: string;
  targetDate: string;
  jurisdiction: string;
  progress: number;
};

const initialEntitlements: Entitlement[] = [
  { id: "1", project: "Oak Creek Dev", type: "Rezone", status: "Hearing Scheduled", submittedDate: "2024-01-15", targetDate: "2024-04-20", jurisdiction: "City of Austin", progress: 80 },
  { id: "2", project: "Pine Ridge", type: "Plat", status: "Under Review", submittedDate: "2024-02-01", targetDate: "2024-05-15", jurisdiction: "Travis County", progress: 45 },
  { id: "3", project: "Riverfront Mixed", type: "SUP", status: "Approved", submittedDate: "2023-11-10", targetDate: "2024-02-28", jurisdiction: "City of Austin", progress: 100 },
  { id: "4", project: "Sunset Logistics", type: "Variance", status: "Submitted", submittedDate: "2024-03-05", targetDate: "2024-06-30", jurisdiction: "City of Round Rock", progress: 20 },
  { id: "5", project: "Cedar Heights", type: "CUP", status: "Not Started", submittedDate: "-", targetDate: "2024-08-15", jurisdiction: "Williamson County", progress: 0 },
];

export default function EntitlementsPage() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>(initialEntitlements);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredEntitlements = entitlements.filter(e =>
    e.project.toLowerCase().includes(search.toLowerCase()) ||
    e.jurisdiction.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecord: Entitlement = {
      id: Math.random().toString(36).substring(7),
      project: formData.get("project") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as any,
      submittedDate: formData.get("submittedDate") as string || "-",
      targetDate: formData.get("targetDate") as string,
      jurisdiction: formData.get("jurisdiction") as string,
      progress: formData.get("status") === "Approved" ? 100 : formData.get("status") === "Not Started" ? 0 : 30,
    };
    setIsModalOpen(false);
    showToast("Entitlements persistence coming soon");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Not Started": "bg-slate-700 text-slate-300",
      "Submitted": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
      "Under Review": "bg-amber-900/50 text-amber-400 border border-amber-700/50",
      "Hearing Scheduled": "bg-purple-900/50 text-purple-400 border border-purple-700/50",
      "Approved": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Denied": "bg-red-900/50 text-red-400 border border-red-700/50",
    }[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles}`}>{status}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Entitlements Tracker</h1>
          <p className="text-slate-400 mt-1">Manage zoning, plats, and permits timelines</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Entitlement</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search project or jurisdiction..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Project & Jurisdiction</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Timeline</th>
                <th className="p-4 font-semibold w-48">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredEntitlements.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-medium text-white">{item.project}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {item.jurisdiction}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-300">{item.type}</span>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="p-4">
                    <div className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                      <Clock size={12} /> Sub: {item.submittedDate}
                    </div>
                    <div className="text-xs text-white flex items-center gap-1">
                      <Calendar size={12} className="text-amber-400" /> Target: {item.targetDate}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{item.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Timeline View</h3>
        <div className="space-y-4">
          {filteredEntitlements.map(item => (
            <div key={`timeline-${item.id}`} className="flex items-center gap-4">
              <div className="w-48 text-sm truncate text-slate-300">{item.project} - {item.type}</div>
              <div className="flex-1 h-8 bg-slate-900 rounded relative">
                {item.status !== "Not Started" && (
                  <div 
                    className={`absolute h-6 top-1 rounded flex items-center px-2 text-[10px] font-bold text-white/90 ${item.status === 'Approved' ? 'bg-emerald-600/80' : 'bg-amber-600/80'}`}
                    style={{ 
                      left: `${Math.random() * 20}%`, 
                      width: `${40 + Math.random() * 40}%` // Mocked lengths for Gantt
                    }}
                  >
                    {item.status}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Add Entitlement</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                  <input required name="project" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                    <select required name="type" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                      <option>Rezone</option>
                      <option>Variance</option>
                      <option>SUP</option>
                      <option>Plat</option>
                      <option>CUP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Jurisdiction</label>
                    <input required name="jurisdiction" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select required name="status" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none">
                    <option>Not Started</option>
                    <option>Submitted</option>
                    <option>Under Review</option>
                    <option>Hearing Scheduled</option>
                    <option>Approved</option>
                    <option>Denied</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Submitted Date</label>
                    <input name="submittedDate" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Target Date</label>
                    <input required name="targetDate" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition">Save Entitlement</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-in slide-in-from-bottom-5 ${toast.type === 'success' ? 'bg-amber-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
