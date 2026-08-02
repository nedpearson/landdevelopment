import type { Property } from "@land-intelligence/database";

export interface NextAction {
  id: string;
  title: string;
  description: string;
  actionText: string;
  priority: number;
}

export function evaluateNextBestAction(entityType: string, entityId: string, propertyData?: Property | null): NextAction | null {
  if (entityType !== "PROPERTY" || !propertyData) return null;

  const envAssessment = propertyData.environmentalAssessment as Record<string, any> | null;
  const zoningAssessment = propertyData.zoningAssessment as Record<string, any> | null;
  const utilityAssessment = propertyData.utilityAssessment as Record<string, any> | null;

  // Live Rule Engine
  if (zoningAssessment?.intendedUse === "RESIDENTIAL") {
    return {
      id: "action-sfr",
      title: "Run SFR Rental Comps",
      description: "To model this as a Build-to-Rent community, we need to establish the baseline gross yield based on comparable new-build rents in this ZIP code.",
      actionText: "Generate Market Rent Report",
      priority: 1
    };
  }

  if (!envAssessment || !envAssessment.floodZoneVerified) {
    return {
      id: "action-flood",
      title: "Review FEMA Flood Zone Impact",
      description: "Flood zones have not been verified. You need to determine if the remaining buildable acreage supports your financial model.",
      actionText: "Order Flood Elevation Certificate",
      priority: 1
    };
  }
  
  if (zoningAssessment?.intendedUse === "COMMERCIAL" && !utilityAssessment?.waterTapVerified) {
    return {
      id: "action-utils",
      title: "Verify Water & Sewer Capacity",
      description: "Commercial zoning requires significant utility infrastructure. It is currently unknown if the county lines reach this parcel.",
      actionText: "Request Will-Serve Letter",
      priority: 1
    };
  }

  // Default Action
  return {
    id: "action-default",
    title: "Generate Purchase Offer",
    description: "Diligence looks solid. The next logical step is to secure site control.",
    actionText: "Draft Letter of Intent (LOI)",
    priority: 1
  };
}
