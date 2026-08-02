"use server";

import { EntityType } from "@/components/providers/DrilldownProvider";
// import db from '@land-intelligence/database'; // Assuming Prisma client is here in a real app

export interface SearchResult {
  id: string;
  type: EntityType;
  label: string;
  subtitle?: string;
}

export async function searchDatabase(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const lowerQuery = query.toLowerCase();

  // MOCK IMPLEMENTATION FOR UNIVERSAL SEARCH
  // In a production app, you would execute parallel Prisma queries:
  // const properties = await db.property.findMany({ where: { OR: [{ apn: { contains: query } }, { ownerName: { contains: query } }] } })
  
  const mockDatabase: SearchResult[] = [
    { id: "prop-101", type: "PROPERTY", label: "APN 14-88-299", subtitle: "24.5 Acres • Owned by Texas Land Trust" },
    { id: "prop-102", type: "PROPERTY", label: "APN 14-88-300", subtitle: "10.0 Acres • Owned by Smith Enterprises LLC" },
    { id: "owner-777", type: "OWNER", label: "Smith Enterprises LLC", subtitle: "Owns 4 Properties in Travis County" },
    { id: "owner-778", type: "OWNER", label: "Texas Land Trust", subtitle: "Owns 12 Properties" },
    { id: "lease-12", type: "LEASE", label: "ExxonMobil Oil & Gas Lease", subtitle: "Active • Primary Term ends 2028" },
    { id: "doc-55", type: "DOCUMENT", label: "Warranty Deed - Smith", subtitle: "Recorded 2023-04-12" },
  ];

  return mockDatabase.filter(
    (item) => item.label.toLowerCase().includes(lowerQuery) || item.subtitle?.toLowerCase().includes(lowerQuery)
  );
}
