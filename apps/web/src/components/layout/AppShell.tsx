"use client";

import React from 'react';
import Link from 'next/link';
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
} from 'lucide-react';

import { UniversalSearch } from '../ui/UniversalSearch';
import { AICoPilot } from '../ui/AICoPilot';
import { ExplainScreenButton } from '../ui/ExplainScreenButton';
import { RoleSwitcher } from '../ui/RoleSwitcher';

const EXPERT_NAV_ITEMS = [
  { label: 'Landman Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Projects & Clients', href: '/projects', icon: FolderKanban },
  { label: 'Canonical Tracts', href: '/tracts', icon: MapPin },
  { label: 'Title Runsheets', href: '/runsheets', icon: FileText },
  { label: 'Ownership & NMA Math', href: '/ownership', icon: Scale },
  { label: 'Leases & HBP Analysis', href: '/leases', icon: FileCheck },
  { label: 'Curative Center', href: '/curative', icon: ShieldCheck },
  { label: 'Right-of-Way (ROW)', href: '/row', icon: Zap },
  { label: 'Renewable Site Control', href: '/renewables', icon: Sun },
  { label: 'Client Billing & Time', href: '/billing', icon: Receipt },
  { label: 'AI Command Center', href: '/ai', icon: Sparkles },
  { label: 'Training & Sandbox', href: '/training', icon: GraduationCap },
];

const SIMPLE_NAV_ITEMS = [
  { label: 'My Property', href: '/', icon: LayoutDashboard },
  { label: 'Discover Map', href: '/discover', icon: MapPin },
  { label: 'Property Report', href: '/report', icon: FileText },
  { label: 'AI Guide', href: '/ai', icon: Sparkles },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { mode, setMode } = useExperienceMode();

  const isExpert = mode === "EXPERT";
  const activeNav = isExpert ? EXPERT_NAV_ITEMS : SIMPLE_NAV_ITEMS;

  return (
    <body className="flex h-screen overflow-hidden bg-[#030303] text-slate-100 font-sans selection:bg-indigo-500/30">
      <aside className="w-[260px] shrink-0 border-r border-white/[0.04] bg-[#050505] flex flex-col justify-between relative z-20">
        <div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-white shadow-glass">
                PD
              </div>
              <div>
                <h1 className="font-semibold text-slate-100 text-sm tracking-tight">Pearson Developments</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">Land OS v2.0</p>
              </div>
            </div>

            <button
              onClick={() => setMode(isExpert ? "SIMPLE" : "EXPERT")}
              className={`w-full p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all duration-300 active:scale-[0.98] ${
                isExpert
                  ? 'bg-amber-950/20 border-amber-900/30 text-amber-500 hover:bg-amber-950/40'
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-500 hover:bg-emerald-950/40'
              }`}
            >
              <span>{isExpert ? 'Landman Pro' : 'Simple Mode'}</span>
              {isExpert ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="px-3 pb-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {activeNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] transition-all active:scale-[0.98]"
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-70" />
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
              {isExpert ? 'PRO WORKSPACE' : 'BEGINNER MODE'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <RoleSwitcher />
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
