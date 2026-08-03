"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useExperienceMode } from '@/components/providers/ExperienceModeProvider';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Calculator,
  Users,
  FileCheck,
  Briefcase,
  Layers,
  Sparkles,
  GraduationCap,
  Megaphone,
  ShoppingBag,
  Building2,
  FolderKanban,
  FileText,
  Scale,
  ShieldCheck,
  Zap,
  Sun,
  Receipt,
  ToggleLeft,
  ToggleRight,
  LineChart,
} from 'lucide-react';

import { UniversalSearch } from '../ui/UniversalSearch';
import { AICoPilot } from '../ui/AICoPilot';
import { ExplainScreenButton } from '../ui/ExplainScreenButton';
import { WorkspaceSwitcher } from '../ui/WorkspaceSwitcher';
import { useWorkspace } from '../providers/WorkspaceProvider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspace();
  const pathname = usePathname();

  const activeNav = activeWorkspace.navigation;

  return (
    <body className="flex h-screen overflow-hidden bg-[#030303] text-slate-100 font-sans selection:bg-indigo-500/30">
      <aside className="w-[260px] shrink-0 border-r border-white/[0.04] bg-[#050505] flex flex-col justify-between relative z-20">
        <div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glass">
                <activeWorkspace.icon className="w-5 h-5 text-white/90" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-100 text-[13px] tracking-tight leading-tight whitespace-nowrap">Land Intelligence OS</h1>
                <p className={`text-[10px] font-mono tracking-widest uppercase mt-0.5 ${activeWorkspace.themeColor}`}>{activeWorkspace.label}</p>
              </div>
            </div>
          </div>

          <nav className="px-3 pb-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {activeNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/[0.04] bg-[#050505] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
            <span className="text-slate-500 font-medium">System Online</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-[#030303] relative z-10">
        <header className="h-[60px] border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-xl px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-slate-400 tracking-wide uppercase">
              {activeWorkspace.label}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />
            <ExplainScreenButton />
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="flex items-center gap-2 px-3 py-1.5 glass-button rounded-lg text-slate-400 hover:text-slate-200 text-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100 transition-opacity"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Search...</span>
              <div className="flex items-center gap-0.5 ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <kbd className="bg-white/10 rounded px-1.5 text-[10px] font-sans">⌘</kbd>
                <kbd className="bg-white/10 rounded px-1.5 text-[10px] font-sans">K</kbd>
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 animate-fade-in">{children}</div>
      </main>

      <AICoPilot />
      
      {/* Global Modals */}
      <UniversalSearch />
    </body>
  );
}
