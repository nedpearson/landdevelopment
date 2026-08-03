"use client";

import React, { useState } from "react";
import { Plus, Search, CheckCircle, X, Leaf, Calendar, AlertTriangle } from "lucide-react";

type EnvStudy = {
  id: string;
  type: string;
  site: string;
  status: "Not Started" | "Ordered" | "In Review" | "Complete" | "Issue Found";
  firm: string;
  orderDate: string;
  completionDate: string;
  findings: string;
};

const initialStudies: EnvStudy[] = [
  { id: "1", type: "Phase I ESA", site: "Oak Creek Dev", status: "Complete", firm: "EcoSolutions Inc", orderDate: "2024-01-10", completionDate: "2024-02-15", findings: "No Recognized Environmental Conditions (RECs) found." },
  { id: "2", type: "Phase II ESA", site: "Sunset Industrial", status: "In Review", firm: "EnviroTech", orderDate: "2024-03-05", completionDate: "2024-04-20", findings: "Awaiting lab results on soil samples." },
  { id: "3", type: "Wetlands Delineation", site: "Pine Ridge", status: "Issue Found", firm: "Watermark Consulting", orderDate: "2023-11-20", completionDate: "2024-01-05", findings: "0.5 acres of jurisdictional wetlands identified in NW corner." },
  { id: "4", type: "Threatened Species", site: "Riverfront Mixed", status: "Ordered", firm: "BioHabitats", orderDate: "2024-04-01", completionDate: "2024-05-15", findings: "Surveying for Golden-cheeked Warbler habitat." },
  { id: "5", type: "Cultural Resources", site: "Cedar Heights", status: "Not Started", firm: "Heritage Associates", orderDate: "-", completionDate: "-", findings: "Pending historical records review." },
];

export default function EnvironmentalPage() {
  const [studies, setStudies] = useState<EnvStudy[]>(initialStudies);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredStudies = studies.filter(s =>
    s.site.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStudy: EnvStudy = {
      id: Math.random().toString(36).substring(7),
      type: formData.get("type") as string,
      site: formData.get("site") as string,
      firm: formData.get("firm") as string,
      status: formData.get("status") as any,
      orderDate: formData.get("orderDate") as string || "-",
      completionDate: formData.get("completionDate") as string || "-",
      findings: formData.get("findings") as string || "Pending.",
    };
    setStudies([newStudy, ...studies]);
    setIsModalOpen(false);
    showToast("Environmental study ordered");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Not Started": "bg-slate-700 text-slate-300",
      "Ordered": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
      "In Review": "bg-amber-900/50 text-amber-400 border border-amber-700/50",
      "Complete": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Issue Found": "bg-red-900/50 text-red-400 border border-red-700/50",
    }[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles}`}>{status}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Environmental Studies</h1>
          <p className="text-slate-400 mt-1">Track site assessments, wildlife, and cultural reports</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Order Study</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search site or study type..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudies.map((study) => (
          <div key={study.id} className={`bg-slate-800 border rounded-xl p-5 transition flex flex-col ${study.status === 'Issue Found' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700 hover:border-emerald-500/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Leaf size={18} className={study.status === 'Issue Found' ? 'text-red-400' : 'text-emerald-500'} /> 
                  {study.type}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1">{study.site}</p>
              </div>
              <div>{getStatusBadge(study.status)}</div>
            </div>
            
            <div className="space-y-3 mb-4 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Consultant</span>
                <span className="font-medium text-slate-200">{study.firm}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ordered</span>
                <span className="text-slate-200 flex items-center gap-1"><Calendar size={14} /> {study.orderDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Target Completion</span>
                <span className="text-slate-200 flex items-center gap-1"><Calendar size={14} /> {study.completionDate}</span>
              </div>
            </div>

            <div className={`mt-auto pt-4 border-t ${study.status === 'Issue Found' ? 'border-red-900/30' : 'border-slate-700/50'}`}>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                {study.status === 'Issue Found' && <AlertTriangle size={12} className="text-red-400" />}
                Findings Summary:
              </div>
              <p className={`text-sm ${study.status === 'Issue Found' ? 'text-red-300' : 'text-slate-300'}`}>
                {study.findings}
              </p>
            </div>
          </div>
        ))}
        
        {filteredStudies.length === 0 && (
          <div className="col-span-full p-8 text-center text-slate-400 bg-slate-800 rounded-xl border border-slate-700">
            No environmental studies found matching "{search}"
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Order Environmental Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Study Type</label>
                  <select required name="type" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                    <option>Phase I ESA</option>
                    <option>Phase II ESA</option>
                    <option>Wetlands Delineation</option>
                    <option>Threatened Species</option>
                    <option>Cultural Resources</option>
                    <option>Geotech Report</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Site</label>
                  <input required name="site" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Consulting Firm</label>
                  <input required name="firm" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select required name="status" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                    <option>Not Started</option>
                    <option>Ordered</option>
                    <option>In Review</option>
                    <option>Complete</option>
                    <option>Issue Found</option>
                  </select>
                </div>
                <div></div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Order Date</label>
                  <input name="orderDate" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Target Completion</label>
                  <input name="completionDate" type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Initial Findings / Notes</label>
                  <textarea name="findings" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition">Order Study</button>
              </div>
            </form>
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
