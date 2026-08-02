"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type IndustryRole = 
  | "LAND_INVESTOR" 
  | "LANDMAN" 
  | "COMMERCIAL_BROKER" 
  | "PROPERTY_MANAGER" 
  | "RESIDENTIAL_REALTOR" 
  | "DEVELOPER" 
  | "RENEWABLE_DEVELOPER"
  | "APPRAISER";

interface IndustryRoleContextType {
  currentRole: IndustryRole;
  setRole: (role: IndustryRole) => void;
}

const IndustryRoleContext = createContext<IndustryRoleContextType | undefined>(undefined);

export function IndustryRoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<IndustryRole>("LAND_INVESTOR");

  // Persist role selection to local storage
  useEffect(() => {
    const savedRole = localStorage.getItem("industryRole") as IndustryRole;
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, []);

  const setRole = (role: IndustryRole) => {
    setCurrentRole(role);
    localStorage.setItem("industryRole", role);
  };

  return (
    <IndustryRoleContext.Provider value={{ currentRole, setRole }}>
      {children}
    </IndustryRoleContext.Provider>
  );
}

export function useIndustryRole() {
  const context = useContext(IndustryRoleContext);
  if (context === undefined) {
    throw new Error("useIndustryRole must be used within an IndustryRoleProvider");
  }
  return context;
}
