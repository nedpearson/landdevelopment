"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Search,
  LayoutDashboard,
  MapPin,
  Home,
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Users,
  LineChart,
  Settings,
  Layers,
  ChevronRight,
} from 'lucide-react';

import { UniversalSearch } from '../ui/UniversalSearch';
import { AICoPilot } from '../ui/AICoPilot';
import { ExplainScreenButton } from '../ui/ExplainScreenButton';
import { WorkspaceSwitcher } from '../ui/WorkspaceSwitcher';
import { useWorkspace } from '../providers/WorkspaceProvider';
import { useCoPilot } from '../providers/CoPilotProvider';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspace();
  const { setIsOpen: setCopilotOpen } = useCoPilot();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const activeNav = activeWorkspace.navigation;
  const WorkspaceIcon = activeWorkspace.icon;

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] w-full max-w-full overflow-hidden bg-[#030303] text-slate-100 font-sans relative selection:bg-indigo-500/30">
      {/* ────────────────── MOBILE SLIDE-OVER DRAWER ────────────────── */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div 
        className={`fixed inset-y-0 left-0 z-50 w-[82%] max-w-[320px] bg-[#070707] border-r border-white/[0.08] shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden pt-safe pb-safe ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Drawer Header */}
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-[#0a0a0a]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glass">
                <WorkspaceIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-100 text-sm tracking-tight leading-tight">Land Intelligence OS</h2>
                <p className={`text-[10px] font-mono tracking-widest uppercase mt-0.5 ${activeWorkspace.themeColor}`}>
                  {activeWorkspace.label}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-white/[0.06] rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Workspace Switcher */}
          <div className="p-3 border-b border-white/[0.06] bg-[#050505]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mb-2 px-1">Active Persona</p>
            <WorkspaceSwitcher />
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {activeNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'opacity-70'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/[0.06] bg-[#050505] space-y-3 shrink-0 safe-area-bottom">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setCopilotOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl text-indigo-300 text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Launch AI Co-Pilot</span>
            </button>
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                <span className="font-medium">System Online</span>
              </div>
              <span className="font-mono text-[10px] text-slate-600">v2.4 Mobile</span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────── DESKTOP SIDEBAR ────────────────── */}
      <aside className="hidden lg:flex w-[260px] shrink-0 border-r border-white/[0.04] bg-[#050505] flex-col justify-between relative z-20">
        <div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center font-bold text-white shadow-glass">
                <WorkspaceIcon className="w-5 h-5 text-white/90" />
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

      {/* ────────────────── MAIN APP WRAPPER ────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#030303] relative z-10 w-full">
        {/* Mobile Header (lg:hidden) */}
        <header className="lg:hidden h-14 pt-safe border-b border-white/[0.06] bg-[#050505]/95 backdrop-blur-2xl px-3 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 text-sm tracking-tight">LandOS</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] ${activeWorkspace.themeColor}`}>
                {activeWorkspace.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={triggerSearch}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <WorkspaceSwitcher compact={true} />
          </div>
        </header>

        {/* Desktop Header (hidden lg:flex) */}
        <header className="hidden lg:flex h-[60px] border-b border-white/[0.04] bg-[#030303]/80 backdrop-blur-xl px-6 items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] text-slate-400 tracking-wide uppercase">
              {activeWorkspace.label}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <WorkspaceSwitcher />
            <ExplainScreenButton />
            <button 
              onClick={triggerSearch}
              className="flex items-center gap-2 px-3 py-1.5 glass-button rounded-lg text-slate-400 hover:text-slate-200 text-sm group"
            >
              <Search className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span>Search...</span>
              <div className="flex items-center gap-0.5 ml-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <kbd className="bg-white/10 rounded px-1.5 text-[10px] font-sans">⌘</kbd>
                <kbd className="bg-white/10 rounded px-1.5 text-[10px] font-sans">K</kbd>
              </div>
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-8 pb-32 sm:pb-28 lg:pb-8 animate-fade-in w-full touch-pan-y overscroll-y-contain">
          {children}
        </div>

        {/* ────────────────── MOBILE BOTTOM DOCK ────────────────── */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070707]/95 backdrop-blur-2xl border-t border-white/[0.08] px-3 pt-1.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center justify-around shadow-2xl safe-area-bottom">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
              pathname === '/' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Home</span>
          </Link>

          {/* Map */}
          <Link
            href="/map"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
              pathname === '/map' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-5 h-5 mb-0.5" />
            <span>Map</span>
          </Link>

          {/* AI Co-Pilot Floating Center Trigger */}
          <button
            onClick={() => setCopilotOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-full shadow-lg shadow-indigo-600/30 border border-indigo-400/40 hover:scale-105 active:scale-95 transition-all"
            aria-label="Open AI Co-Pilot"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Properties */}
          <Link
            href="/properties"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-all ${
              pathname === '/properties' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>Properties</span>
          </Link>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-slate-400 hover:text-slate-200 transition-all"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>Menu</span>
          </button>
        </nav>
      </main>

      <AICoPilot />
      
      {/* Global Modals */}
      <UniversalSearch />
    </div>
  );
}
