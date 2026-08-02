"use client";

import React, { useState } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { useExperienceMode } from "../providers/ExperienceModeProvider";
import { askPortfolioAssistant } from "@/actions/aiActions";

export function AIGuide() {
  const { mode } = useExperienceMode();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai", text: string }[]>([
    { role: "ai", text: "Hi! I'm your Land Intelligence AI. How can I help you evaluate your portfolio today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (mode === "EXPERT") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query;
    setQuery("");
    setMessages(prev => [...prev, { role: "user", text: userQuery }]);
    setIsLoading(true);

    try {
      const response = await askPortfolioAssistant(userQuery);
      setMessages(prev => [...prev, { role: "ai", text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I ran into an issue connecting to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg shadow-indigo-900/50 transition-transform hover:scale-105"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* Slide-over Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-indigo-950/30">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">AI Guide</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-none" : "bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-lg text-sm bg-slate-800 border border-slate-700 text-slate-400 rounded-bl-none">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-950">
            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                placeholder="Ask a question..." 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-10 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 disabled:opacity-50"
              />
              <button 
                type="submit" 
                disabled={!query.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-indigo-400 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
