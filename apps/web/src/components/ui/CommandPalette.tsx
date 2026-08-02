"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useGlobalSearch } from "../providers/GlobalSearchProvider";
import { useDrilldown } from "../providers/DrilldownProvider";
import { globalSearch, SearchResult } from "@/actions/searchActions";
import { Search, Loader2, Map, User, Sparkles } from "lucide-react";

export function CommandPalette() {
  const { isOpen, setIsOpen } = useGlobalSearch();
  const { push } = useDrilldown();
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = useCallback((result: SearchResult) => {
    setIsOpen(false);
    push({
      id: result.id,
      type: result.type as any,
      label: result.title
    });
  }, [push, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm flex justify-center items-start pt-[15vh]">
      {/* Click outside to close */}
      <div className="absolute inset-0 z-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <Command label="Global Command Menu" shouldFilter={false}>
          <div className="flex items-center border-b border-slate-700 px-4 py-3 gap-3 bg-slate-950">
            <Search className="w-5 h-5 text-slate-400" />
            <Command.Input 
              value={query}
              onValueChange={setQuery}
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-lg"
              placeholder="Search properties, APNs, owners, phone numbers..."
            />
            {loading && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
            <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700 hidden sm:block">
              ESC
            </div>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2">
            {query.length >= 2 && results.length === 0 && !loading && (
              <Command.Empty className="py-6 text-center text-slate-400 text-sm">
                No results found for "{query}".
              </Command.Empty>
            )}

            {results.length > 0 && (
              <Command.Group heading="Global Results" className="text-xs font-semibold text-slate-500 px-2 py-3 uppercase tracking-wider">
                {results.map((result) => (
                  <Command.Item
                    key={`${result.type}-${result.id}`}
                    value={`${result.type}-${result.id}`}
                    onSelect={() => onSelect(result)}
                    className="flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer aria-selected:bg-indigo-900/40 aria-selected:text-white text-slate-300 transition-colors"
                  >
                    <div className="p-2 rounded bg-slate-800 border border-slate-700 flex-shrink-0">
                      {result.type === "AI_FILTER" && <Sparkles className="w-5 h-5 text-indigo-400" />}
                      {result.type === "PROPERTY" && <Map className="w-5 h-5 text-emerald-400" />}
                      {result.type === "SELLER" && <User className="w-5 h-5 text-sky-400" />}
                      {result.type === "OWNER" && <User className="w-5 h-5 text-sky-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white truncate">{result.title}</div>
                      <div className="text-sm text-slate-400 truncate">{result.subtitle}</div>
                    </div>
                    <div className="text-xs font-mono text-slate-500 px-2 py-1 bg-slate-950 rounded border border-slate-800">
                      {result.type}
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
