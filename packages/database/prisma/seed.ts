import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Land Intelligence OS with full relational dataset...');

  // 1. Sellers
  const seller1 = await prisma.seller.upsert({
    where: { id: '11111111-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '11111111-0000-0000-0000-000000000001',
      organizationId: 'org_default',
      name: 'Estate of Henry T. Miller',
      email: 'miller.estate@example.com',
      phone: '(432) 555-0144',
      mailingAddress: '450 Midland Ave, Midland, TX 79701',
      motivationLevel: 'HIGH',
      askingPrice: 75000,
      reasonForSelling: 'Estate liquidation, inherited out of state',
      desiredTiming: '30-45 days',
      notes: ['Contacted executor Robert Miller on 10/12', 'Interested in cash quick close']
    }
  });

  const seller2 = await prisma.seller.upsert({
    where: { id: '11111111-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '11111111-0000-0000-0000-000000000002',
      organizationId: 'org_default',
      name: 'Reeves Ranch Holdings LLC',
      email: 'acquisitions@reevesranch.com',
      phone: '(512) 555-0189',
      mailingAddress: '1200 Congress Ave Ste 400, Austin, TX 78701',
      motivationLevel: 'MEDIUM',
      askingPrice: 320000,
      reasonForSelling: 'Rebalancing land portfolio',
      desiredTiming: '60 days',
      notes: ['Open to 1031 exchange timeline']
    }
  });

  const seller3 = await prisma.seller.upsert({
    where: { id: '11111111-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '11111111-0000-0000-0000-000000000003',
      organizationId: 'org_default',
      name: 'Clara & Donald Jenkins',
      email: 'jenkins.family@example.com',
      phone: '(928) 555-0192',
      mailingAddress: '882 Desert View Dr, Kingman, AZ 86401',
      motivationLevel: 'URGENT',
      askingPrice: 28000,
      reasonForSelling: 'Retirement downsizing, delinquent taxes',
      desiredTiming: 'ASAP',
      notes: ['Urgent tax sale notice received, needs fast title resolution']
    }
  });

  // 2. Properties
  const prop1 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizationId: 'org_default',
      apn: '703-12-890',
      county: 'Costilla',
      state: 'CO',
      address: '100 Costilla Ranch Road',
      zipCode: '81151',
      legalDescription: 'NW1/4 Section 12, Township 32S, Range 72W',
      acreage: 160.0,
      usableAcreage: 155.0,
      lifecycleStage: 'UNDERWRITING',
      ownerName: 'Estate of Henry T. Miller',
      mailingAddress: '450 Midland Ave, Midland, TX 79701',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: false,
      askingPrice: 75000,
      estimatedMarketValue: 96000,
      suggestedOfferPrice: 48000,
      dealScore: 84.5,
      centroidLat: 37.2842,
      centroidLng: -105.4123,
      accessAssessment: { roadType: 'County Graded Dirt', frontageFeet: 1320, seasonalAccess: false },
      zoningAssessment: { code: 'A', name: 'Agricultural/Rural Residential', minSubdivideAcres: 35 },
      utilityAssessment: { electricDistanceFeet: 500, waterSource: 'Well Permit Needed', sewer: 'Septic Required' },
      environmentalAssessment: { floodZone: 'X', wetlandsPct: 0, slopeAvgPct: 3.2 }
    }
  });

  const prop2 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      organizationId: 'org_default',
      apn: '045-88-201',
      county: 'Reeves',
      state: 'TX',
      address: 'FM 1450 & CR 302',
      zipCode: '79777',
      legalDescription: 'Section 14, Block 55, PSL Survey, 640 Acres',
      acreage: 640.0,
      usableAcreage: 620.0,
      lifecycleStage: 'QUALIFIED',
      ownerName: 'Reeves Ranch Holdings LLC',
      mailingAddress: '1200 Congress Ave Ste 400, Austin, TX 78701',
      absenteeOwner: true,
      corporateOwner: true,
      taxDelinquent: false,
      askingPrice: 320000,
      estimatedMarketValue: 450000,
      suggestedOfferPrice: 225000,
      dealScore: 91.0,
      centroidLat: 31.4211,
      centroidLng: -103.4932,
      accessAssessment: { roadType: 'Paved FM Highway', frontageFeet: 5280 },
      zoningAssessment: { code: 'R-AG', name: 'Rural Agricultural/Commercial' },
      utilityAssessment: { threePhasePower: true, electricOnSite: true, waterSource: 'Commercial Well' },
      environmentalAssessment: { floodZone: 'X', wetlandsPct: 0 }
    }
  });

  const prop3 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      organizationId: 'org_default',
      apn: '314-09-122',
      county: 'Mohave',
      state: 'AZ',
      address: 'Golden Valley Vista Parcel 4',
      zipCode: '86413',
      legalDescription: 'E1/2 E1/2 NW1/4 Section 28, T21N, R18W',
      acreage: 40.0,
      usableAcreage: 40.0,
      lifecycleStage: 'DUE_DILIGENCE',
      ownerName: 'Clara & Donald Jenkins',
      mailingAddress: '882 Desert View Dr, Kingman, AZ 86401',
      absenteeOwner: false,
      corporateOwner: false,
      taxDelinquent: true,
      delinquentAmount: 850,
      askingPrice: 28000,
      estimatedMarketValue: 42000,
      suggestedOfferPrice: 19500,
      dealScore: 78.0,
      centroidLat: 35.2215,
      centroidLng: -114.1554,
      accessAssessment: { roadType: 'Bladed Dirt Road', frontageFeet: 660 },
      zoningAssessment: { code: 'AR-36', name: 'Agricultural Residential' },
      utilityAssessment: { electricDistanceFeet: 1200, solarPotentialScore: 98 },
      environmentalAssessment: { floodZone: 'X', wetlandsPct: 0 }
    }
  });

  const prop4 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      organizationId: 'org_default',
      apn: '100-24-551',
      county: 'Valencia',
      state: 'NM',
      address: 'Highland Meadows Unit 12 Lot 8',
      zipCode: '87031',
      legalDescription: 'Highland Meadows Unit 12 Lot 8, 20.0 Acres',
      acreage: 20.0,
      usableAcreage: 20.0,
      lifecycleStage: 'OFFER_SENT',
      ownerName: 'Estate of Henry T. Miller',
      mailingAddress: '450 Midland Ave, Midland, TX 79701',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: false,
      askingPrice: 18000,
      estimatedMarketValue: 30000,
      suggestedOfferPrice: 14000,
      dealScore: 82.0,
      centroidLat: 34.8211,
      centroidLng: -106.9122,
      accessAssessment: { roadType: 'Dirt Easement' },
      zoningAssessment: { code: 'R-1', name: 'Rural Residential' },
      environmentalAssessment: { floodZone: 'X' }
    }
  });

  const prop5 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000005' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      organizationId: 'org_default',
      apn: '28-36-12-00-501',
      county: 'Brevard',
      state: 'FL',
      address: 'Lake Washington Rd Tract 5',
      zipCode: '32934',
      legalDescription: 'South 330 FT of North 660 FT of West 660 FT Section 12',
      acreage: 10.0,
      usableAcreage: 8.5,
      lifecycleStage: 'CONTRACTED',
      ownerName: 'Reeves Ranch Holdings LLC',
      mailingAddress: '1200 Congress Ave Ste 400, Austin, TX 78701',
      absenteeOwner: true,
      corporateOwner: true,
      taxDelinquent: false,
      askingPrice: 95000,
      estimatedMarketValue: 150000,
      suggestedOfferPrice: 75000,
      dealScore: 88.0,
      centroidLat: 28.1432,
      centroidLng: -80.6891,
      accessAssessment: { roadType: 'Paved City Road', frontageFeet: 330 },
      zoningAssessment: { code: 'AU', name: 'Agricultural / Residential 1-unit per 2.5ac' },
      utilityAssessment: { electricOnSite: true, municipalWaterDistanceFeet: 250 },
      environmentalAssessment: { floodZone: 'A', wetlandsPct: 15 }
    }
  });

  const prop6 = await prisma.property.upsert({
    where: { id: '00000000-0000-0000-0000-000000000006' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000006',
      organizationId: 'org_default',
      apn: '010-58-004',
      county: 'Elko',
      state: 'NV',
      address: 'Ryndon Valley Tract 18',
      zipCode: '89801',
      legalDescription: 'N1/2 SE1/4 Section 18, T35N, R56E, 80 AC',
      acreage: 80.0,
      usableAcreage: 80.0,
      lifecycleStage: 'OWNED',
      ownerName: 'Land Intelligence Holdings LLC',
      mailingAddress: '100 Main St, Denver, CO 80202',
      absenteeOwner: false,
      corporateOwner: true,
      taxDelinquent: false,
      askingPrice: 35000,
      estimatedMarketValue: 55000,
      suggestedOfferPrice: 22000,
      dealScore: 86.0,
      centroidLat: 40.8921,
      centroidLng: -115.6543,
      accessAssessment: { roadType: 'Maintained Gravel', frontageFeet: 1320 },
      zoningAssessment: { code: 'OS', name: 'Open Space / Rural' },
      environmentalAssessment: { floodZone: 'X' }
    }
  });

  // Link PropertySellers
  await prisma.propertySeller.upsert({
    where: { propertyId_sellerId: { propertyId: prop1.id, sellerId: seller1.id } },
    update: {},
    create: { propertyId: prop1.id, sellerId: seller1.id }
  });
  await prisma.propertySeller.upsert({
    where: { propertyId_sellerId: { propertyId: prop2.id, sellerId: seller2.id } },
    update: {},
    create: { propertyId: prop2.id, sellerId: seller2.id }
  });
  await prisma.propertySeller.upsert({
    where: { propertyId_sellerId: { propertyId: prop3.id, sellerId: seller3.id } },
    update: {},
    create: { propertyId: prop3.id, sellerId: seller3.id }
  });
  await prisma.propertySeller.upsert({
    where: { propertyId_sellerId: { propertyId: prop4.id, sellerId: seller1.id } },
    update: {},
    create: { propertyId: prop4.id, sellerId: seller1.id }
  });
  await prisma.propertySeller.upsert({
    where: { propertyId_sellerId: { propertyId: prop5.id, sellerId: seller2.id } },
    update: {},
    create: { propertyId: prop5.id, sellerId: seller2.id }
  });

  // 3. Due Diligence Items for Prop 1 & Prop 3
  await prisma.dueDiligenceItem.upsert({
    where: { id: '22222222-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '22222222-0000-0000-0000-000000000001',
      propertyId: prop1.id,
      category: 'TITLE_OWNERSHIP',
      title: 'Title Abstract & Chain of Title Search',
      description: 'Search Costilla County Clerk and Recorder for deeds, probate filings, and mineral reservations back 40 years.',
      status: 'VERIFIED',
      isBlocker: false,
      verificationSource: 'Costilla County Clerk Book 412 Pg 88',
      evidenceNotes: 'Clear chain from original patentee to Henry Miller. No outstanding judgments.'
    }
  });

  await prisma.dueDiligenceItem.upsert({
    where: { id: '22222222-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '22222222-0000-0000-0000-000000000002',
      propertyId: prop1.id,
      category: 'LEGAL_ACCESS',
      title: 'Road Access & Easement Verification',
      description: 'Confirm physical and legal access via Costilla Ranch Road. Check dedication plat.',
      status: 'VERIFIED',
      isBlocker: false,
      verificationSource: 'County GIS Plat 1978-B',
      evidenceNotes: '60ft dedicated county easement verified along north boundary.'
    }
  });

  await prisma.dueDiligenceItem.upsert({
    where: { id: '22222222-0000-0000-0000-000000000003' },
    update: {},
    create: {
      id: '22222222-0000-0000-0000-000000000003',
      propertyId: prop3.id,
      category: 'TAXES_LIENS',
      title: 'Delinquent Property Tax Redemption Statement',
      description: 'Obtain official tax redemption payoff statement from Mohave County Treasurer.',
      status: 'IN_PROGRESS',
      isBlocker: true,
      verificationSource: 'Mohave County Treasurer',
      evidenceNotes: 'Redemption balance is $850. Payoff requested on 10/18.'
    }
  });

  await prisma.dueDiligenceItem.upsert({
    where: { id: '22222222-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '22222222-0000-0000-0000-000000000004',
      propertyId: prop3.id,
      category: 'ZONING_RESTRICTIONS',
      title: 'Zoning & Permitted Land Use Check',
      description: 'Confirm AR-36 zoning allows agricultural, off-grid residential, and solar array installation.',
      status: 'VERIFIED',
      isBlocker: false,
      verificationSource: 'Mohave County Development Services',
      evidenceNotes: 'AR-36 allows single-family residential, livestock, and accessory structures.'
    }
  });

  // 4. Comps for Prop 1
  await prisma.comp.upsert({
    where: { id: '33333333-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '33333333-0000-0000-0000-000000000001',
      propertyId: prop1.id,
      apn: '703-12-910',
      address: 'CR 72, Costilla, CO',
      county: 'Costilla',
      state: 'CO',
      acreage: 160.0,
      salePrice: 92000,
      saleDate: new Date('2026-06-15'),
      pricePerAcre: 575.0,
      distanceMiles: 1.8,
      roadAccess: 'COUNTY_DIRT',
      utilities: 'NONE',
      isArmLengthTransaction: true,
      includedInValuation: true,
      adjustedSalePrice: 94000
    }
  });

  await prisma.comp.upsert({
    where: { id: '33333333-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '33333333-0000-0000-0000-000000000002',
      propertyId: prop1.id,
      apn: '703-14-002',
      address: 'Section 14 R72W',
      county: 'Costilla',
      state: 'CO',
      acreage: 120.0,
      salePrice: 75000,
      saleDate: new Date('2026-08-01'),
      pricePerAcre: 625.0,
      distanceMiles: 2.4,
      roadAccess: 'COUNTY_DIRT',
      utilities: 'ELECTRIC_AT_ROAD',
      isArmLengthTransaction: true,
      includedInValuation: true,
      adjustedSalePrice: 73000
    }
  });

  // 5. Offers
  await prisma.offer.upsert({
    where: { id: '44444444-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '44444444-0000-0000-0000-000000000001',
      propertyId: prop4.id,
      sellerId: seller1.id,
      version: 1,
      status: 'SENT',
      selectedScenarioKey: 'cash',
      scenarios: {
        cash: { purchasePrice: 14000, earnestMoney: 1000, closingDays: 21, inspectionDays: 14 },
        terms: { purchasePrice: 17000, downPayment: 3000, monthlyPayment: 350, interestRate: 8.5, termMonths: 48 }
      },
      sentAt: new Date('2026-10-15')
    }
  });

  await prisma.offer.upsert({
    where: { id: '44444444-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '44444444-0000-0000-0000-000000000002',
      propertyId: prop5.id,
      sellerId: seller2.id,
      version: 2,
      status: 'ACCEPTED',
      selectedScenarioKey: 'cash',
      scenarios: {
        cash: { purchasePrice: 75000, earnestMoney: 5000, closingDays: 30, inspectionDays: 21 }
      },
      approvedAt: new Date('2026-10-10'),
      sentAt: new Date('2026-10-11')
    }
  });

  // 6. Portfolio Holding (Prop 6)
  await prisma.portfolioHolding.upsert({
    where: { id: '55555555-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '55555555-0000-0000-0000-000000000001',
      propertyId: prop6.id,
      apn: prop6.apn,
      address: prop6.address,
      county: prop6.county,
      state: prop6.state,
      acreage: prop6.acreage,
      acquisitionDate: new Date('2026-03-15'),
      purchasePrice: 22000,
      closingCosts: 1800,
      holdingCosts: 650,
      totalCostBasis: 24450,
      estimatedCurrentValue: 55000,
      unrealizedProfit: 30550,
      holdingDays: 222,
      status: 'OWNED'
    }
  });

  // 7. Buyers
  await prisma.buyer.upsert({
    where: { id: '66666666-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '66666666-0000-0000-0000-000000000001',
      organizationId: 'org_default',
      name: 'Apex Land Holdings Fund',
      email: 'acquisitions@apexlandfund.com',
      phone: '(303) 555-0199',
      verifiedBuyer: true,
      proofOfFundsVerified: true,
      criteria: { targetStates: ['CO', 'TX', 'AZ', 'NM'], minAcres: 20, maxBudget: 250000 },
      purchasedPropertiesCount: 3
    }
  });

  console.log('Seeding completed successfully with 6 diverse properties, sellers, due diligence, comps, offers, and portfolio holdings!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
