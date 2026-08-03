"use client";

import React, { useRef, useEffect } from "react";
import { useWorkspace } from "../providers/WorkspaceProvider";
import { workspaceRegistry, WorkspaceType } from "@/lib/workspace/WorkspaceRegistry";
import { ChevronDown } from "lucide-react";

export function WorkspaceSwitcher() {
  const { activeWorkspace, setWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const workspaces = Object.values(workspaceRegistry);

  const CurrentIcon = activeWorkspace.icon;

  return (
    <div className="relative z-50" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-sm text-slate-200 shadow-sm"
      >
        <CurrentIcon className={`w-4 h-4 ${activeWorkspace.themeColor}`} />
        <span className="font-medium whitespace-nowrap">{activeWorkspace.label}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 overflow-hidden animate-fade-in origin-top-right">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <span>Switch Workspace</span>
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {workspaces.map((ws) => {
              const Icon = ws.icon;
              const isActive = activeWorkspace.type === ws.type;
              return (
                <button
                  key={ws.type}
                  onClick={() => {
                    setWorkspace(ws.type);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-all ${
                    isActive 
                      ? "bg-indigo-600/10 text-white border-l-2 border-indigo-500" 
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white border-l-2 border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? ws.themeColor : "text-slate-500"}`} />
                  <span className="font-medium">{ws.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
