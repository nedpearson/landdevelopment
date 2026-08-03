import './globals.css';
import React from 'react';
import { CoPilotProvider } from '@/components/providers/CoPilotProvider';
import { AppShell } from '@/components/layout/AppShell';

import { DrilldownProvider } from '@/components/providers/DrilldownProvider';
import { WorkspaceProvider } from '@/components/providers/WorkspaceProvider';
import { GlobalSearchProvider } from '@/components/providers/GlobalSearchProvider';
import { UniversalDrilldown } from '@/components/ui/UniversalDrilldown';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
