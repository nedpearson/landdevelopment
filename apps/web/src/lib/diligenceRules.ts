import type { Property } from "@land-intelligence/database";

export interface DiligenceGap {
  id: string;
  field: string;
  description: string;
  severity: "HIGH" | "MEDIUM" | "LOW";
  actionUrl?: string;
}

export function evaluateDiligenceGaps(entityType: string, entityId: string, propertyData?: Property | null): DiligenceGap[] {
  const gaps: DiligenceGap[] = [];

  if (entityType === "PROPERTY" && propertyData) {
    const rawGeometry = propertyData.rawGeometry as Record<string, any> | null;
    const envAssessment = propertyData.environmentalAssessment as Record<string, any> | null;
    const zoningAssessment = propertyData.zoningAssessment as Record<string, any> | null;
    const utilityAssessment = propertyData.utilityAssessment as Record<string, any> | null;
    
    // Core Raw Land requirements
    if (!rawGeometry || Object.keys(rawGeometry).length === 0) {
      gaps.push({
        id: "gap-geom",
        field: "Boundary Geometry",
        description: "No GIS boundaries exist for this tract.",
        severity: "HIGH"
      });
    }

    if (!envAssessment || Object.keys(envAssessment).length === 0) {
      gaps.push({
        id: "gap-env",
        field: "Environmental Review",
        description: "Phase 1 ESA is missing. Wetlands and FEMA flood zones have not been evaluated.",
        severity: "HIGH"
      });
    }

    if (!propertyData.apn || propertyData.apn === "") {
      gaps.push({
        id: "gap-apn",
        field: "APN Missing",
        description: "The Assessor's Parcel Number is missing, which will block title searches.",
        severity: "HIGH"
      });
    }

    // Residential specific gaps
    if (zoningAssessment?.intendedUse === "RESIDENTIAL" || propertyData.lifecycleStage === "PROSPECT") {
      if (!zoningAssessment?.schoolDistrictRating) {
        gaps.push({
          id: "gap-school",
          field: "School District Rating",
          description: "Missing GreatSchools rating which heavily impacts SFR/BTR valuation.",
          severity: "MEDIUM"
        });
      }
      if (zoningAssessment?.hoaRestrictionsKnown === false || zoningAssessment?.hoaRestrictionsKnown === undefined) {
        gaps.push({
          id: "gap-hoa",
          field: "HOA Rental Restrictions",
          description: "Covenants and restrictions regarding long-term rentals are unknown.",
          severity: "MEDIUM"
        });
      }
    }

    // Commercial specific gaps
    if (zoningAssessment?.intendedUse === "COMMERCIAL" || propertyData.lifecycleStage === "PROSPECT") {
      if (!zoningAssessment?.trafficCount) {
        gaps.push({
          id: "gap-traffic",
          field: "Traffic Counts (AADT)",
          description: "Missing average daily traffic counts necessary for retail underwriting.",
          severity: "HIGH"
        });
      }
      if (!utilityAssessment?.waterTapVerified) {
        gaps.push({
          id: "gap-utils",
          field: "Utility Capacity",
          description: "Water and sewer capacity is unverified for high-density usage.",
          severity: "MEDIUM"
        });
      }
    }
  }

  if (entityType === "LEASE") {
    gaps.push({
      id: "gap-lease-term",
      field: "Expiration Date",
      description: "Lease expiration date is missing, risking holdover issues.",
      severity: "HIGH"
    });
    gaps.push({
      id: "gap-lease-payment",
      field: "Payment Terms",
      description: "Missing verification of monthly payment amounts or royalty fractions.",
      severity: "MEDIUM"
    });
  }

  return gaps;
}
