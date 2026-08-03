"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Plus, Search, CheckCircle, X, Leaf, Calendar, AlertTriangle } from "lucide-react";
import { getDeveloperSites, updatePropertyEnvironmental } from "@/actions/developerActions";

export default function EnvironmentalPage() {
  const [studies, setStudies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPropId, setSelectedPropId] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadStudies();
  }, []);

  const loadStudies = async () => {
    const sites = await getDeveloperSites();
    setStudies(sites);
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredStudies = studies.filter(s =>
    s.address?.toLowerCase().includes(search.toLowerCase()) ||
    s.apn?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const envData = {
      type: formData.get("type") as string,
      firm: formData.get("firm") as string,
      status: formData.get("status") as string,
      orderDate: formData.get("orderDate") as string || "-",
      completionDate: formData.get("completionDate") as string || "-",
      findings: formData.get("findings") as string || "Pending.",
    };
    
    startTransition(() => {
      (async () => {
        if (!selectedPropId) {
          showToast("Please select a property", "error");
          return;
        }
        const res = await updatePropertyEnvironmental(selectedPropId, envData);
        if (res.success) {
          showToast("Environmental study ordered");
          setIsModalOpen(false);
          loadStudies();
        } else {
          showToast("Failed to update environmental", "error");
        }
      })();
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      "Not Started": "bg-slate-700 text-slate-300",
      "Ordered": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
      "In Review": "bg-amber-900/50 text-amber-400 border border-amber-700/50",
      "Complete": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Issue Found": "bg-red-900/50 text-red-400 border border-red-700/50",
    };
    const s = styles[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s}`}>{status || 'None'}</span>;
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
          <span>Add / Update Study</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search site or APN..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudies.map((study) => {
          const env = study.environmentalAssessment || {};
          return (
          <div key={study.id} className={`bg-slate-800 border rounded-xl p-5 transition flex flex-col ${env.status === 'Issue Found' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-slate-700 hover:border-emerald-500/50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Leaf size={18} className={env.status === 'Issue Found' ? 'text-red-400' : 'text-emerald-500'} /> 
                  {env.type || 'No Study'}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1">{study.address || study.apn}</p>
              </div>
              <div>{getStatusBadge(env.status)}</div>
            </div>
            
            <div className="space-y-3 mb-4 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Consultant</span>
                <span className="font-medium text-slate-200">{env.firm || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Ordered</span>
                <span className="text-slate-200 flex items-center gap-1"><Calendar size={14} /> {env.orderDate || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Target Completion</span>
                <span className="text-slate-200 flex items-center gap-1"><Calendar size={14} /> {env.completionDate || '-'}</span>
              </div>
            </div>

            <div className={`mt-auto pt-4 border-t ${env.status === 'Issue Found' ? 'border-red-900/30' : 'border-slate-700/50'}`}>
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                {env.status === 'Issue Found' && <AlertTriangle size={12} className="text-red-400" />}
                Findings Summary:
              </div>
              <p className={`text-sm ${env.status === 'Issue Found' ? 'text-red-300' : 'text-slate-300'}`}>
                {env.findings || '-'}
              </p>
            </div>
          </div>
        )})}
        
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
              <h2 className="text-xl font-bold text-white">Add/Update Environmental Study</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property</label>
                  <select required value={selectedPropId} onChange={e => setSelectedPropId(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-emerald-500 focus:outline-none">
                    <option value="" disabled>Select Property</option>
                    {studies.map(r => (
                      <option key={r.id} value={r.id}>{r.address || r.apn}</option>
                    ))}
                  </select>
                </div>
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
                <button type="submit" disabled={isPending} className="bg-emerald-700 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50">Order Study</button>
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
