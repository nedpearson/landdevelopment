"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface MapState {
  viewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  selectedFeatures: string[];
  activeLayers: string[];
}

interface MapContextType {
  state: MapState;
  setViewState: (viewState: MapState["viewState"]) => void;
  toggleFeatureSelection: (featureId: string) => void;
  toggleLayer: (layerId: string) => void;
}

const defaultState: MapState = {
  viewState: {
    longitude: -101.9,
    latitude: 31.4,
    zoom: 8,
  },
  selectedFeatures: [],
  activeLayers: ["tracts", "parcels"],
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<MapState>(defaultState);

  const setViewState = (viewState: MapState["viewState"]) => {
    setState((prev) => ({ ...prev, viewState }));
  };

  const toggleFeatureSelection = (featureId: string) => {
    setState((prev) => {
      const isSelected = prev.selectedFeatures.includes(featureId);
      return {
        ...prev,
        selectedFeatures: isSelected
          ? prev.selectedFeatures.filter((id) => id !== featureId)
          : [...prev.selectedFeatures, featureId],
      };
    });
  };

  const toggleLayer = (layerId: string) => {
    setState((prev) => {
      const isActive = prev.activeLayers.includes(layerId);
      return {
        ...prev,
        activeLayers: isActive
          ? prev.activeLayers.filter((id) => id !== layerId)
          : [...prev.activeLayers, layerId],
      };
    });
  };

  return (
    <MapContext.Provider
      value={{ state, setViewState, toggleFeatureSelection, toggleLayer }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapState = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapState must be used within a MapProvider");
  }
  return context;
};
