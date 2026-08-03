'use client';

import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, X, CheckCircle, FileText, ChevronRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  type: string;
  state: string;
  county: string;
  targetAcres: number;
  budget: number;
  status: 'Active' | 'Complete' | 'On Hold';
}

const initialProjects: Project[] = [
  { id: '1', name: 'Permian Alpha', client: 'ExxonMobil', type: 'Lease Acquisition', state: 'TX', county: 'Midland', targetAcres: 5000, budget: 15000000, status: 'Active' },
  { id: '2', name: 'Eagle Ford Extension', client: 'EOG Resources', type: 'MOR', state: 'TX', county: 'Karnes', targetAcres: 2500, budget: 3500000, status: 'Active' },
  { id: '3', name: 'Marcellus Phase 3', client: 'Chesapeake Energy', type: 'Title Runsheet', state: 'PA', county: 'Washington', targetAcres: 12000, budget: 1250000, status: 'Complete' },
  { id: '4', name: 'Bakken Infill', client: 'Continental Resources', type: 'Lease Acquisition', state: 'ND', county: 'McKenzie', targetAcres: 3500, budget: 8000000, status: 'On Hold' },
  { id: '5', name: 'Haynesville Expansion', client: 'Comstock Resources', type: 'ROW', state: 'LA', county: 'DeSoto', targetAcres: 150, budget: 850000, status: 'Active' },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(false);
    showToast('Project created successfully');
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Land Projects</h1>
          <p className="text-slate-400">Manage energy landman projects and objectives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={20} />
          Create Project
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search projects or clients..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Project Name</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Target Acres</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${project.name}`)}>
                  <td className="px-6 py-4 font-medium text-emerald-400">{project.name}</td>
                  <td className="px-6 py-4">{project.client}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs">{project.type}</span>
                  </td>
                  <td className="px-6 py-4">{project.county}, {project.state}</td>
                  <td className="px-6 py-4">{project.targetAcres.toLocaleString()}</td>
                  <td className="px-6 py-4">${project.budget.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                      project.status === 'Complete' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white" onClick={(e) => { e.stopPropagation(); showToast('Menu opened'); }}>
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Create New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Project Name</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Client</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Project Type</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none">
                    <option>Lease Acquisition</option>
                    <option>MOR</option>
                    <option>SOR</option>
                    <option>ROW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none">
                    <option>Active</option>
                    <option>On Hold</option>
                    <option>Complete</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">County</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Target Acres</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Budget ($)</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none" required />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Save Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
        } text-white animate-fade-in-up`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
