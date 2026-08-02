"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalSearchContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <GlobalSearchContext.Provider value={{ isOpen, setIsOpen, toggle }}>
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}
