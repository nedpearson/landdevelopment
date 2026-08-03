"use server";

import { prisma } from "@land-intelligence/database";
import { ActionResult } from "./types";

const currentOrganizationId = "org_default";

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findFirst({
      where: { 
        id,
        organizationId: currentOrganizationId
      },
      include: {
        comps: true,
        sellers: {
          include: {
            seller: true
          }
        },
        dueDiligenceItems: true,
      }
    });
    
    if (!property) return null;
    
    return property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export async function getAllProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        organizationId: currentOrganizationId
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        apn: true,
        county: true,
        state: true,
        acreage: true,
        lifecycleStage: true,
        ownerName: true,
        rawGeometry: true,
        centroidLat: true,
        centroidLng: true
      }
    });
    return properties;
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export interface CreatePropertyInput {
  apn: string;
  county: string;
  state: string;
  address?: string;
  zipCode?: string;
  acreage: number;
  usableAcreage?: number;
  ownerName: string;
  mailingAddress?: string;
  propertyClass?: any;
  askingPrice?: number;
  lifecycleStage?: any;
  centroidLat?: number;
  centroidLng?: number;
  legalDescription?: string;
}

export async function createProperty(data: CreatePropertyInput): Promise<ActionResult<{id: string}>> {
  try {
    const property = await prisma.property.create({
      data: {
        ...data,
        usableAcreage: data.usableAcreage ?? data.acreage,
        organizationId: currentOrganizationId,
        lifecycleStage: (data.lifecycleStage as any) ?? "PROSPECT",
      }
    });
    return { success: true, data: { id: property.id } };
  } catch (error: any) {
    console.error("Error creating property:", error);
    return { success: false, error: error.message || "Failed to create property" };
  }
}

export async function updateProperty(id: string, data: Partial<CreatePropertyInput>): Promise<ActionResult<{id: string}>> {
  try {
    const property = await prisma.property.update({
      where: { id, organizationId: currentOrganizationId },
      data
    });
    return { success: true, data: { id: property.id } };
  } catch (error: any) {
    console.error("Error updating property:", error);
    return { success: false, error: error.message || "Failed to update property" };
  }
}

export async function searchProperties(query: string, filters?: any): Promise<ActionResult<any[]>> {
  try {
    const properties = await prisma.property.findMany({
      where: {
        organizationId: currentOrganizationId,
        OR: query ? [
          { apn: { contains: query, mode: "insensitive" } },
          { ownerName: { contains: query, mode: "insensitive" } },
          { county: { contains: query, mode: "insensitive" } },
          { state: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ] : undefined,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        apn: true,
        county: true,
        state: true,
        acreage: true,
        lifecycleStage: true,
        ownerName: true,
        rawGeometry: true,
        centroidLat: true,
        centroidLng: true
      }
    });
    return { success: true, data: properties };
  } catch (error: any) {
    console.error("Error searching properties:", error);
    return { success: false, error: error.message || "Failed to search properties" };
  }
}

export async function exportPropertiesCSV(filters?: any): Promise<ActionResult<string>> {
  try {
    const properties = await prisma.property.findMany({
      where: {
        organizationId: currentOrganizationId,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (properties.length === 0) {
      return { success: true, data: "APN,County,State,Acreage,Owner\n" };
    }

    const headers = ["APN", "County", "State", "Acreage", "Owner"];
    const rows = properties.map(p => [
      p.apn, 
      p.county, 
      p.state, 
      p.acreage.toString(), 
      p.ownerName || ""
    ].join(","));
    
    const csv = [headers.join(","), ...rows].join("\n");
    return { success: true, data: csv };
  } catch (error: any) {
    console.error("Error exporting properties:", error);
    return { success: false, error: error.message || "Failed to export properties" };
  }
}

export async function updatePropertyStage(id: string, stage: any): Promise<ActionResult<{id: string}>> {
  try {
    const property = await prisma.property.update({
      where: { id, organizationId: currentOrganizationId },
      data: { lifecycleStage: stage }
    });
    return { success: true, data: { id: property.id } };
  } catch (error: any) {
    console.error("Error updating property stage:", error);
    return { success: false, error: error.message || "Failed to update property stage" };
  }
}
