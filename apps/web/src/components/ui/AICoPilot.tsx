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
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all z-[150] flex items-center justify-center"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="w-80 shrink-0 border-l border-slate-800 bg-slate-900/95 backdrop-blur-md flex flex-col h-screen z-40">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 rounded-md border border-indigo-500/30">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="font-bold text-slate-100">AI Co-Pilot</h2>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded-md text-slate-400 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
            }`}>
              {msg.role === 'ai' && (
                <div className="flex items-center gap-1.5 mb-1.5 opacity-70">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Co-Pilot</span>
                </div>
              )}
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 rounded-2xl rounded-bl-none border border-slate-700/50 px-4 py-3">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask anything..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-3">
          I am context-aware. I see the page you are on.
        </p>
      </div>
    </div>
  );
}
