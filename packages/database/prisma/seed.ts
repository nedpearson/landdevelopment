import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Land Investment OS Database Seed...');

  // Clean existing tables in reverse dependency order
  await prisma.ownerFinanceNote.deleteMany();
  await prisma.portfolioHolding.deleteMany();
  await prisma.dueDiligenceItem.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.communicationLog.deleteMany();
  await prisma.propertySeller.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.comp.deleteMany();
  await prisma.buyer.deleteMany();
  await prisma.property.deleteMany();

  console.log('Cleared existing database records.');

  // 1. Create Properties / Parcels
  const prop1 = await prisma.property.create({
    data: {
      organizationId: 'org_land_alpha',
      apn: '401-22-104A',
      county: 'Bastrop',
      state: 'TX',
      address: '142 Piney Creek Rd',
      zipCode: '78602',
      legalDescription: 'ABS 0042 TRAVIS S A LEAGUE ACRES 10.5',
      acreage: 10.5,
      usableAcreage: 9.8,
      lifecycleStage: 'DUE_DILIGENCE',
      ownerName: 'Robert Vance',
      mailingAddress: '804 Congress Ave, Austin, TX 78701',
      mailingCityStateZip: 'Austin, TX 78701',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: false,
      delinquentAmount: 0,
      ownershipLengthYears: 14.5,
      accessAssessment: {
        physicalAccess: true,
        legalAccess: true,
        recordedEasement: true,
        publicRoadFrontageFt: 350,
        maintainedRoadStatus: 'COUNTY_MAINTAINED',
        ingressEgressEvidence: ['Recorded Deed Book 412 Pg 90'],
        verificationState: 'ATTORNEY_VERIFIED',
      },
      zoningAssessment: {
        zoningCode: 'RA-5',
        zoningDescription: 'Rural Agricultural 5-Acre Minimum',
        minimumLotSizeAcres: 5.0,
        setbacksFt: { front: 50, rear: 30, side: 25 },
        permittedUses: ['Single Family Residential', 'Agriculture', 'Mobile Home'],
        conditionalUses: ['Solar Farm', 'RV Park'],
        permittingAuthority: 'Bastrop County Development Services',
        verificationState: 'PLANNER_VERIFIED',
      },
      environmentalAssessment: {
        floodZone: 'Zone X',
        floodPercentage: 0,
        wetlandsPercentage: 5,
        wetlandTypes: ['PFO1A - Palustrine Forested'],
        slopePercentageAvg: 3.2,
        maxSlopePercentage: 8.5,
        soilTypes: ['Sandy Loam', 'Clay'],
        slopeSeverity: 'GENTLE',
      },
      utilityAssessment: {
        electricityProximityFt: 40,
        waterSource: 'WELL_NEEDED',
        sewerSource: 'SEPTIC_NEEDED',
        gasProximityFt: 500,
        fiberInternetAvailable: true,
      },
      centroidLat: 30.1105,
      centroidLng: -97.3168,
      askingPrice: 85000,
      estimatedMarketValue: 78000,
      suggestedOfferPrice: 42000,
      dealScore: 88.5,
      provenance: {
        countyRecords: {
          provider: 'County GIS',
          providerRecordId: 'TX-BASTROP-401-22-104A',
          fetchedAt: new Date().toISOString(),
          effectiveDate: new Date().toISOString(),
          confidenceScore: 0.98,
        },
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      organizationId: 'org_land_alpha',
      apn: '098-14-302',
      county: 'Polk',
      state: 'FL',
      address: 'Off Old Highway 27',
      zipCode: '33859',
      legalDescription: 'SEC 14 TWP 29S RGE 27E TRACT 302',
      acreage: 5.25,
      usableAcreage: 4.5,
      lifecycleStage: 'OWNED',
      ownerName: 'Apex Land Holdings LLC',
      mailingAddress: '100 Main St, Tampa, FL 33602',
      absenteeOwner: false,
      corporateOwner: true,
      taxDelinquent: false,
      ownershipLengthYears: 1.2,
      accessAssessment: {
        physicalAccess: true,
        legalAccess: true,
        recordedEasement: false,
        publicRoadFrontageFt: 200,
        maintainedRoadStatus: 'STATE_MAINTAINED',
        verificationState: 'SELF_VERIFIED',
      },
      zoningAssessment: {
        zoningCode: 'A/RR',
        zoningDescription: 'Agricultural / Rural Residential',
        minimumLotSizeAcres: 2.5,
        setbacksFt: { front: 40, rear: 20, side: 15 },
        permittedUses: ['Single Family', 'Agriculture'],
        permittingAuthority: 'Polk County Zoning Board',
        verificationState: 'PLANNER_VERIFIED',
      },
      environmentalAssessment: {
        floodZone: 'Zone AE',
        floodPercentage: 12,
        wetlandsPercentage: 8,
        wetlandTypes: ['PEM1F'],
        slopePercentageAvg: 1.5,
        maxSlopePercentage: 4.0,
        soilTypes: ['Candler Sand'],
        slopeSeverity: 'FLAT',
      },
      utilityAssessment: {
        electricityProximityFt: 10,
        waterSource: 'PUBLIC',
        sewerSource: 'SEPTIC_NEEDED',
        fiberInternetAvailable: true,
      },
      centroidLat: 27.8921,
      centroidLng: -81.6342,
      askingPrice: 65000,
      estimatedMarketValue: 62000,
      suggestedOfferPrice: 31000,
      dealScore: 92.0,
      provenance: {},
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      organizationId: 'org_land_alpha',
      apn: '7304-11-2099',
      county: 'Henderson',
      state: 'NC',
      address: 'Mountain View Rd',
      zipCode: '28792',
      legalDescription: 'LOT 12 BLUE RIDGE ACRES PH 2',
      acreage: 18.4,
      usableAcreage: 14.1,
      lifecycleStage: 'OFFER_SENT',
      ownerName: 'Eleanor Vance Trust',
      mailingAddress: '120 S Church St, Hendersonville, NC 28792',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: true,
      delinquentAmount: 1450.8,
      ownershipLengthYears: 22.0,
      accessAssessment: {
        physicalAccess: true,
        legalAccess: true,
        recordedEasement: true,
        publicRoadFrontageFt: 120,
        maintainedRoadStatus: 'PRIVATE',
        verificationState: 'UNVERIFIED',
      },
      zoningAssessment: {
        zoningCode: 'R-40',
        zoningDescription: 'Residential High Density',
        minimumLotSizeAcres: 1.0,
        setbacksFt: { front: 30, rear: 20, side: 15 },
        permittedUses: ['Single Family', 'Duplex'],
        permittingAuthority: 'Henderson County Planning',
        verificationState: 'UNVERIFIED',
      },
      environmentalAssessment: {
        floodZone: 'Zone X',
        floodPercentage: 0,
        wetlandsPercentage: 0,
        wetlandTypes: [],
        slopePercentageAvg: 14.2,
        maxSlopePercentage: 26.0,
        soilTypes: ['Ashe Stony Loam'],
        slopeSeverity: 'STEEP',
      },
      utilityAssessment: {
        electricityProximityFt: 100,
        waterSource: 'WELL_NEEDED',
        sewerSource: 'SEPTIC_NEEDED',
        fiberInternetAvailable: false,
      },
      centroidLat: 35.3187,
      centroidLng: -82.4614,
      askingPrice: 140000,
      estimatedMarketValue: 125000,
      suggestedOfferPrice: 65000,
      dealScore: 84.0,
      provenance: {},
    },
  });

  console.log(`Created 3 properties: ${prop1.id}, ${prop2.id}, ${prop3.id}`);

  // 2. Create Comparable Sales (Comps)
  await prisma.comp.createMany({
    data: [
      {
        propertyId: prop1.id,
        apn: '401-22-109B',
        address: '180 Piney Creek Rd',
        county: 'Bastrop',
        state: 'TX',
        acreage: 10.0,
        salePrice: 80000,
        saleDate: new Date('2026-03-15'),
        pricePerAcre: 8000,
        distanceMiles: 0.4,
        roadAccess: 'County Road',
        utilities: 'Electric at Street',
        wetlandsPercentage: 0,
        floodPercentage: 0,
        isArmLengthTransaction: true,
        includedInValuation: true,
        adjustments: { timeAdjustment: 2000, accessAdjustment: 0 },
        adjustedPricePerAcre: 8200,
        adjustedSalePrice: 82000,
      },
      {
        propertyId: prop1.id,
        apn: '401-22-115',
        address: 'CR 140 Parcel B',
        county: 'Bastrop',
        state: 'TX',
        acreage: 12.5,
        salePrice: 92000,
        saleDate: new Date('2026-01-20'),
        pricePerAcre: 7360,
        distanceMiles: 1.2,
        roadAccess: 'Paved Road',
        utilities: 'Electric & Water',
        wetlandsPercentage: 2,
        floodPercentage: 0,
        isArmLengthTransaction: true,
        includedInValuation: true,
        adjustments: { timeAdjustment: 3000, utilityAdjustment: -2000 },
        adjustedPricePerAcre: 7440,
        adjustedSalePrice: 93000,
      },
      {
        propertyId: prop2.id,
        apn: '098-14-310',
        address: 'Highway 27 North',
        county: 'Polk',
        state: 'FL',
        acreage: 5.0,
        salePrice: 65000,
        saleDate: new Date('2026-05-10'),
        pricePerAcre: 13000,
        distanceMiles: 0.8,
        roadAccess: 'State Highway',
        utilities: 'Public Water',
        wetlandsPercentage: 5,
        floodPercentage: 10,
        isArmLengthTransaction: true,
        includedInValuation: true,
        adjustedPricePerAcre: 12800,
        adjustedSalePrice: 64000,
      },
    ],
  });

  console.log('Created comparable sales (comps).');

  // 3. Create Sellers & CRM Contacts
  const seller1 = await prisma.seller.create({
    data: {
      organizationId: 'org_land_alpha',
      name: 'Robert Vance',
      email: 'robert.vance@example.com',
      phone: '(512) 555-0192',
      mailingAddress: '804 Congress Ave, Austin, TX 78701',
      motivationLevel: 'HIGH',
      askingPrice: 85000,
      reasonForSelling: 'Inherited land, lives out of state and wants cash liquidity',
      desiredTiming: 'Within 30 days',
      notes: [
        'Called on 2026-07-15, indicated willingness to accept cash offer below asking.',
        'Requested seller financing options if down payment is 20%+',
      ],
      consent: [
        {
          contactPoint: '(512) 555-0192',
          channel: 'PHONE',
          optedIn: true,
          dncStatus: false,
          consentSource: 'Inbound Call Consent',
          timestamp: new Date().toISOString(),
        },
      ],
      campaignId: 'TX_BASTROP_2026_Q2',
    },
  });

  const seller3 = await prisma.seller.create({
    data: {
      organizationId: 'org_land_alpha',
      name: 'Eleanor Vance',
      email: 'evance.trust@example.com',
      phone: '(828) 555-4411',
      mailingAddress: '120 S Church St, Hendersonville, NC 28792',
      motivationLevel: 'URGENT',
      askingPrice: 140000,
      reasonForSelling: 'Paying off estate taxes',
      desiredTiming: 'Asap',
      notes: ['Trustee authorized to sign offer.'],
    },
  });

  // Link property to sellers
  await prisma.propertySeller.createMany({
    data: [
      { propertyId: prop1.id, sellerId: seller1.id },
      { propertyId: prop3.id, sellerId: seller3.id },
    ],
  });

  console.log('Created sellers and linked to properties.');

  // 4. Create Communication Logs
  await prisma.communicationLog.createMany({
    data: [
      {
        sellerId: seller1.id,
        propertyId: prop1.id,
        channel: 'PHONE',
        direction: 'INBOUND',
        content: 'Seller called regarding offer letter sent for Bastrop parcel. Expressed interest in 42k cash.',
        status: 'RECEIVED',
        sentByUserId: 'user_acquisitions_mgr',
      },
      {
        sellerId: seller1.id,
        propertyId: prop1.id,
        channel: 'EMAIL',
        direction: 'OUTBOUND',
        content: 'Sent draft purchase agreement and seller financing scenario break-down.',
        status: 'DELIVERED',
        sentByUserId: 'user_acquisitions_mgr',
      },
    ],
  });

  // 5. Create Offers
  await prisma.offer.create({
    data: {
      propertyId: prop1.id,
      sellerId: seller1.id,
      version: 1,
      status: 'APPROVED',
      selectedScenarioKey: 'cash',
      scenarios: {
        cash: {
          type: 'CASH',
          offerPrice: 42000,
          earnestMoney: 1000,
          dueDiligenceDays: 21,
          closingDays: 14,
          projectedResalePrice: 78000,
          projectedProfit: 32000,
          projectedROI: 0.76,
          projectedCashOnCash: 0.76,
        },
        sellerFinancing: {
          type: 'SELLER_FINANCING',
          offerPrice: 48000,
          earnestMoney: 1000,
          dueDiligenceDays: 21,
          closingDays: 14,
          sellerFinancing: {
            purchasePrice: 48000,
            downPaymentAmount: 9600,
            downPaymentPercentage: 20,
            financedAmount: 38400,
            interestRateAnnual: 8.5,
            amortizationYears: 5,
            monthlyPayment: 787.52,
            totalInterestPaid: 8851.2,
            totalPaidToSeller: 56851.2,
          },
          projectedResalePrice: 78000,
          projectedProfit: 26148.8,
          projectedROI: 0.54,
          projectedCashOnCash: 2.72,
        },
      },
      approvedById: 'user_principal_1',
      approvedAt: new Date('2026-07-28T14:30:00Z'),
      sentAt: new Date('2026-07-28T16:00:00Z'),
      expiresAt: new Date('2026-08-08T23:59:59Z'),
      esignatureStatus: 'DELIVERED',
    },
  });

  console.log('Created offers with multi-scenario underwriting.');

  // 6. Create Due Diligence Items
  await prisma.dueDiligenceItem.createMany({
    data: [
      {
        propertyId: prop1.id,
        category: 'TITLE_OWNERSHIP',
        title: 'Title Commitment & Chain of Title Search',
        description: 'Verify clear title, check for unrecorded easements or liens with Bastrop Title Co.',
        status: 'VERIFIED',
        isBlocker: true,
        assignedToUser: 'user_title_clerk',
        dueDate: new Date('2026-08-02'),
        verificationSource: 'Bastrop County Title Company Commitment #2026-8812',
        evidenceNotes: 'Title search complete. No defects or mechanics liens found.',
        evidenceFileUrls: ['https://storage.landos.internal/diligence/prop1/title_commitment.pdf'],
        reviewedBy: 'user_attorney_lead',
        reviewedAt: new Date('2026-07-30'),
      },
      {
        propertyId: prop1.id,
        category: 'LEGAL_ACCESS',
        title: 'Recorded Easement Verification',
        description: 'Ensure 30ft ingress/egress easement is properly recorded in county land records.',
        status: 'VERIFIED',
        isBlocker: true,
        assignedToUser: 'user_attorney_lead',
        dueDate: new Date('2026-08-04'),
        verificationSource: 'Deed Book 412 Pg 90',
        evidenceNotes: 'Easement connects directly to Piney Creek Rd. Verified with county surveyor.',
      },
      {
        propertyId: prop1.id,
        category: 'ENVIRONMENTAL_FLOOD',
        title: 'FEMA Flood Zone & Wetland Overlay Analysis',
        description: 'Check 100-year flood risk and NWI wetland boundaries for buildable envelope.',
        status: 'VERIFIED',
        isBlocker: false,
        assignedToUser: 'user_gis_analyst',
        evidenceNotes: '9.8 usable acres out of 10.5. 0.7 acres seasonal wetland in rear corner.',
      },
      {
        propertyId: prop1.id,
        category: 'UTILITIES_SEPTIC',
        title: 'Septic Soil Perc Test & Water Meter Availability',
        description: 'Confirm Aqua Water Supply Corp meter availability and soil perc test suitability.',
        status: 'IN_PROGRESS',
        isBlocker: false,
        assignedToUser: 'user_field_tech',
        dueDate: new Date('2026-08-05'),
      },
    ],
  });

  console.log('Created due diligence checklist items.');

  // 7. Create Buyers
  const buyer1 = await prisma.buyer.create({
    data: {
      organizationId: 'org_land_alpha',
      name: 'Lone Star Land Investments',
      email: 'acquisitions@lonestarland.com',
      phone: '(512) 555-9000',
      verifiedBuyer: true,
      proofOfFundsVerified: true,
      criteria: {
        states: ['TX'],
        counties: ['Bastrop', 'Caldwell', 'Hays', 'Travis'],
        minAcreage: 5.0,
        maxAcreage: 50.0,
        maxPrice: 150000,
        preferredUses: ['Subdivision', 'Residential', 'Investment Holding'],
        financingTypePreference: 'ANY',
        requiredUtilities: ['Electricity'],
      },
      purchasedPropertiesCount: 4,
      unsubscribed: false,
    },
  });

  const buyer2 = await prisma.buyer.create({
    data: {
      organizationId: 'org_land_alpha',
      name: 'Sunshine Recreational Buyers Club',
      email: 'deals@sunshinebuyers.org',
      phone: '(407) 555-3112',
      verifiedBuyer: true,
      proofOfFundsVerified: false,
      criteria: {
        states: ['FL', 'NC'],
        counties: ['Polk', 'Highlands', 'Henderson'],
        minAcreage: 2.0,
        maxAcreage: 20.0,
        maxPrice: 80000,
        preferredUses: ['Mobile Home', 'Camping', 'RV'],
        financingTypePreference: 'OWNER_FINANCING',
      },
      purchasedPropertiesCount: 1,
      unsubscribed: false,
    },
  });

  console.log(`Created buyers: ${buyer1.id}, ${buyer2.id}`);

  // 8. Create Portfolio Holdings & Owner Financing Notes
  const holding = await prisma.portfolioHolding.create({
    data: {
      propertyId: prop2.id,
      apn: prop2.apn,
      address: prop2.address || 'Off Old Highway 27',
      county: prop2.county,
      state: prop2.state,
      acreage: prop2.acreage,
      acquisitionDate: new Date('2025-06-15'),
      purchasePrice: 28000,
      closingCosts: 1800,
      holdingCosts: 450,
      totalCostBasis: 30250,
      estimatedCurrentValue: 62000,
      unrealizedProfit: 31750,
      holdingDays: 412,
      status: 'OWNED',
    },
  });

  await prisma.ownerFinanceNote.create({
    data: {
      portfolioHoldingId: holding.id,
      propertyId: prop2.id,
      buyerName: 'David & Sarah Miller',
      buyerEmail: 'david.miller@example.com',
      terms: {
        purchasePrice: 65000,
        downPaymentAmount: 10000,
        downPaymentPercentage: 15.38,
        financedAmount: 55000,
        interestRateAnnual: 9.9,
        amortizationYears: 7,
        monthlyPayment: 910.45,
        totalInterestPaid: 21477.8,
        totalPaidToSeller: 76477.8,
      },
      startDate: new Date('2025-09-01'),
      nextPaymentDueDate: new Date('2026-08-01'),
      currentBalance: 49820.35,
      status: 'ACTIVE',
      paymentsReceivedCount: 11,
      totalInterestCollected: 4210.15,
      totalPrincipalCollected: 5179.65,
    },
  });

  console.log('Created portfolio holdings and active seller finance notes.');
  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Database seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
