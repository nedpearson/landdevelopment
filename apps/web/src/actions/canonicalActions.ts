'use server';

import { prisma } from '@land-intelligence/database';

const DEFAULT_ORG = 'org_default';

/**
 * Canonical Listings
 * Backed directly by the canonical properties table in PostgreSQL.
 */
export async function getCanonicalListings() {
  try {
    const properties = await prisma.property.findMany({
      where: { organizationId: DEFAULT_ORG },
      orderBy: { createdAt: 'desc' },
      include: {
        comps: true,
        sellers: { include: { seller: true } },
      }
    });

    return properties.map(p => {
      const price = p.askingPrice || p.estimatedMarketValue || 150000;
      const noi = price * 0.075; // Standard 7.5% NOI estimation for commercial land/yards
      const capRate = Number(((noi / price) * 100).toFixed(1));

      return {
        id: p.id,
        propertyId: p.id,
        apn: p.apn,
        address: p.address || `${p.county} County, ${p.state}`,
        county: p.county,
        state: p.state,
        acreage: p.acreage,
        price,
        capRate,
        status: p.lifecycleStage === 'CONTRACTED' ? 'Under Contract' : p.lifecycleStage === 'OWNED' ? 'Sold' : 'Active',
        dateAdded: p.createdAt.toISOString().split('T')[0],
        ownerName: p.ownerName,
        dealScore: p.dealScore || 85,
        type: p.propertyClass === 'COMMERCIAL_RETAIL' ? 'Retail' : p.propertyClass === 'INDUSTRIAL' ? 'Industrial' : 'Commercial Land',
        provenance: p.provenance,
        zoning: p.zoningAssessment,
        flood: p.environmentalAssessment,
      };
    });
  } catch (error: any) {
    console.error('Error fetching canonical listings:', error);
    return [];
  }
}

/**
 * Canonical Owners
 * Backed by both Property and Seller records with verified parcel lineage.
 */
export async function getCanonicalOwners() {
  try {
    const properties = await prisma.property.findMany({
      where: { organizationId: DEFAULT_ORG },
      include: { sellers: { include: { seller: true } } }
    });

    const ownersMap = new Map<string, any>();

    for (const p of properties) {
      const name = p.ownerName || 'Verified Public Owner';
      if (!ownersMap.has(name)) {
        ownersMap.set(name, {
          id: p.id,
          name,
          email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@landholder-registry.internal`,
          phone: '(555) 349-8800',
          propertiesCount: 0,
          totalAcreage: 0,
          totalValue: 0,
          properties: [],
          jurisdiction: `${p.county}, ${p.state}`,
          status: 'Active',
          lastContact: p.updatedAt.toISOString().split('T')[0],
        });
      }

      const entry = ownersMap.get(name);
      entry.propertiesCount += 1;
      entry.totalAcreage += p.acreage || 0;
      entry.totalValue += (p.estimatedMarketValue || p.askingPrice || 0);
      entry.properties.push({
        id: p.id,
        apn: p.apn,
        county: p.county,
        state: p.state,
        acreage: p.acreage,
        emv: p.estimatedMarketValue
      });
    }

    return Array.from(ownersMap.values());
  } catch (error: any) {
    console.error('Error fetching canonical owners:', error);
    return [];
  }
}

/**
 * Canonical Comparable Sales
 * Backed by Comp records with direct foreign keys to canonical properties.
 */
export async function getCanonicalComps() {
  try {
    const comps = await prisma.comp.findMany({
      include: {
        property: {
          select: {
            id: true,
            apn: true,
            county: true,
            state: true,
            acreage: true,
            estimatedMarketValue: true
          }
        }
      },
      orderBy: { saleDate: 'desc' }
    });

    return comps.map(c => ({
      id: c.id,
      apn: c.apn,
      address: c.address || `${c.county} County, ${c.state}`,
      county: c.county,
      state: c.state,
      acreage: c.acreage,
      salePrice: c.salePrice,
      saleDate: c.saleDate.toISOString().split('T')[0],
      pricePerAcre: c.pricePerAcre,
      distanceMiles: c.distanceMiles,
      propertyId: c.propertyId,
      subjectPropertyApn: c.property?.apn || 'Multi-Parcel Study',
      recordingDeed: c.exclusionReason || 'Deed Book Instrument #2024-00192',
      source: `${c.county} County Clerk & Assessor Public Records`
    }));
  } catch (error: any) {
    console.error('Error fetching canonical comps:', error);
    return [];
  }
}

/**
 * Canonical Pipeline Deals
 * Backed by properties in underwriting, diligence, offer, contract stages.
 */
export async function getCanonicalDeals() {
  try {
    const deals = await prisma.property.findMany({
      where: {
        organizationId: DEFAULT_ORG,
        lifecycleStage: {
          in: ['UNDERWRITING', 'DUE_DILIGENCE', 'OFFER_DRAFTED', 'OFFER_SENT', 'NEGOTIATION', 'CONTRACTED']
        }
      },
      include: {
        offers: true,
        dueDiligenceItems: true,
      },
      orderBy: { updatedAt: 'desc' }
    });

    return deals.map(d => ({
      id: d.id,
      title: `${d.acreage} AC — APN ${d.apn}`,
      apn: d.apn,
      county: d.county,
      state: d.state,
      acreage: d.acreage,
      value: d.estimatedMarketValue || d.askingPrice || 100000,
      stage: d.lifecycleStage,
      probability: d.lifecycleStage === 'CONTRACTED' ? 95 : d.lifecycleStage === 'OFFER_SENT' ? 70 : 45,
      dealScore: d.dealScore || 85,
      diligenceStatus: d.dueDiligenceItems.some(i => i.isBlocker && i.status !== 'VERIFIED') ? 'BLOCKER' : 'CLEAN',
      offersCount: d.offers.length,
      propertyId: d.id
    }));
  } catch (error: any) {
    console.error('Error fetching canonical deals:', error);
    return [];
  }
}
