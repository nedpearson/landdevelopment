"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIndustryRole } from "./IndustryRoleProvider";
import { getProactiveInsights } from "@/actions/copilot";

interface CoPilotContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Array<{ role: "system" | "user" | "ai"; content: string }>;
  addMessage: (role: "system" | "user" | "ai", content: string) => void;
  triggerContextualAdvice: () => void;
}

const CoPilotContext = createContext<CoPilotContextType | undefined>(undefined);

export function CoPilotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true); // Always visible by default
  const [messages, setMessages] = useState<Array<{ role: "system" | "user" | "ai"; content: string }>>([
    { role: "ai", content: "Good morning. I am monitoring your workspace. Let me know if you need any property or financial analysis." }
  ]);
  const pathname = usePathname();
  const { currentRole } = useIndustryRole();

  const addMessage = (role: "system" | "user" | "ai", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const triggerContextualAdvice = () => {
    // Simulated contextual advice based on route
    let advice = "";
    if (pathname === "/") {
      advice = "I noticed you skipped Utility Verification on the Texas property. Would you like me to flag it for the civil engineer?";
    } else if (pathname === "/discover") {
      advice = "You are viewing raw market data. I recommend filtering by 'Commercial Zoning' if you are looking for high-yield flips.";
    } else {
      advice = "I am monitoring this page. What would you like to know?";
    }
    
    addMessage("ai", advice);
  };

  // Trigger proactive insights when role changes
  useEffect(() => {
    let isMounted = true;
    getProactiveInsights(currentRole).then((insight) => {
      if (isMounted) {
        addMessage("ai", insight);
      }
    });
    return () => { isMounted = false; };
  }, [currentRole]);

  // Trigger advice when navigating to certain pages
  useEffect(() => {
    if (pathname === "/discover") {
      const timer = setTimeout(triggerContextualAdvice, 3000); // Proactive tip after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <CoPilotContext.Provider value={{ isOpen, setIsOpen, messages, addMessage, triggerContextualAdvice }}>
      {children}
    </CoPilotContext.Provider>
  );
}

export function useCoPilot() {
  const context = useContext(CoPilotContext);
  if (context === undefined) {
    throw new Error("useCoPilot must be used within a CoPilotProvider");
  }
  return context;
}
