import { IParcelProvider, ParcelSearchQuery, ParcelSearchResult } from './parcelProvider.interface';
import { PropertyRecord, PropertyComp } from '@land-intelligence/domain';

export class MockParcelProvider implements IParcelProvider {
  name = 'Mock/Synthetic Parcel Provider (Regrid & ATTOM Simulator)';

  private mockDatabase: PropertyRecord[] = [
    {
      id: 'prop-001',
      organizationId: 'org-demo',
      apn: '123-456-789',
      county: 'Costilla',
      state: 'CO',
      address: '142 S Wildwood Trail, San Luis, CO 81152',
      zipCode: '81152',
      legalDescription: 'Rio Grande Ranches Unit 12 Block 4 Lot 18',
      acreage: 5.2,
      usableAcreage: 4.8,
      lifecycleStage: 'QUALIFIED',
      ownerName: 'Robert & Elena Vance',
      mailingAddress: '8492 Sunrise Blvd',
      mailingCityStateZip: 'Austin, TX 78759',
      absenteeOwner: true,
      corporateOwner: false,
      taxDelinquent: false,
      ownershipLengthYears: 12,
      askingPrice: 14500,
      estimatedMarketValue: 24000,
      suggestedOfferPrice: 10800,
      dealScore: 84,
      access: {
        physicalAccess: true,
        legalAccess: true,
        recordedEasement: true,
        publicRoadFrontageFt: 320,
        maintainedRoadStatus: 'COUNTY_MAINTAINED',
        ingressEgressEvidence: ['County Road 12 frontage', 'Deed Book 412 Pg 98'],
        verificationState: 'SELF_VERIFIED',
      },
      zoning: {
        zoningCode: 'ER',
        zoningDescription: 'Estate Residential - Off-grid, Mobile Home Permitted',
        minimumLotSizeAcres: 1.0,
        setbacksFt: { front: 30, rear: 20, side: 15 },
        permittedUses: ['Single Family Residential', 'Mobile Home', 'Agricultural', 'Seasonal Camping'],
        conditionalUses: ['Solar Farm', 'RV Park'],
        permittingAuthority: 'Costilla County Planning Dept',
        verificationState: 'PLANNER_VERIFIED',
      },
      environmental: {
        floodZone: 'Zone X (Minimal Risk)',
        floodPercentage: 0,
        wetlandsPercentage: 0,
        wetlandTypes: [],
        slopePercentageAvg: 3.2,
        maxSlopePercentage: 6.1,
        soilTypes: ['Sandy Loam - Well Drained'],
        slopeSeverity: 'FLAT',
      },
      utilities: {
        electricityProximityFt: 450,
        waterSource: 'WELL_NEEDED',
        sewerSource: 'SEPTIC_NEEDED',
        fiberInternetAvailable: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-105.4215, 37.1245],
            [-105.4195, 37.1245],
            [-105.4195, 37.1225],
            [-105.4215, 37.1225],
            [-105.4215, 37.1245],
          ],
        ],
        centroid: { lat: 37.1235, lng: -105.4205 },
      },
      provenance: {
        regrid: {
          provider: 'Regrid Licensed API',
          providerRecordId: 'reg-co-costilla-123456789',
          fetchedAt: new Date().toISOString(),
          effectiveDate: '2026-01-15',
          confidenceScore: 0.96,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'prop-002',
      organizationId: 'org-demo',
      apn: '987-654-321',
      county: 'Elko',
      state: 'NV',
      address: '77 Sky View Rd, Ryndon, NV 89801',
      zipCode: '89801',
      legalDescription: 'Meadow Valley Ranchos Unit 3 Block 14 Lot 2',
      acreage: 10.0,
      usableAcreage: 9.5,
      lifecycleStage: 'UNDERWRITING',
      ownerName: 'Desert Sun Investments LLC',
      mailingAddress: '1200 Pacific Hwy',
      mailingCityStateZip: 'San Diego, CA 92101',
      absenteeOwner: true,
      corporateOwner: true,
      taxDelinquent: true,
      delinquentAmount: 420,
      ownershipLengthYears: 6,
      askingPrice: 18000,
      estimatedMarketValue: 32000,
      suggestedOfferPrice: 13500,
      dealScore: 78,
      access: {
        physicalAccess: true,
        legalAccess: true,
        recordedEasement: true,
        publicRoadFrontageFt: 600,
        maintainedRoadStatus: 'DIRT',
        ingressEgressEvidence: ['Platted dirt road easement'],
        verificationState: 'UNVERIFIED',
      },
      zoning: {
        zoningCode: 'AR',
        zoningDescription: 'Agricultural Residential',
        minimumLotSizeAcres: 2.0,
        setbacksFt: { front: 50, rear: 40, side: 25 },
        permittedUses: ['Residential', 'Ranching', 'Outbuildings'],
        conditionalUses: ['Commercial Kennel'],
        permittingAuthority: 'Elko County Planning Board',
        verificationState: 'UNVERIFIED',
      },
      environmental: {
        floodZone: 'Zone X',
        floodPercentage: 0,
        wetlandsPercentage: 0,
        wetlandTypes: [],
        slopePercentageAvg: 2.1,
        maxSlopePercentage: 4.0,
        soilTypes: ['Gravelly Silt Loam'],
        slopeSeverity: 'FLAT',
      },
      utilities: {
        electricityProximityFt: 1200,
        waterSource: 'WELL_NEEDED',
        sewerSource: 'SEPTIC_NEEDED',
        fiberInternetAvailable: false,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-115.654, 40.832],
            [-115.650, 40.832],
            [-115.650, 40.828],
            [-115.654, 40.828],
            [-115.654, 40.832],
          ],
        ],
        centroid: { lat: 40.830, lng: -115.652 },
      },
      provenance: {
        attom: {
          provider: 'ATTOM Data Solutions',
          providerRecordId: 'attom-nv-elko-987654321',
          fetchedAt: new Date().toISOString(),
          effectiveDate: '2026-02-01',
          confidenceScore: 0.94,
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async searchParcels(query: ParcelSearchQuery): Promise<ParcelSearchResult> {
    let results = [...this.mockDatabase];
    if (query.state) {
      results = results.filter((p) => p.state.toLowerCase() === query.state?.toLowerCase());
    }
    if (query.county) {
      results = results.filter((p) => p.county.toLowerCase() === query.county?.toLowerCase());
    }
    if (query.minAcreage) {
      results = results.filter((p) => p.acreage >= (query.minAcreage || 0));
    }
    if (query.maxAcreage) {
      results = results.filter((p) => p.acreage <= (query.maxAcreage || 999999));
    }
    if (query.absenteeOnly) {
      results = results.filter((p) => p.absenteeOwner);
    }
    if (query.taxDelinquentOnly) {
      results = results.filter((p) => p.taxDelinquent);
    }

    return {
      properties: results,
      totalCount: results.length,
      provider: this.name,
      fetchedAt: new Date().toISOString(),
    };
  }

  async getParcelByApn(state: string, county: string, apn: string): Promise<PropertyRecord | null> {
    const found = this.mockDatabase.find(
      (p) => p.state.toLowerCase() === state.toLowerCase() && p.county.toLowerCase() === county.toLowerCase() && p.apn === apn
    );
    return found || null;
  }

  async getCompsForParcel(property: PropertyRecord, radiusMiles: number): Promise<PropertyComp[]> {
    return [
      {
        id: 'comp-101',
        apn: '123-456-888',
        address: '190 S Wildwood Trl',
        county: property.county,
        state: property.state,
        acreage: 5.0,
        salePrice: 23500,
        saleDate: '2026-04-10',
        pricePerAcre: 4700,
        distanceMiles: 0.4,
        roadAccess: 'County Dirt Road',
        utilities: 'Off-Grid / Solar',
        wetlandsPercentage: 0,
        floodPercentage: 0,
        isArmLengthTransaction: true,
        isDuplicate: false,
        isFamilyTransfer: false,
        isQuitclaim: false,
        isOutlier: false,
        includedInValuation: true,
        adjustments: {
          acreageAdjustment: 100,
          timeAdjustment: 0,
          accessAdjustment: 0,
          utilityAdjustment: 0,
          environmentalAdjustment: 0,
          totalAdjustment: 100,
        },
        adjustedPricePerAcre: 4800,
        adjustedSalePrice: 24000,
      },
      {
        id: 'comp-102',
        apn: '123-456-999',
        address: '88 Alpine Way',
        county: property.county,
        state: property.state,
        acreage: 4.8,
        salePrice: 22000,
        saleDate: '2026-02-18',
        pricePerAcre: 4583,
        distanceMiles: 1.1,
        roadAccess: 'County Dirt Road',
        utilities: 'Off-Grid',
        wetlandsPercentage: 0,
        floodPercentage: 0,
        isArmLengthTransaction: true,
        isDuplicate: false,
        isFamilyTransfer: false,
        isQuitclaim: false,
        isOutlier: false,
        includedInValuation: true,
        adjustments: {
          acreageAdjustment: 0,
          timeAdjustment: 150,
          accessAdjustment: 0,
          utilityAdjustment: 0,
          environmentalAdjustment: 0,
          totalAdjustment: 150,
        },
        adjustedPricePerAcre: 4733,
        adjustedSalePrice: 22718,
      },
      {
        id: 'comp-103',
        apn: '123-456-700',
        address: '500 Aspen Ridge Rd',
        county: property.county,
        state: property.state,
        acreage: 10.0,
        salePrice: 38000,
        saleDate: '2025-11-05',
        pricePerAcre: 3800,
        distanceMiles: 2.3,
        roadAccess: 'Paved Road',
        utilities: 'Power at Lot Line',
        wetlandsPercentage: 0,
        floodPercentage: 0,
        isArmLengthTransaction: true,
        isDuplicate: false,
        isFamilyTransfer: false,
        isQuitclaim: false,
        isOutlier: false,
        includedInValuation: true,
        adjustments: {
          acreageAdjustment: 400,
          timeAdjustment: 200,
          accessAdjustment: -300,
          utilityAdjustment: -400,
          environmentalAdjustment: 0,
          totalAdjustment: -100,
        },
        adjustedPricePerAcre: 3700,
        adjustedSalePrice: 19240,
      },
    ];
  }

  async healthCheck(): Promise<{ ok: boolean; message: string }> {
    return { ok: true, message: 'Mock Parcel Provider active and responding.' };
  }
}
