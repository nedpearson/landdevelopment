"use client";

import React, { useState } from "react";
import { Plus, Search, CheckCircle, X, Users, Phone, Mail, FileText } from "lucide-react";

type Consultant = {
  id: string;
  name: string;
  firm: string;
  discipline: string;
  phone: string;
  email: string;
  contractAmount: number;
  status: "Active" | "Contracted" | "Complete";
};

const initialConsultants: Consultant[] = [
  { id: "1", name: "Sarah Jenkins", firm: "Apex Engineering", discipline: "Civil Engineer", phone: "555-0123", email: "sarah.j@apexeng.com", contractAmount: 125000, status: "Active" },
  { id: "2", name: "Michael Chang", firm: "Urban Mobility Partners", discipline: "Traffic", phone: "555-0199", email: "mchang@ump.net", contractAmount: 45000, status: "Complete" },
  { id: "3", name: "Elena Rodriguez", firm: "EcoSolutions Inc", discipline: "Environmental", phone: "555-0245", email: "elena@ecosolutions.com", contractAmount: 28000, status: "Active" },
  { id: "4", name: "David Thorne", firm: "Thorne & Associates", discipline: "Architect", phone: "555-0377", email: "dthorne@thorne-arch.com", contractAmount: 350000, status: "Contracted" },
  { id: "5", name: "Lisa Wong", firm: "Wong Legal Group", discipline: "Attorney", phone: "555-0412", email: "lwong@wonglegal.com", contractAmount: 75000, status: "Active" },
  { id: "6", name: "James Smith", firm: "Accurate Surveys", discipline: "Surveyor", phone: "555-0555", email: "jsmith@accuratesurveys.com", contractAmount: 15000, status: "Complete" },
];

export default function ConsultantsPage() {
  const [consultants, setConsultants] = useState<Consultant[]>(initialConsultants);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredConsultants = consultants.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.firm.toLowerCase().includes(search.toLowerCase()) ||
    c.discipline.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newConsultant: Consultant = {
      id: Math.random().toString(36).substring(7),
      name: formData.get("name") as string,
      firm: formData.get("firm") as string,
      discipline: formData.get("discipline") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      contractAmount: Number(formData.get("contractAmount")),
      status: formData.get("status") as any,
    };
    setIsModalOpen(false);
    showToast("Consultants persistence coming soon");
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      "Contracted": "bg-slate-700 text-slate-300",
      "Active": "bg-emerald-900/50 text-emerald-400 border border-emerald-700/50",
      "Complete": "bg-sky-900/50 text-sky-400 border border-sky-700/50",
    }[status] || "bg-slate-700 text-slate-300";

    return <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles}`}>{status}</span>;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Consultants & Team</h1>
          <p className="text-slate-400 mt-1">Manage external partners, contracts, and contact info</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} />
          <span>Add Consultant</span>
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search name, firm, or discipline..."
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
                <th className="p-4 font-semibold">Consultant & Firm</th>
                <th className="p-4 font-semibold">Discipline</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold text-right">Contract Amt</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredConsultants.map((consultant) => (
                <tr key={consultant.id} className="hover:bg-slate-700/30 transition">
                  <td className="p-4">
                    <div className="font-medium text-white flex items-center gap-2">
                      <Users size={16} className="text-indigo-400" /> {consultant.name}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">{consultant.firm}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-300 bg-slate-900 border border-slate-700 px-2 py-1 rounded">
                      {consultant.discipline}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${consultant.email}`} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        <Mail size={12} /> {consultant.email}
                      </a>
                      <a href={`tel:${consultant.phone}`} className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-1">
                        <Phone size={12} /> {consultant.phone}
                      </a>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium text-slate-200">{formatCurrency(consultant.contractAmount)}</div>
                  </td>
                  <td className="p-4 text-center">
                    {getStatusBadge(consultant.status)}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => showToast(`Sent message to ${consultant.name}`)}
                      className="text-slate-400 hover:text-indigo-400 transition p-1"
                      title="View Contract"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredConsultants.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No consultants found matching "{search}"</td>
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
              <h2 className="text-xl font-bold text-white">Add Consultant</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Consultant Name</label>
                  <input required name="name" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Firm</label>
                  <input required name="firm" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Discipline</label>
                  <select required name="discipline" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                    <option>Civil Engineer</option>
                    <option>Traffic</option>
                    <option>Environmental</option>
                    <option>Architect</option>
                    <option>Attorney</option>
                    <option>Surveyor</option>
                    <option>Geotech</option>
                    <option>Landscape Architect</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select required name="status" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none">
                    <option>Contracted</option>
                    <option>Active</option>
                    <option>Complete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input required name="phone" type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input required name="email" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Contract Amount ($)</label>
                  <input required name="contractAmount" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-indigo-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition">Save Consultant</button>
              </div>
            </form>
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
