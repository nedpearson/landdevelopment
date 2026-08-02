"use client";

import React, { ReactNode } from "react";
import { MapProvider } from "./MapProvider";
import { MapErrorBoundary } from "./MapErrorBoundary";
import { BaseMap } from "./BaseMap";
import { SearchControl } from "./SearchControl";

interface MapShellProps {
  children?: ReactNode;
  interactiveLayerIds?: string[];
  onClick?: (event: any) => void;
}

export function MapShell({ children, interactiveLayerIds, onClick }: MapShellProps) {
  return (
    <div className="h-full w-full relative overflow-hidden rounded-md border border-slate-800 bg-slate-900">
      <MapErrorBoundary>
        <MapProvider>
          <SearchControl />
          <BaseMap interactiveLayerIds={interactiveLayerIds} onClick={onClick}>
            {children}
          </BaseMap>
        </MapProvider>
      </MapErrorBoundary>
    </div>
  );
}
