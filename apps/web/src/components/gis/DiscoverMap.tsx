"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapProperties } from '@/actions/mapActions';
import { MapPin, Target, DollarSign, Zap } from 'lucide-react';
import { useDrilldown } from '../providers/DrilldownProvider';
import { useIndustryRole } from '../providers/IndustryRoleProvider';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export function DiscoverMap() {
  const [properties, setProperties] = useState<any[]>([]);
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const { push } = useDrilldown();
  const { currentRole } = useIndustryRole();

  useEffect(() => {
    getMapProperties().then(setProperties);
  }, []);

  if (!MAPBOX_TOKEN) {
    return <div className="flex h-full items-center justify-center text-red-400 bg-slate-900">Mapbox Token Missing</div>;
  }

  return (
    <div className="w-full h-full relative">
      <Map
        initialViewState={{
          longitude: -98.5795,
          latitude: 39.8283,
          zoom: 4
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {properties.map((property) => {
          if (!property.centroidLng || !property.centroidLat) return null;
          
          // Color logic based on role and score
          const isHighValue = property.dealScore > 80;
          let pinColor = "text-indigo-400";
          if (currentRole === "LAND_INVESTOR" && isHighValue) pinColor = "text-emerald-400";
          if (currentRole === "DEVELOPER" && property.acreage > 50) pinColor = "text-orange-400";

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
              <MapPin className={`w-6 h-6 cursor-pointer drop-shadow-lg ${pinColor}`} />
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
            <div className="p-3 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-xl text-slate-200">
              <h3 className="font-bold text-white text-sm mb-1">{popupInfo.apn}</h3>
              <p className="text-xs text-slate-400 mb-3">{popupInfo.acreage} Acres • {popupInfo.county}, {popupInfo.state}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Asking Price</span>
                  <span className="font-bold text-white">${popupInfo.askingPrice?.toLocaleString() || 'Unpriced'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Deal Score</span>
                  <span className="font-bold text-emerald-400">{popupInfo.dealScore || 50}/100</span>
                </div>
                {currentRole === "LAND_INVESTOR" && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">AI Signal</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1"><Target className="w-3 h-3"/> Flip Target</span>
                  </div>
                )}
                {currentRole === "DEVELOPER" && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">AI Signal</span>
                    <span className="font-bold text-orange-400 flex items-center gap-1"><Zap className="w-3 h-3"/> High Density</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => push({ id: popupInfo.id, type: "PROPERTY", label: popupInfo.apn })}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Open Property Drilldown
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
