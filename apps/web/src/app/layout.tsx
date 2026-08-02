import './globals.css';
import React from 'react';
import { ExperienceModeProvider } from '@/components/providers/ExperienceModeProvider';
import { AppShell } from '@/components/layout/AppShell';

import { DrilldownProvider } from '@/components/providers/DrilldownProvider';
import { CoPilotProvider } from '@/components/providers/CoPilotProvider';
import { GlobalSearchProvider } from '@/components/providers/GlobalSearchProvider';
import { IndustryRoleProvider } from '@/components/providers/IndustryRoleProvider';
import { UniversalDrilldown } from '@/components/ui/UniversalDrilldown';
import { CommandPalette } from '@/components/ui/CommandPalette';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ExperienceModeProvider>
          <IndustryRoleProvider>
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
          </IndustryRoleProvider>
        </ExperienceModeProvider>
      </body>
    </html>
  );
}
