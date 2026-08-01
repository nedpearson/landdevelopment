'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { FolderKanban, Plus, Briefcase, MapPin, DollarSign, Users, ChevronRight, Filter } from 'lucide-react';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>('prj-101');

  const projects = [
    {
      id: 'prj-101',
      projectName: 'Permian Basin Wolfcamp Prospect',
      clientName: 'Pioneer Natural Resources',
      projectType: 'MINERAL_ACQUISITION',
      state: 'TX',
      county: 'Reeves',
      targetGrossAcres: 5000,
      targetNetMineralAcres: 1250,
      budgetUsd: 5000000,
      spentUsd: 1450000,
      status: 'ACTIVE',
      tractsCount: 18,
      runsheetsCount: 14,
      curativeCount: 3,
    },
    {
      id: 'prj-102',
      projectName: 'Costilla Solar Array Phase 1',
      clientName: 'NextEra Energy Resources',
      projectType: 'SOLAR_DEVELOPMENT',
      state: 'CO',
      county: 'Costilla',
      targetGrossAcres: 800,
      targetNetMineralAcres: 800,
      budgetUsd: 1200000,
      spentUsd: 320000,
      status: 'ACTIVE',
      tractsCount: 6,
      runsheetsCount: 6,
      curativeCount: 1,
    },
    {
      id: 'prj-103',
      projectName: 'Delaware Gas Gathering Pipeline ROW',
      clientName: 'Enterprise Products Partners',
      projectType: 'RIGHT_OF_WAY',
      state: 'TX',
      county: 'Loving',
      targetGrossAcres: 350,
      targetNetMineralAcres: 350,
      budgetUsd: 850000,
      spentUsd: 410000,
      status: 'ACTIVE',
      tractsCount: 12,
      runsheetsCount: 10,
      curativeCount: 2,
    },
  ];

  const activeProject = projects.find((p) => p.id === selectedProject) || projects[0];

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
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Create New Project
          </Button>
        </div>
      </div>

      {/* Projects Grid & Deep Drill-Down Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Client Projects ({projects.length})</h2>
          {projects.map((p) => (
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
                  <h3 className="font-bold text-white text-sm">{p.projectName}</h3>
                  <p className="text-xs text-amber-400 mt-0.5">{p.clientName}</p>
                </div>
                <Badge variant={p.projectType === 'MINERAL_ACQUISITION' ? 'warning' : 'info'}>
                  {p.projectType.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 uppercase text-[9px]">Location</span>
                  <p className="font-semibold text-slate-200">{p.county} Co, {p.state}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[9px]">Target NMA</span>
                  <p className="font-semibold text-amber-300">{p.targetNetMineralAcres} NMA</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Right Detail Panel */}
        <div className="lg:col-span-2 space-y-4">
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
                <p className="text-base font-bold text-white mt-1">${activeProject.budgetUsd.toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Capital Deployed</span>
                <p className="text-base font-bold text-emerald-400 mt-1">${activeProject.spentUsd.toLocaleString()}</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Target NMA</span>
                <p className="text-base font-bold text-amber-300 mt-1">{activeProject.targetNetMineralAcres} NMA</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Tract Package</span>
                <p className="text-base font-bold text-purple-300 mt-1">{activeProject.tractsCount} Tracts</p>
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
        </div>
      </div>
    </div>
  );
}
