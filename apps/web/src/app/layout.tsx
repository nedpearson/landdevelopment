import './globals.css';
import React from 'react';
import { ExperienceModeProvider } from '@/components/providers/ExperienceModeProvider';
import { AppShell } from '@/components/layout/AppShell';

import { DrilldownProvider } from '@/components/providers/DrilldownProvider';
import { CoPilotProvider } from '@/components/providers/CoPilotProvider';
import { UniversalDrilldown } from '@/components/ui/UniversalDrilldown';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ExperienceModeProvider>
          <CoPilotProvider>
            <DrilldownProvider>
              <AppShell>
                {children}
              </AppShell>
              <UniversalDrilldown />
            </DrilldownProvider>
          </CoPilotProvider>
        </ExperienceModeProvider>
      </body>
    </html>
  );
}
