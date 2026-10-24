"use client";

import React, { useRef, useEffect, useState } from "react";
import { Sparkles, X, ChevronRight, MessageSquare, BrainCircuit, Loader2 } from "lucide-react";
import { useCoPilot } from "../providers/CoPilotProvider";
import { processCopilotMessage } from "@/actions/copilotActions";
import { usePathname } from "next/navigation";
import { useDrilldown } from "../providers/DrilldownProvider";
import { useWorkspace } from "../providers/WorkspaceProvider";

export function AICoPilot() {
  const { isOpen, setIsOpen, messages, addMessage } = useCoPilot();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspace();
  const { push, stack, clear } = useDrilldown();
  const currentView = stack.length > 0 ? stack[stack.length - 1] : null;

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", userMessage);
    setLoading(true);

    try {
      const propertyId = currentView?.type === 'PROPERTY' ? currentView.id : undefined;
      
      const response = await processCopilotMessage(userMessage, {
        currentPath: pathname,
        propertyId,
        workspaceContext: activeWorkspace.aiSystemContext
      });

      addMessage("ai", response.message);

      // Handle UI Actions if the AI decided to execute a tool
      if (response.uiAction) {
        if (response.uiAction.type === 'NAVIGATE') {
          clear();
        } else if (response.uiAction.type === 'CREATE_CAMPAIGN') {
          push({ id: response.uiAction.payload.propertyId, type: 'PROPERTY', label: 'Property CRM' });
        }
      }
    } catch (error) {
      console.error(error);
      addMessage("ai", "I encountered an error connecting to the intelligence engine.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex fixed bottom-6 right-6 p-4 bg-gradient-to-tr from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-2xl shadow-indigo-500/25 border border-indigo-400/30 transition-all hover:scale-105 active:scale-95 z-[120] items-center justify-center group"
        aria-label="Open AI Co-Pilot"
      >
        <Sparkles className="w-6 h-6 transition-transform group-hover:rotate-12" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[130] lg:hidden transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 border-l border-white/[0.08] bg-[#090909]/98 backdrop-blur-2xl flex flex-col h-full z-[135] shadow-2xl pt-safe pb-safe transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] bg-[#0c0c0c]/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-100 text-sm">AI Co-Pilot</h2>
              <p className="text-[10px] text-slate-400 font-mono">Grounded Intelligence Engine</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 hover:bg-white/[0.06] rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Close Co-Pilot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                  : 'bg-white/[0.04] text-slate-200 rounded-bl-none border border-white/[0.08]'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-80">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Co-Pilot</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/[0.04] text-slate-200 rounded-2xl rounded-bl-none border border-white/[0.08] px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06] bg-[#070707] shrink-0 safe-area-bottom">
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Ask anything about this parcel or market..." 
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              aria-label="Send Message"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2.5">
            Context-aware • Live on current workspace
          </p>
        </div>
      </div>
    </>
  );
}
