"use client";

import React from 'react';
import { useWorkspace } from '@/components/providers/WorkspaceProvider';
import { Download, Plus, LayoutGrid, FileWarning, Search, Filter } from 'lucide-react';

interface CanonicalModuleProps {
  title: string;
  description?: string;
}

export function CanonicalModule({ title, description }: CanonicalModuleProps) {
  const { activeWorkspace } = useWorkspace();
  const Icon = activeWorkspace.icon;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2 capitalize">
              <Icon className={`w-6 h-6 ${activeWorkspace.themeColor}`} />
              {title}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {description || `Manage ${title.toLowerCase()} in your ${activeWorkspace.label} workspace.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className={`px-4 py-2 ${activeWorkspace.themeColor.replace('text-', 'bg-').replace('400', '600')} hover:opacity-90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors`}>
              <Plus className="w-4 h-4" /> New {title.replace(/s$/, '')}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
            />
          </div>
          <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col items-center justify-center h-full text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
          <FileWarning className="w-12 h-12 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-white mb-2">No {title.toLowerCase()} found</h3>
          <p className="text-sm text-center max-w-sm">
            You don't have any {title.toLowerCase()} recorded in this workspace yet. Click the button above to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
