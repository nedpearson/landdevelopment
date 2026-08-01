import './globals.css';
import React from 'react';
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
} from 'lucide-react';

export const metadata = {
  title: 'Land Intelligence OS | AI Land Investment Platform',
  description: 'Production-Grade AI-Powered Land Investment Operating System',
};

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Markets', href: '/markets', icon: Compass },
  { label: 'Discover & Map', href: '/discover', icon: MapPin },
  { label: 'Underwriting', href: '/underwriting', icon: Calculator },
  { label: 'Sellers', href: '/sellers', icon: Users },
  { label: 'Offers', href: '/offers', icon: FileCheck },
  { label: 'Due Diligence', href: '/due-diligence', icon: Briefcase },
  { label: 'Transactions', href: '/transactions', icon: Layers },
  { label: 'Buyers', href: '/buyers', icon: ShoppingBag },
  { label: 'Marketing', href: '/marketing', icon: Megaphone },
  { label: 'Portfolio', href: '/portfolio', icon: Building2 },
  { label: 'AI Command Center', href: '/ai', icon: Sparkles },
  { label: 'Training & Demo', href: '/training', icon: GraduationCap },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
        {/* Sidebar Navigation */}
        <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-900/90 flex flex-col justify-between">
          <div>
            {/* Branding Header */}
            <div className="p-5 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-950/50">
                  LI
                </div>
                <div>
                  <h1 className="font-bold text-slate-100 text-sm tracking-tight">Land Intelligence OS</h1>
                  <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">Enterprise v1.0</p>
                </div>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User & Org Workspace Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="text-slate-200 font-medium truncate">Apex Land Capital LLC</p>
              <p className="text-[10px] text-slate-400">Org: demo-tenant-01</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          <header className="h-14 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800/60 text-emerald-300">
                PROD-ACTIVE
              </span>
              <span className="text-xs text-slate-400">Target Region: Costilla, CO & Elko, NV</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">API Status: <strong className="text-emerald-400">100% Operational</strong></span>
            </div>
          </header>

          <div className="p-6 flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
