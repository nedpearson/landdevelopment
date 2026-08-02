export type OperatingMode = 'LAND_INVESTMENT' | 'LANDMAN_OPERATIONS' | 'DUAL_MODE';

export type LandmanRole =
  | 'FIELD_LANDMAN'
  | 'TITLE_LANDMAN'
  | 'LEASE_ACQUISITION_LANDMAN'
  | 'RIGHT_OF_WAY_AGENT'
  | 'SENIOR_LANDMAN'
  | 'CREW_CHIEF'
  | 'PROJECT_MANAGER'
  | 'IN_HOUSE_LANDMAN'
  | 'DIVISION_ORDER_ANALYST'
  | 'TITLE_EXAMINER'
  | 'CURATIVE_SPECIALIST'
  | 'RENEWABLE_LAND_AGENT'
  | 'ATTORNEY'
  | 'CLIENT_REPRESENTATIVE';

export type LandProjectType =
  | 'MINERAL_OWNERSHIP_REPORT'
  | 'SURFACE_OWNERSHIP_REPORT'
  | 'LEASEHOLD_REPORT'
  | 'LEASE_ACQUISITION'
  | 'MINERAL_ACQUISITION'
  | 'RIGHT_OF_WAY_ACQUISITION'
  | 'SOLAR_DEVELOPMENT'
  | 'WIND_DEVELOPMENT'
  | 'BATTERY_STORAGE'
  | 'CARBON_CAPTURE'
  | 'TITLE_ABSTRACT'
  | 'CURATIVE_PROJECT'
  | 'DIVISION_ORDER_PAYDECK';

import { RationalFraction, rationalToDecimal, decimalToRational } from '../utils/rationalMath';
export type { RationalFraction };
export { rationalToDecimal, decimalToRational };

export interface LandProject {
  id: string;
  organizationId: string;
  projectName: string;
  clientName: string;
  projectType: LandProjectType;
  state: string;
  county: string;
  basin?: string;
  play?: string;
  targetGrossAcres: number;
  targetNetMineralAcres: number;
  budgetUsd: number;
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
  assignedCrewChiefId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandTract {
  id: string;
  projectId: string;
  tractNumber: string;
  clientTractRef?: string;
  associatedParcelIds: string[];
  county: string;
  state: string;
  legalDescription: string;
  grossAcres: number;
  grossMineralAcres: number;
  netMineralAcres: number;
  surfaceAcres: number;
  depthIntervalDescription?: string;
  formationName?: string;
  surfaceOwnerName: string;
  mineralOwnerName: string;
  executiveRightsOwnerName: string;
  leaseholdStatus: 'OPEN_UNLEASED' | 'NEGOTIATING' | 'LEASED' | 'HELD_BY_PRODUCTION' | 'EXPIRED';
  hbpStatus: 'NOT_HBP' | 'CONFIRMED_HBP' | 'UNCERTAIN' | 'EXPIRED';
  titleStatus: 'CLEAR' | 'DEFECTS_PENDING' | 'CURATIVE_REQUIRED' | 'ATTORNEY_REVIEW';
  status: 'ASSIGNED' | 'TITLE_IN_PROGRESS' | 'TITLE_COMPLETE' | 'ACQUISITION_COMPLETE';
  assignedLandmanId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TitleInstrument {
  id: string;
  tractId: string;
  entryNumber: number;
  instrumentType:
    | 'MINERAL_DEED'
    | 'WARRANTY_DEED'
    | 'QUITCLAIM_DEED'
    | 'OIL_GAS_LEASE'
    | 'MEMORANDUM_OF_LEASE'
    | 'ASSIGNMENT_OF_LEASE'
    | 'ROYALTY_DEED'
    | 'PROBATE_WILL'
    | 'AFFIDAVIT_OF_HEIRSHIP'
    | 'STIPULATION_OF_INTEREST'
    | 'RIGHT_OF_WAY_EASEMENT'
    | 'MORTGAGE_LIEN';
  grantor: string;
  grantee: string;
  executionDate: string;
  recordingDate: string;
  bookPageDoc: string; // e.g. "Book 412 Pg 98" or "Doc #2026-00412"
  legalDescription: string;
  conveyedInterestFraction: RationalFraction;
  reservedInterestFraction?: RationalFraction;
  depthLimitation?: string;
  exceptions: string[];
  documentUrl?: string;
  hasGapOrDefect: boolean;
  defectNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface TitleRunsheet {
  id: string;
  tractId: string;
  titleLandmanName: string;
  instruments: TitleInstrument[];
  calculatedSurfaceOwners: { party: string; interest: RationalFraction }[];
  calculatedMineralOwners: { party: string; interest: RationalFraction; netMineralAcres: number }[];
  calculatedRoyaltyOwners: { party: string; nriFraction: RationalFraction }[];
  calculatedWorkingInterestOwners: { party: string; wiFraction: RationalFraction }[];
  status: 'DRAFT' | 'QC_REVIEW' | 'ATTORNEY_APPROVED' | 'FINAL';
  createdAt: string;
  updatedAt: string;
}

export interface LeaseRecord {
  id: string;
  tractId: string;
  leaseNumber: string;
  lessorName: string;
  lesseeName: string;
  effectiveDate: string;
  primaryTermYears: number;
  expirationDate: string;
  bonusPerNma: number;
  
  royaltyNumerator: bigint;
  royaltyDenominator: bigint;
  nriNumerator?: bigint;
  nriDenominator?: bigint;
  
  depthSeveranceTop?: string;
  depthSeveranceBottom?: string;

  hasPughClause: boolean;
  hasShutInClause: boolean;
  hasContinuousDevelopment: boolean;
  status: 'ACTIVE' | 'HBP' | 'SHUT_IN' | 'EXPIRED' | 'SURRENDERED';
}

export interface CurativeItem {
  id: string;
  tractId: string;
  titleRequirement: string;
  defectCategory: 'MISSING_DEED' | 'PROBATE_HEIRSHIP' | 'MARITAL_STATUS' | 'UNRELEASED_LIEN' | 'NAME_DISCREPANCY';
  severity: 'CRITICAL_BLOCKER' | 'MAJOR' | 'MINOR';
  status: 'OPEN' | 'DOCUMENT_REQUESTED' | 'IN_REVIEW' | 'PENDING_REVIEW' | 'CLEARED' | 'WAIVED';
  assignedTo: string;
  targetCompletionDate: string;
  
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface RightOfWaySegment {
  id: string;
  projectId: string;
  segmentName: string;
  infrastructureType: 'PIPELINE' | 'TRANSMISSION_LINE' | 'FIBER_OPTIC' | 'ACCESS_ROAD' | 'WATER_LINE';
  centerlineLengthRods: number;
  easementWidthFeet: number;
  permanentAcres: number;
  temporaryAcres: number;
  pricePerRodUsd: number;
  surfaceDamageUsd: number;
  cropDamageUsd: number;
  totalOfferUsd: number;
  easementSigned: boolean;
  condemnationRisk: boolean;
}

export interface RenewableProject {
  id: string;
  organizationId: string;
  projectName: string;
  technologyType: 'SOLAR' | 'WIND' | 'BATTERY_STORAGE' | 'CARBON_CAPTURE' | 'GEOTHERMAL';
  targetControlAcres: number;
  signedControlAcres: number;
  siteControlPercentage: number;
  interconnectionSubstation: string;
  distanceToSubstationMiles: number;
  optionTermYears: number;
  optionRentPerAcYr: number;
  operatingRentPerAcYr: number;
}

export interface LandmanBillingEntry {
  id: string;
  projectId: string;
  tractId?: string;
  landmanName: string;
  date: string;
  hoursWorked: number;
  hourlyRateUsd: number;
  mileageMiles: number;
  mileageRateUsd: number;
  perDiemUsd: number;
  outOfPocketExpensesUsd: number;
  expenseCategory: 'COPIES' | 'RECORDING_FEES' | 'CERTIFIED_COPIES' | 'PARKING' | 'LODGING' | 'MISC';
  totalBilledUsd: number;
  invoiceStatus: 'UNBILLED' | 'INVOICED' | 'PAID';
}

// -------------------------------------------------------------
// PHASE L1 EXPANSION TYPES
// -------------------------------------------------------------

export type OrganizationOperatingMode = 'LAND_INVESTMENT' | 'LANDMAN_OPERATIONS' | 'DUAL_MODE';

export type EstateType = 
  | 'SURFACE_ESTATE'
  | 'MINERAL_ESTATE'
  | 'EXECUTIVE_RIGHTS'
  | 'ROYALTY_INTEREST'
  | 'NON_PARTICIPATING_ROYALTY'
  | 'OVERRIDING_ROYALTY'
  | 'WORKING_INTEREST'
  | 'LEASEHOLD_INTEREST'
  | 'OPERATING_RIGHTS'
  | 'WATER_RIGHTS'
  | 'PORE_SPACE'
  | 'SOLAR_RIGHTS'
  | 'WIND_RIGHTS'
  | 'RIGHT_OF_WAY';

export interface ProjectClient {
  id: string;
  organizationId: string;
  name: string;
  contactName?: string;
  contactEmail?: string;
  billingDetails?: any;
}

export interface TractParcel {
  tractId: string;
  propertyId: string;
  fractionOfParcel: number;
}

export interface Estate {
  id: string;
  type: EstateType;
  description?: string;
}

export interface TractOwnership {
  id: string;
  tractId: string;
  estateId: string;
  ownerName: string;
  numerator: bigint;
  denominator: bigint;
  decimalValue: number;
  netMineralAcres?: number;
  depthSeverance?: string;
  notes?: string;
}

// -------------------------------------------------------------
// PHASE L2 TITLE MODELS
// -------------------------------------------------------------

export interface RunSheetEntry {
  id: string;
  runsheetId: string;
  instrumentId: string;
  entryNumber: number;
  notes?: string;
}

export interface InstrumentParty {
  id: string;
  instrumentId: string;
  partyType: string;
  name: string;
}

export interface GrantingClause {
  id: string;
  instrumentId: string;
  estateType: EstateType;
  numerator: bigint;
  denominator: bigint;
  decimalValue: number;
  depthSeverance?: string;
}

export interface Reservation {
  id: string;
  instrumentId: string;
  estateType: EstateType;
  numerator: bigint;
  denominator: bigint;
  decimalValue: number;
  notes?: string;
}

export interface Exception {
  id: string;
  instrumentId: string;
  description: string;
  notes?: string;
}
