import './globals.css';
import React from 'react';
import { CoPilotProvider } from '@/components/providers/CoPilotProvider';
import { AppShell } from '@/components/layout/AppShell';

import { DrilldownProvider } from '@/components/providers/DrilldownProvider';
import { WorkspaceProvider } from '@/components/providers/WorkspaceProvider';
import { GlobalSearchProvider } from '@/components/providers/GlobalSearchProvider';
import { UniversalDrilldown } from '@/components/ui/UniversalDrilldown';
import { CommandPalette } from '@/components/ui/CommandPalette';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Land Intelligence OS',
  description: 'AI-Powered Land Development & Intelligence Platform',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030303',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark h-full">
      <body className="h-full bg-[#030303] text-slate-100 font-sans antialiased selection:bg-indigo-500/30 overflow-hidden">
        <WorkspaceProvider>
          <CoPilotProvider>
            <DrilldownProvider>
              <GlobalSearchProvider>
                <AppShell>
                  {children}
                </AppShell>
                <UniversalDrilldown />
                <CommandPalette />
              </GlobalSearchProvider>
            </DrilldownProvider>
          </CoPilotProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
