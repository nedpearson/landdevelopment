"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { WorkspaceType, workspaceRegistry, WorkspaceDefinition } from "@/lib/workspace/WorkspaceRegistry";

interface WorkspaceContextType {
  activeWorkspace: WorkspaceDefinition;
  setWorkspace: (type: WorkspaceType) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeWorkspaceType, setActiveWorkspaceType] = useState<WorkspaceType>("LAND_INVESTOR");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("landos_active_workspace") as WorkspaceType;
    if (saved && workspaceRegistry[saved]) {
      setActiveWorkspaceType(saved);
    }
  }, []);

  const setWorkspace = (type: WorkspaceType) => {
    setActiveWorkspaceType(type);
    localStorage.setItem("landos_active_workspace", type);
    
    // Determine if the current route is valid for the new workspace
    const workspaceDef = workspaceRegistry[type];
    const isValidRoute = workspaceDef.navigation.some(nav => nav.href === pathname);
    
    if (!isValidRoute) {
      // If we are deep inside a dynamic route (e.g., /properties/[id]), let it stay. 
      // But if it's a top-level route not in this workspace, go home.
      if (pathname.split('/').length <= 2) {
        router.push('/');
      }
    }
  };

  const activeWorkspace = workspaceRegistry[activeWorkspaceType];

  if (!isMounted) {
    return null; // prevent hydration mismatch
  }

  return (
    <WorkspaceContext.Provider value={{ activeWorkspace, setWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
