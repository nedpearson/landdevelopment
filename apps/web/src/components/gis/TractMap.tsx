"use client";

import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl/mapbox";
import { MapShell } from "./core/MapShell";
import { useDrilldown } from "../providers/DrilldownProvider";

interface TractMapProps {
  tracts: any[];
  onTractSelect?: (tractId: string) => void;
  selectedTractId?: string | null;
}

export function TractMap({ tracts, onTractSelect, selectedTractId }: TractMapProps) {
  const { push } = useDrilldown();

  const geojson = useMemo(() => {
    const features = tracts.map((t, index) => {
      // Use live rawGeometry if it exists and is a valid GeoJSON polygon/multipolygon
      let geometry = t.rawGeometry;
      
      // Fallback for mock data or missing geometry
      if (!geometry || !geometry.type) {
        const baseLng = -101.9 + (index % 5) * 0.05;
        const baseLat = 31.4 + Math.floor(index / 5) * 0.05;
        
        geometry = {
          type: "Polygon",
          coordinates: [[
            [baseLng, baseLat],
            [baseLng + 0.03, baseLat],
            [baseLng + 0.03, baseLat + 0.03],
            [baseLng, baseLat + 0.03],
            [baseLng, baseLat]
          ]]
        };
      }

      return {
        type: "Feature",
        properties: {
          id: t.id,
          name: t.ownerName || t.apn || t.id,
          selected: t.id === selectedTractId
        },
        geometry,
      };
    });

    return { type: "FeatureCollection", features };
  }, [tracts, selectedTractId]);

  const onMapClick = (event: any) => {
    const feature = event.features && event.features[0];
    if (feature && feature.properties?.id) {
      if (onTractSelect) onTractSelect(feature.properties.id);
      // Automatically trigger drilldown
      push({ id: feature.properties.id, type: "PROPERTY", label: feature.properties.name });
    } else {
      if (onTractSelect) onTractSelect("");
    }
  };

  return (
    <MapShell interactiveLayerIds={["tract-fills"]} onClick={onMapClick}>
      <Source id="tracts" type="geojson" data={geojson as any}>
        <Layer
          id="tract-fills"
          type="fill"
          paint={{
            "fill-color": [
              "case",
              ["boolean", ["get", "selected"], false],
              "#10b981",
              "#3b82f6"
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["get", "selected"], false],
              0.6,
              0.3
            ]
          }}
        />
        <Layer
          id="tract-outlines"
          type="line"
          paint={{
            "line-color": [
              "case",
              ["boolean", ["get", "selected"], false],
              "#34d399",
              "#60a5fa"
            ],
            "line-width": 2
          }}
        />
      </Source>
    </MapShell>
  );
}
