"use client";

import React, { ReactNode } from "react";
import Map from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { requireMapboxToken } from "./MapConfig";
import { useMapState } from "./MapProvider";

interface BaseMapProps {
  children?: ReactNode;
  interactiveLayerIds?: string[];
  onClick?: (event: any) => void;
}

export function BaseMap({ children, interactiveLayerIds, onClick }: BaseMapProps) {
  const token = requireMapboxToken();
  const { state, setViewState } = useMapState();

  return (
    <Map
      {...state.viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={token}
      interactiveLayerIds={interactiveLayerIds}
      onClick={onClick}
    >
      {children}
    </Map>
  );
}
