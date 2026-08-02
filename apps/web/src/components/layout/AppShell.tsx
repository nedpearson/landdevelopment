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
    <body className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-900/90 flex flex-col justify-between">
        <div>
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-950/50">
                PD
              </div>
              <div>
                <h1 className="font-bold text-slate-100 text-sm tracking-tight">Pearson Developments</h1>
                <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Land OS v2.0</p>
              </div>
            </div>

            <button
              onClick={() => setMode(isExpert ? "SIMPLE" : "EXPERT")}
              className={`w-full p-2 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                isExpert
                  ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
              }`}
            >
              <span>{isExpert ? '🤠 Landman Pro Mode' : '🌱 Simple Mode'}</span>
              {isExpert ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
            {activeNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isExpert ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
          <div className="truncate">
            <p className="text-slate-200 font-medium truncate">Pearson Developments</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
        <header className="h-14 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
              isExpert
                ? 'bg-amber-950/80 border-amber-800/60 text-amber-300'
                : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
            }`}>
              {isExpert ? 'PROFESSIONAL LANDMAN DASHBOARD' : 'BEGINNER MODE: SAFE LEARNING'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <RoleSwitcher />
            <ExplainScreenButton />
            <button 
              onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <span>Search Land OS...</span>
              <div className="flex items-center gap-0.5 ml-2">
                <kbd className="bg-slate-900 border border-slate-700 rounded px-1 text-[10px] font-mono">⌘</kbd>
                <kbd className="bg-slate-900 border border-slate-700 rounded px-1 text-[10px] font-mono">K</kbd>
              </div>
            </button>
          </div>
        </header>

        <div className="p-6 flex-1">{children}</div>
      </main>

      <AICoPilot />
      
      {/* Global Modals */}
      <UniversalSearch />
    </body>
  );
}
