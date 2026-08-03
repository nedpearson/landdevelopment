'use server';
import { prisma } from '@land-intelligence/database';

export async function getAnalyticsData() {
  const [properties, comps] = await Promise.all([
    prisma.property.findMany({ where: { organizationId: 'org_default' } }),
    prisma.comp.findMany()
  ]);

  const compsCount = comps.length;
  const avgPricePerAcre = compsCount > 0 ? comps.reduce((acc, c) => acc + (c.pricePerAcre || 0), 0) / compsCount : 0;
  
  const propertiesCount = properties.length;
  const totalAcreage = properties.reduce((acc, p) => acc + (p.acreage || 0), 0);

  return {
    propertiesCount,
    totalAcreage,
    compsCount,
    avgPricePerAcre
  };
}
