"use client";

import React, { useRef, useEffect } from "react";
import { Sparkles, X, ChevronRight, MessageSquare, BrainCircuit } from "lucide-react";
import { useCoPilot } from "../providers/CoPilotProvider";

export function AICoPilot() {
  const { isOpen, setIsOpen, messages } = useCoPilot();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
              <p className="leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask anything..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 text-center mt-3">
          I am context-aware. I see the page you are on.
        </p>
      </div>
    </div>
  );
}
