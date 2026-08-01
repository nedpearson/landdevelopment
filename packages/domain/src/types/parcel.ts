import { PropertyLifecycleStage } from './lifecycle';

export interface DataProvenance {
  provider: string;
  providerRecordId: string;
  fetchedAt: string; // ISO String
  effectiveDate: string; // ISO String
  confidenceScore: number; // 0.0 to 1.0
  rawDataHash?: string;
  supersededBy?: string;
}

export interface ParcelGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][] | number[][][][];
  centroid: {
    lat: number;
    lng: number;
  };
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
}

export interface AccessAssessment {
  physicalAccess: boolean;
  legalAccess: boolean;
  recordedEasement: boolean;
  publicRoadFrontageFt: number;
  maintainedRoadStatus: 'COUNTY_MAINTAINED' | 'STATE_MAINTAINED' | 'PRIVATE' | 'DIRT' | 'UNMAINTAINED' | 'UNKNOWN';
  ingressEgressEvidence: string[];
  verificationState: 'UNVERIFIED' | 'SELF_VERIFIED' | 'ATTORNEY_VERIFIED' | 'REJECTED';
}

export interface ZoningAssessment {
  zoningCode: string;
  zoningDescription: string;
  minimumLotSizeAcres: number;
  setbacksFt: {
    front: number;
    rear: number;
    side: number;
  };
  permittedUses: string[];
  conditionalUses: string[];
  subdivisionConstraints?: string;
  permittingAuthority: string;
  verificationState: 'UNVERIFIED' | 'PLANNER_VERIFIED' | 'FLAGGED';
}

export interface EnvironmentalAssessment {
  floodZone: string; // e.g. Zone X, Zone AE
  floodPercentage: number; // 0 to 100
  wetlandsPercentage: number; // 0 to 100
  wetlandTypes: string[];
  slopePercentageAvg: number;
  maxSlopePercentage: number;
  soilTypes: string[];
  slopeSeverity: 'FLAT' | 'GENTLE' | 'MODERATE' | 'STEEP' | 'SEVERE';
}

export interface UtilityAssessment {
  electricityProximityFt: number;
  waterSource: 'PUBLIC' | 'WELL_NEEDED' | 'WELL_EXISTING' | 'UNKNOWN';
  sewerSource: 'PUBLIC' | 'SEPTIC_NEEDED' | 'SEPTIC_EXISTING' | 'UNKNOWN';
  gasProximityFt?: number;
  fiberInternetAvailable: boolean;
}

export interface PropertyRecord {
  id: string;
  organizationId: string;
  apn: string;
  county: string;
  state: string;
  address?: string;
  zipCode?: string;
  legalDescription?: string;
  acreage: number;
  usableAcreage: number;
  lifecycleStage: PropertyLifecycleStage;
  
  // Owner details
  ownerName: string;
  mailingAddress?: string;
  mailingCityStateZip?: string;
  absenteeOwner: boolean;
  corporateOwner: boolean;
  taxDelinquent: boolean;
  delinquentAmount?: number;
  ownershipLengthYears?: number;

  // Assessments
  access: AccessAssessment;
  zoning: ZoningAssessment;
  environmental: EnvironmentalAssessment;
  utilities: UtilityAssessment;
  
  // Geospatial
  geometry?: ParcelGeometry;

  // Financials & Valuation
  askingPrice?: number;
  estimatedMarketValue?: number;
  suggestedOfferPrice?: number;
  dealScore?: number;

  // Provenance
  provenance: Record<string, DataProvenance>;
  
  createdAt: string;
  updatedAt: string;
}
