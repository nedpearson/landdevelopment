'use client';

import './globals.css';
import React, { useState } from 'react';
import Link from 'next/link';
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

const INVESTOR_NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Markets', href: '/markets', icon: Compass },
  { label: 'Discover & Map', href: '/discover', icon: MapPin },
  { label: 'Underwriting', href: '/underwriting', icon: Calculator },
  { label: 'Sellers CRM', href: '/sellers', icon: Users },
  { label: 'Offers', href: '/offers', icon: FileCheck },
  { label: 'Due Diligence', href: '/due-diligence', icon: Briefcase },
  { label: 'Transactions', href: '/transactions', icon: Layers },
  { label: 'Buyers CRM', href: '/buyers', icon: ShoppingBag },
  { label: 'Marketing', href: '/marketing', icon: Megaphone },
  { label: 'Portfolio', href: '/portfolio', icon: Building2 },
];

const LANDMAN_NAV_ITEMS = [
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [landmanMode, setLandmanMode] = useState(true);

  const activeNav = landmanMode ? LANDMAN_NAV_ITEMS : INVESTOR_NAV_ITEMS;

  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-900/90 flex flex-col justify-between">
          <div>
            {/* Branding Header & Mode Switcher */}
            <div className="p-4 border-b border-slate-800/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-950/50">
                  LI
                </div>
                <div>
                  <h1 className="font-bold text-slate-100 text-sm tracking-tight">Land Intelligence OS</h1>
                  <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Dual-Mode v2.0</p>
                </div>
              </div>

              {/* Mode Switcher Toggle */}
              <button
                onClick={() => setLandmanMode(!landmanMode)}
                className={`w-full p-2 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                  landmanMode
                    ? 'bg-amber-950/60 border-amber-800/80 text-amber-300'
                    : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
                }`}
              >
                <span>{landmanMode ? '🤠 Landman Mode Active' : '📈 Land Investor Mode'}</span>
                {landmanMode ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>

            {/* Nav Links */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
              {activeNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${landmanMode ? 'text-amber-400' : 'text-emerald-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User & Org Workspace Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="text-slate-200 font-medium truncate">Apex Energy & Land Capital</p>
              <p className="text-[10px] text-slate-400">Client: Pioneer Natural Resources</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          <header className="h-14 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                landmanMode
                  ? 'bg-amber-950/80 border-amber-800/60 text-amber-300'
                  : 'bg-emerald-950/80 border-emerald-800/60 text-emerald-300'
              }`}>
                {landmanMode ? 'LANDMAN & ENERGY OPERATIONS' : 'LAND INVESTMENT'}
              </span>
              <span className="text-xs text-slate-400">Target Region: Costilla CO & Permian Basin TX</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">Title & PostGIS Engine: <strong className="text-emerald-400">Active</strong></span>
            </div>
          </header>

          <div className="p-6 flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
