"use client";

import React, { useMemo, useState } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Default map style - Mapbox Dark
const MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

interface TractMapProps {
  tracts: any[]; // Expecting an array of tract data, including geometry (if available)
  onTractSelect?: (tractId: string) => void;
  selectedTractId?: string | null;
}

export function TractMap({ tracts, onTractSelect, selectedTractId }: TractMapProps) {
  const [viewState, setViewState] = useState({
    longitude: -101.9, // Default to a central location (e.g., Texas panhandle/Reeves county area)
    latitude: 31.4,
    zoom: 8,
  });

  // Convert the tract data to a GeoJSON FeatureCollection
  const geojson = useMemo(() => {
    // Generate dummy square polygons for visualization if no actual geometry is passed
    const features = tracts.map((t, index) => {
      // Very simple offset based on index to spread them out as dummy data
      const baseLng = -101.9 + (index % 5) * 0.05;
      const baseLat = 31.4 + Math.floor(index / 5) * 0.05;
      
      const geometry = t.geometry || {
        type: "Polygon",
        coordinates: [[
          [baseLng, baseLat],
          [baseLng + 0.03, baseLat],
          [baseLng + 0.03, baseLat + 0.03],
          [baseLng, baseLat + 0.03],
          [baseLng, baseLat]
        ]]
      };

      return {
        type: "Feature",
        properties: {
          id: t.id,
          name: t.id,
          selected: t.id === selectedTractId
        },
        geometry,
      };
    });

    return {
      type: "FeatureCollection",
      features,
    };
  }, [tracts, selectedTractId]);

  const onMapClick = (event: any) => {
    const feature = event.features && event.features[0];
    if (feature && feature.properties?.id) {
      if (onTractSelect) {
        onTractSelect(feature.properties.id);
      }
    } else {
      if (onTractSelect) {
        onTractSelect(""); // Deselect
      }
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-slate-900 border border-amber-500/50 rounded-lg p-6 text-center">
        <div className="space-y-2">
          <p className="text-amber-400 font-semibold">Mapbox Token Missing</p>
          <p className="text-slate-400 text-sm">Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment to view the map.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-md overflow-hidden relative border border-slate-800">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={["tract-fills"]}
        onClick={onMapClick}
      >
        <Source id="tracts" type="geojson" data={geojson as any}>
          {/* Fill layer for the tracts */}
          <Layer
            id="tract-fills"
            type="fill"
            paint={{
              "fill-color": [
                "case",
                ["boolean", ["get", "selected"], false],
                "#10b981", // Emerald-500 when selected
                "#3b82f6"  // Blue-500 otherwise
              ],
              "fill-opacity": [
                "case",
                ["boolean", ["get", "selected"], false],
                0.6,
                0.3
              ]
            }}
          />
          {/* Outline layer for the tracts */}
          <Layer
            id="tract-outlines"
            type="line"
            paint={{
              "line-color": [
                "case",
                ["boolean", ["get", "selected"], false],
                "#34d399", // Emerald-400 when selected
                "#60a5fa"  // Blue-400 otherwise
              ],
              "line-width": 2
            }}
          />
        </Source>
      </Map>
    </div>
  );
}
