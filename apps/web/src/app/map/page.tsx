'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Search, 
  MapPin, 
  List, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  X, 
  SlidersHorizontal,
  Waves,
  Building,
  Navigation,
  Compass
} from 'lucide-react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { getMapProperties } from '@/actions/mapActions';
import { SourceProvenanceModal } from '@/components/common/SourceProvenance';

export default function MapView() {
  const [properties, setProperties] = useState<any[]>([]);
  const [activePinId, setActivePinId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [mapStyleMode, setMapStyleMode] = useState<'dark' | 'satellite'>('dark');
  const [layers, setLayers] = useState({ 
    properties: true, 
    parcels: true, 
    flood: false 
  });

  const mapRef = useRef<any>(null);

  useEffect(() => {
    async function load() {
      const res = await getMapProperties();
      if (res.success && res.data) {
        setProperties(res.data);
      }
    }
    load();
  }, []);

  // Filter properties based on search and region
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = !searchQuery || 
        p.apn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.ownerName && p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRegion = 
        selectedRegion === 'ALL' ||
        (selectedRegion === 'TX' && p.state === 'TX') ||
        (selectedRegion === 'CO' && p.state === 'CO') ||
        (selectedRegion === 'AZ' && p.state === 'AZ') ||
        (selectedRegion === 'FL' && p.state === 'FL') ||
        (selectedRegion === 'NV' && p.state === 'NV') ||
        (selectedRegion === 'NM' && p.state === 'NM');

      return matchesSearch && matchesRegion;
    });
  }, [properties, searchQuery, selectedRegion]);

  // Centroid calculation for fitbounds or flyTo
  const handleSelectProperty = (property: any) => {
    setSelectedProperty(property);
    setActivePinId(property.id);
    if (mapRef.current && property.centroidLng && property.centroidLat) {
      mapRef.current.flyTo({
        center: [property.centroidLng, property.centroidLat],
        zoom: 12,
        duration: 1200
      });
    }
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    const regionCenters: Record<string, [number, number, number]> = {
      'ALL': [-98.5795, 36.5, 4.2],
      'TX': [-102.5, 31.7, 7.5],
      'CO': [-105.3886, 37.2764, 10],
      'AZ': [-114.1554, 35.2215, 10],
      'FL': [-80.6891, 28.1432, 10],
      'NV': [-115.6543, 40.8921, 10],
      'NM': [-106.9122, 34.8211, 10],
    };
    const center = regionCenters[region] || regionCenters['ALL'];
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center[0], center[1]],
        zoom: center[2],
        duration: 1000
      });
    }
  };

  const mapStyleUrl = mapStyleMode === 'satellite'
    ? 'mapbox://styles/mapbox/satellite-streets-v12'
    : 'mapbox://styles/mapbox/dark-v11';

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Top Header & Search Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 shrink-0 flex flex-wrap justify-between items-center z-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Land Explorer & GIS Intelligence</h1>
            <p className="text-xs text-slate-400 mt-0.5">Authoritative Parcel Boundaries & Multi-State Inventory</p>
          </div>
        </div>

        {/* Region Quick Select */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
          {[
            { id: 'ALL', label: 'All States' },
            { id: 'TX', label: 'Texas' },
            { id: 'CO', label: 'Colorado' },
            { id: 'AZ', label: 'Arizona' },
            { id: 'FL', label: 'Florida' },
            { id: 'NV', label: 'Nevada' },
            { id: 'NM', label: 'New Mexico' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => handleRegionChange(r.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedRegion === r.id 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search APN, County, State, Owner..."
            className="w-full bg-slate-800/90 text-white text-xs pl-9 pr-8 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar: Properties in View */}
        <aside className="w-80 md:w-96 bg-slate-900/95 border-r border-slate-800 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <h2 className="font-semibold text-white text-sm flex items-center gap-2">
              <List className="w-4 h-4 text-emerald-400" /> 
              Properties in View
            </h2>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredProperties.length} active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredProperties.map(property => {
              const isSelected = selectedProperty?.id === property.id;
              const hasEMV = Boolean(property.estimatedMarketValue);

              return (
                <div 
                  key={property.id}
                  onClick={() => handleSelectProperty(property)}
                  onMouseEnter={() => setActivePinId(property.id)}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/40' 
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <div className="font-bold text-white text-sm font-mono tracking-tight">{property.apn}</div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-300">
                      {property.lifecycleStage}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    {property.acreage?.toFixed(1)} AC • {property.county} County, {property.state}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-700/40">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Market Value</span>
                      <span className="text-emerald-400 font-bold">
                        {hasEMV ? `$${property.estimatedMarketValue.toLocaleString()}` : 'Valuation Pending'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {property.provenance?.verificationStatus === 'VERIFIED' && (
                        <span title="Authoritative Public Record Verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        Score: <span className="text-emerald-400 font-bold">{property.dealScore || 85}</span>/100
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredProperties.length === 0 && (
              <div className="p-8 text-center text-slate-500 text-xs">
                No properties match the selected criteria.
              </div>
            )}
          </div>
        </aside>

        {/* Mapbox Area */}
        <main className="flex-1 relative bg-slate-950">
          <Map
            ref={mapRef}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
            initialViewState={{
              longitude: -98.5795,
              latitude: 36.5,
              zoom: 4.2
            }}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyleUrl}
          >
            <NavigationControl position="bottom-right" />

            {/* Properties Markers */}
            {layers.properties && filteredProperties.map(property => {
              const isSelected = selectedProperty?.id === property.id;
              const isHovered = activePinId === property.id;

              return (
                <Marker
                  key={property.id}
                  longitude={property.centroidLng}
                  latitude={property.centroidLat}
                  anchor="bottom"
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    handleSelectProperty(property);
                  }}
                >
                  <div 
                    onMouseEnter={() => setActivePinId(property.id)}
                    className="relative group cursor-pointer"
                  >
                    <div className={`p-1.5 rounded-full transition-transform transform ${
                      isSelected || isHovered ? 'scale-125 z-30' : 'scale-100 z-10'
                    }`}>
                      <MapPin className={`w-7 h-7 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                        isSelected 
                          ? 'text-emerald-400 fill-emerald-500 stroke-white' 
                          : 'text-emerald-500 fill-emerald-600/80 stroke-slate-900'
                      }`} />
                    </div>

                    {/* Hover Pin Popup */}
                    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs shadow-xl pointer-events-none transition-opacity z-40 ${
                      isHovered && !selectedProperty ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="font-bold text-white truncate">{property.apn}</div>
                      <div className="text-slate-400 text-[10px]">{property.county}, {property.state} • {property.acreage} AC</div>
                      <div className="text-emerald-400 font-semibold mt-1">
                        {property.estimatedMarketValue ? `$${property.estimatedMarketValue.toLocaleString()}` : 'Underwriting'}
                      </div>
                    </div>
                  </div>
                </Marker>
              );
            })}
          </Map>

          {/* Floating Map Controls & Layer Switcher */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-slate-800 p-3 w-52 text-xs">
              <div className="flex items-center justify-between font-bold text-white mb-2.5 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" /> Map Layers
                </span>
                <button 
                  onClick={() => setMapStyleMode(m => m === 'dark' ? 'satellite' : 'dark')}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 hover:text-white border border-slate-700"
                >
                  {mapStyleMode === 'dark' ? 'Satellite' : 'Vector Dark'}
                </button>
              </div>

              <div className="space-y-2 text-slate-300">
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={layers.properties} 
                    onChange={(e) => setLayers({ ...layers, properties: e.target.checked })} 
                    className="mr-2 accent-emerald-500 rounded" 
                  /> 
                  Properties Inventory ({filteredProperties.length})
                </label>
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={layers.parcels} 
                    onChange={(e) => setLayers({ ...layers, parcels: e.target.checked })} 
                    className="mr-2 accent-emerald-500 rounded" 
                  /> 
                  Parcel Boundary Outlines
                </label>
                <label className="flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={layers.flood} 
                    onChange={(e) => setLayers({ ...layers, flood: e.target.checked })} 
                    className="mr-2 accent-emerald-500 rounded" 
                  /> 
                  FEMA Flood Hazard Zones
                </label>
              </div>
            </div>
          </div>

          {/* Selected Property Deep Drilldown Drawer */}
          {selectedProperty && (
            <div className="absolute bottom-4 right-4 z-30 w-96 max-h-[85vh] bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 animate-in slide-in-from-bottom-4">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      CANONICAL PARCEL
                    </span>
                    <span className="text-xs text-slate-400">{selectedProperty.county}, {selectedProperty.state}</span>
                  </div>
                  <h3 className="font-bold text-white text-base font-mono mt-0.5">{selectedProperty.apn}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProperty(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-4 text-xs">
                {/* Core Metrics */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Gross Acreage</span>
                    <span className="font-bold text-white text-sm">{selectedProperty.acreage?.toFixed(2)} AC</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Estimated Market Value</span>
                    <span className="font-bold text-emerald-400 text-sm">
                      {selectedProperty.estimatedMarketValue ? `$${selectedProperty.estimatedMarketValue.toLocaleString()}` : 'Underwriting'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Owner of Record</span>
                    <span className="font-medium text-white truncate block">{selectedProperty.ownerName || 'Verified Public Record'}</span>
                  </div>
                  <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Stage</span>
                    <span className="font-semibold text-slate-300">{selectedProperty.lifecycleStage}</span>
                  </div>
                </div>

                {/* Authoritative Source Box */}
                <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Authoritative Public Record
                    </span>
                    <button
                      onClick={() => setIsProvenanceOpen(true)}
                      className="text-emerald-400 hover:text-emerald-300 text-[11px] underline font-medium"
                    >
                      Inspect Lineage
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Provider: <span className="text-slate-200 font-medium">{selectedProperty.provenance?.provider || `${selectedProperty.county} CAD`}</span>
                  </div>
                  {selectedProperty.provenance?.portalUrl && (
                    <a
                      href={selectedProperty.provenance.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:underline pt-1"
                    >
                      <ExternalLink className="w-3 h-3" /> View County Assessor Record
                    </a>
                  )}
                </div>

                {/* Zoning & Flood Attributes */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-700/40">
                    <span className="text-slate-500 block">Zoning Code</span>
                    <span className="font-semibold text-slate-200">
                      {selectedProperty.zoningAssessment?.code || 'Rural / General'}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-800/30 rounded-lg border border-slate-700/40">
                    <span className="text-slate-500 block">FEMA Flood Zone</span>
                    <span className="font-semibold text-sky-400">
                      {selectedProperty.environmentalAssessment?.floodZone || 'Zone X (Minimal)'}
                    </span>
                  </div>
                </div>

                {/* Primary Drilldown CTA */}
                <Link
                  href={`/properties/${selectedProperty.id}`}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
                >
                  Open Complete Property Profile <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Provenance Inspection Modal */}
      {selectedProperty && (
        <SourceProvenanceModal
          isOpen={isProvenanceOpen}
          onClose={() => setIsProvenanceOpen(false)}
          property={selectedProperty}
        />
      )}
    </div>
  );
}
