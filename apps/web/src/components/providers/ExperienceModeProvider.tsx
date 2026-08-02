"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type ExperienceLevel = "SIMPLE" | "GUIDED" | "EXPERT";

interface ExperienceModeState {
  mode: ExperienceLevel;
  setMode: (mode: ExperienceLevel) => void;
  isTourCompleted: boolean;
  completeTour: () => void;
}

const ExperienceModeContext = createContext<ExperienceModeState | undefined>(undefined);

export function ExperienceModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ExperienceLevel>("SIMPLE");
  const [isTourCompleted, setIsTourCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on client mount (simulate DB fetch)
  useEffect(() => {
    const savedMode = localStorage.getItem("landos_experience_mode") as ExperienceLevel;
    if (savedMode && ["SIMPLE", "GUIDED", "EXPERT"].includes(savedMode)) {
      setMode(savedMode);
    }
    const tourStatus = localStorage.getItem("landos_tour_completed") === "true";
    setIsTourCompleted(tourStatus);
    setIsLoaded(true);
  }, []);

  const handleSetMode = (newMode: ExperienceLevel) => {
    setMode(newMode);
    localStorage.setItem("landos_experience_mode", newMode);
  };

  const completeTour = () => {
    setIsTourCompleted(true);
    localStorage.setItem("landos_tour_completed", "true");
  };

  // Prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <ExperienceModeContext.Provider value={{ mode, setMode: handleSetMode, isTourCompleted, completeTour }}>
      {children}
    </ExperienceModeContext.Provider>
  );
}

export function useExperienceMode() {
  const context = useContext(ExperienceModeContext);
  if (context === undefined) {
    throw new Error("useExperienceMode must be used within an ExperienceModeProvider");
  }
  return context;
}
