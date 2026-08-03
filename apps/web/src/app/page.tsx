'use client';

import React from 'react';
import { useWorkspace } from '@/components/providers/WorkspaceProvider';
import { LandInvestorDashboard } from '@/components/workspaces/LandInvestorDashboard';
import { LandmanDashboard } from '@/components/workspaces/LandmanDashboard';
import { CommercialBrokerDashboard } from '@/components/workspaces/CommercialBrokerDashboard';
import { PropertyManagerDashboard } from '@/components/workspaces/PropertyManagerDashboard';
import { ResidentialRealtorDashboard } from '@/components/workspaces/ResidentialRealtorDashboard';
import { DeveloperDashboard } from '@/components/workspaces/DeveloperDashboard';
import { RenewableDashboard } from '@/components/workspaces/RenewableDashboard';

export default function DashboardPage() {
  const { activeWorkspace } = useWorkspace();

  switch (activeWorkspace.type) {
    case 'LAND_INVESTOR': return <LandInvestorDashboard />;
    case 'LANDMAN_ENERGY': return <LandmanDashboard />;
    case 'COMMERCIAL_BROKER': return <CommercialBrokerDashboard />;
    case 'PROPERTY_MANAGER': return <PropertyManagerDashboard />;
    case 'RESIDENTIAL_REALTOR': return <ResidentialRealtorDashboard />;
    case 'DEVELOPER': return <DeveloperDashboard />;
    case 'RENEWABLE_ENERGY': return <RenewableDashboard />;
    default: return <LandInvestorDashboard />;
  }
}
