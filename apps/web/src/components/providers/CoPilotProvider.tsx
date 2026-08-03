"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useWorkspace } from "./WorkspaceProvider";
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
    { role: "ai", content: "Welcome to Land Intelligence. I can help you analyze properties, draft offers, run due diligence, and more. Add your first property to get started, or ask me anything about land investing." }
  ]);
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspace();

  const addMessage = (role: "system" | "user" | "ai", content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const triggerContextualAdvice = () => {
    // Simulated contextual advice based on route
    let advice = "I am monitoring this page. What would you like to know?";
    
    addMessage("ai", advice);
  };

  // Trigger proactive insights when role changes
  useEffect(() => {
    let isMounted = true;
    getProactiveInsights(activeWorkspace.type).then((insight) => {
      if (isMounted) {
        addMessage("ai", insight);
      }
    });
    return () => { isMounted = false; };
  }, [activeWorkspace.type]);

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
