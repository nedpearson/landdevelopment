"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type EntityType = "PROPERTY" | "OWNER" | "LEASE" | "TRACT" | "DOCUMENT";

export interface DrilldownEntity {
  id: string;
  type: EntityType;
  label: string;
}

interface DrilldownContextType {
  stack: DrilldownEntity[];
  push: (entity: DrilldownEntity) => void;
  pop: () => void;
  clear: () => void;
}

const DrilldownContext = createContext<DrilldownContextType | undefined>(undefined);

export function DrilldownProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<DrilldownEntity[]>([]);

  const push = (entity: DrilldownEntity) => {
    setStack((prev) => [...prev, entity]);
  };

  const pop = () => {
    setStack((prev) => prev.slice(0, -1));
  };

  const clear = () => {
    setStack([]);
  };

  return (
    <DrilldownContext.Provider value={{ stack, push, pop, clear }}>
      {children}
    </DrilldownContext.Provider>
  );
}

export function useDrilldown() {
  const context = useContext(DrilldownContext);
  if (context === undefined) {
    throw new Error("useDrilldown must be used within a DrilldownProvider");
  }
  return context;
}
