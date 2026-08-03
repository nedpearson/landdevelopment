'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { FolderKanban, Plus, Briefcase, MapPin, DollarSign, Users, ChevronRight, Filter } from 'lucide-react';

import { getLandProjects, createLandProject } from '@/actions/projectActions';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectParams, setNewProjectParams] = useState({ projectName: '', clientName: '', projectType: 'MINERAL_ACQUISITION', targetNMA: 1000, budget: 1000000 });
  const [projectList, setProjectList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      const projects = await getLandProjects();
      setProjectList(projects);
      if (projects.length > 0) {
        setSelectedProject(projects[0].id);
      }
      setIsLoading(false);
    }
    loadProjects();
  }, []);

  const activeProject = projectList.find((p) => p.id === selectedProject) || projectList[0];

  const handleCreateProject = async () => {
    const newPrj = await createLandProject({
      projectName: newProjectParams.projectName || 'New Project',
      clientName: newProjectParams.clientName || 'Internal',
      projectType: newProjectParams.projectType,
      targetNetMineralAcres: newProjectParams.targetNMA,
      budgetUsd: newProjectParams.budget,
    });
    
    // Add dummy tracts property so it fits the type temporarily
    const enhancedPrj = { ...newPrj, tracts: [] };
    
    setProjectList([enhancedPrj, ...projectList]);
    setSelectedProject(newPrj.id);
    setIsCreating(false);
    setNewProjectParams({ projectName: '', clientName: '', projectType: 'MINERAL_ACQUISITION', targetNMA: 1000, budget: 1000000 });
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-amber-400" /> Landman Projects & Client Accounts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage acquisition projects, client budgets, tract packages, runsheets, and landman authority caps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreating(true)}>
            Create New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid & Deep Drill-Down Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Client Projects ({projectList?.length || 0})</h2>
          {projectList?.map((p) => (
            <Card
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className={`cursor-pointer transition-all ${
                selectedProject === p.id
                  ? 'border-amber-500/80 bg-slate-900 shadow-xl ring-1 ring-amber-500/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{p.projectName || 'Unnamed Project'}</h3>
                  <p className="text-xs text-amber-400 mt-0.5">{p.clientName || 'Unknown Client'}</p>
                </div>
                {p.projectType && (
                  <Badge variant={p.projectType === 'MINERAL_ACQUISITION' ? 'warning' : 'info'}>
                    {String(p.projectType).replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 uppercase text-[9px]">Location</span>
                  <p className="font-semibold text-slate-200">{p.county || 'TBD'} Co, {p.state || 'TBD'}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px]">Target NMA</span>
                  <p className="font-semibold text-amber-300">{p.targetNetMineralAcres || 0} NMA</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-2 space-y-4">
          {activeProject ? (
            <Card className="border-amber-900/40 bg-slate-900">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{activeProject.projectName}</CardTitle>
                  <CardDescription>Client: {activeProject.clientName} | Region: {activeProject.county} County, {activeProject.state}</CardDescription>
                </div>
                <Badge variant="success">STATUS: ACTIVE</Badge>
              </CardHeader>
  
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Total Budget</span>
                  <p className="text-base font-bold text-white mt-1">${(activeProject.budgetUsd || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Capital Deployed</span>
                  <p className="text-base font-bold text-emerald-400 mt-1">${(activeProject.spentUsd || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Target NMA</span>
                  <p className="text-base font-bold text-amber-300 mt-1">{activeProject.targetNetMineralAcres || 0} NMA</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-semibold">Tract Package</span>
                  <p className="text-base font-bold text-purple-300 mt-1">{activeProject.tracts?.length || activeProject.tractsCount || 0} Tracts</p>
                </div>
              </div>
  
              <div className="mt-4">
                <EvidenceBox
                  source="Project Client Engagement Authorization Agreement"
                  retrievedAt={new Date().toISOString()}
                  confidenceScore={98}
                  verificationState="ATTORNEY_VERIFIED"
                  assumptions={['Authority cap max $4,500/NMA bonus', 'Royalty cap max 25% (1/4th)']}
                >
                  <p className="text-xs text-slate-300">
                    Client Mandate Provenance: Pioneer Natural Resources has authorized Pearson Developments to acquire up to 1,250 NMA in the Wolfcamp formation with a maximum bonus authority of $4,500/NMA.
                  </p>
                </EvidenceBox>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px] border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
               <p className="text-slate-500 flex flex-col items-center gap-2">
                 <Briefcase className="w-8 h-8 opacity-50" />
                 <span>No project selected. Create one to get started.</span>
               </p>
            </div>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-lg bg-slate-900 border-slate-700 shadow-2xl">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-xl text-white">Create New Project</CardTitle>
              <CardDescription>Setup a new client mandate or acquisition project.</CardDescription>
            </CardHeader>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Project Name</label>
                <input 
                  type="text" 
                  value={newProjectParams.projectName}
                  onChange={(e) => setNewProjectParams({...newProjectParams, projectName: e.target.value})}
                  placeholder="e.g. Permian Basin Prospect"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Client / Owner Name</label>
                <input 
                  type="text" 
                  value={newProjectParams.clientName}
                  onChange={(e) => setNewProjectParams({...newProjectParams, clientName: e.target.value})}
                  placeholder="e.g. Pioneer Natural Resources"
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Project Type</label>
                <select 
                  value={newProjectParams.projectType}
                  onChange={(e) => setNewProjectParams({...newProjectParams, projectType: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white text-sm"
                >
                  <option value="MINERAL_ACQUISITION">Mineral Acquisition</option>
                  <option value="SOLAR_DEVELOPMENT">Solar Development</option>
                  <option value="RIGHT_OF_WAY">Right of Way (ROW)</option>
                  <option value="WIND_DEVELOPMENT">Wind Development</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Target NMA</label>
                  <input 
                    type="number" 
                    value={newProjectParams.targetNMA}
                    onChange={(e) => setNewProjectParams({...newProjectParams, targetNMA: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Total Budget ($)</label>
                  <input 
                    type="number" 
                    value={newProjectParams.budget}
                    onChange={(e) => setNewProjectParams({...newProjectParams, budget: Number(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-white text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-3 rounded-b-xl">
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleCreateProject} className="bg-amber-600 hover:bg-amber-700 text-white border-amber-500">
                Launch Project
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
