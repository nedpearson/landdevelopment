import { PropertyRecord, PropertyComp } from '@land-intelligence/domain';

export interface ParcelSearchQuery {
  state?: string;
  county?: string;
  apn?: string;
  minAcreage?: number;
  maxAcreage?: number;
  absenteeOnly?: boolean;
  taxDelinquentOnly?: boolean;
  maxAskingPrice?: number;
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  limit?: number;
  offset?: number;
}

export interface ParcelSearchResult {
  properties: PropertyRecord[];
  totalCount: number;
  provider: string;
  fetchedAt: string;
}

export interface IParcelProvider {
  name: string;
  searchParcels(query: ParcelSearchQuery): Promise<ParcelSearchResult>;
  getParcelByApn(state: string, county: string, apn: string): Promise<PropertyRecord | null>;
  getCompsForParcel(property: PropertyRecord, radiusMiles: number): Promise<PropertyComp[]>;
  healthCheck(): Promise<{ ok: boolean; message: string }>;
}
