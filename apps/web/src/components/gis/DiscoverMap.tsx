"use client";

import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { getMapProperties } from '@/actions/mapActions';
import { MapPin, Target, DollarSign, Zap, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { useDrilldown } from '../providers/DrilldownProvider';
import { useWorkspace } from '../providers/WorkspaceProvider';
import { SourceProvenanceModal } from '../common/SourceProvenance';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function DiscoverMap() {
  const [properties, setProperties] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [provenanceProperty, setProvenanceProperty] = useState<any | null>(null);
  const { push } = useDrilldown();
  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    getMapProperties().then(res => {
      if (res.success && res.data) {
        setProperties(res.data);
      }
    });
  }, []);

  if (!MAPBOX_TOKEN) {
    return <div className="flex h-full items-center justify-center text-red-400 bg-slate-900">Mapbox Token Missing</div>;
  }

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: -98.5795,
          latitude: 36.5,
          zoom: 4.2
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {properties.map((property) => {
          if (!property.centroidLng || !property.centroidLat) return null;
          
          const isHighValue = property.dealScore > 80;
          let pinColor = "text-indigo-400 fill-indigo-500/80";
          if (activeWorkspace.type === "LAND_INVESTOR" && isHighValue) pinColor = "text-emerald-400 fill-emerald-500/80";
          if (activeWorkspace.type === "DEVELOPER" && property.acreage > 50) pinColor = "text-orange-400 fill-orange-500/80";

          return (
            <Marker
              key={property.id}
              longitude={property.centroidLng}
              latitude={property.centroidLat}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setPopupInfo(property);
              }}
            >
              <div className="cursor-pointer transition-transform hover:scale-125">
                <MapPin className={`w-7 h-7 drop-shadow-lg ${pinColor}`} />
              </div>
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.centroidLng}
            latitude={popupInfo.centroidLat}
            onClose={() => setPopupInfo(null)}
            className="z-50"
          >
            <div className="p-3.5 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-200">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-white text-sm font-mono truncate">{popupInfo.apn}</h3>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {popupInfo.lifecycleStage}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{popupInfo.acreage?.toFixed(1)} Acres • {popupInfo.county}, {popupInfo.state}</p>
              
              <div className="space-y-1.5 mb-3 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Market Value</span>
                  <span className="font-bold text-emerald-400">
                    {popupInfo.estimatedMarketValue ? `$${popupInfo.estimatedMarketValue.toLocaleString()}` : 'Underwriting'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Deal Score</span>
                  <span className="font-bold text-emerald-400">{popupInfo.dealScore || 85}/100</span>
                </div>
                {popupInfo.provenance?.provider && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-700/40">
                    <span className="text-slate-400">Source</span>
                    <button 
                      onClick={() => setProvenanceProperty(popupInfo)}
                      className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <ShieldCheck className="w-3 h-3" /> {popupInfo.provenance.provider.split(' ')[0]} CAD
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-1.5">
                <Link
                  href={`/properties/${popupInfo.id}`}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  Open Property Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button 
                  onClick={() => push({ id: popupInfo.id, type: "PROPERTY", label: popupInfo.apn })}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                >
                  Inspect in Workspace Drawer
                </button>
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {provenanceProperty && (
        <SourceProvenanceModal
          isOpen={Boolean(provenanceProperty)}
          onClose={() => setProvenanceProperty(null)}
          property={provenanceProperty}
        />
      )}
    </div>
  );
}
