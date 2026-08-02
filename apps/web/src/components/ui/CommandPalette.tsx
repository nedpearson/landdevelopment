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
    <Command.Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
      label="Global Command Menu"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
    >
      <div className="fixed inset-0 bg-[#030303]/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden relative z-50 transform transition-all animate-slide-up">
        <div className="flex items-center px-4 py-4 border-b border-white/[0.05]">
          <Search className="w-5 h-5 text-slate-500 mr-3 shrink-0" />
          <Command.Input 
            value={search}
            onValueChange={setSearch}
            placeholder="Search parcels, owners, or type natural language (e.g. 'large texas multifamily')..." 
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 text-[15px] font-sans"
          />
          <div className="flex items-center gap-1.5 ml-4">
            <kbd className="bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-xs text-slate-400 font-sans">esc</kbd>
          </div>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          {loading && (
            <div className="flex items-center justify-center p-8 text-slate-500 gap-2 text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </div>
          )}
          
          {!loading && results.length === 0 && search.length > 2 && (
            <div className="py-14 text-center">
              <p className="text-slate-400 text-sm font-medium">No results found.</p>
              <p className="text-slate-600 text-xs mt-1">Try searching by APN, owner name, or state.</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <Command.Group heading={<div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Results</div>}>
              {results.map((result) => (
                <Command.Item
                  key={result.id}
                  value={result.title}
                  onSelect={() => handleSelect(result)}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer aria-selected:bg-white/[0.04] aria-selected:text-white text-slate-300 transition-colors group"
                >
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex-shrink-0 group-aria-selected:bg-indigo-500/10 group-aria-selected:border-indigo-500/20 transition-colors">
                    {result.type === "AI_FILTER" && <Sparkles className="w-4 h-4 text-indigo-400" />}
                    {result.type === "PROPERTY" && <Map className="w-4 h-4 text-emerald-400" />}
                    {result.type === "SELLER" && <User className="w-4 h-4 text-sky-400" />}
                    {result.type === "OWNER" && <User className="w-4 h-4 text-sky-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-200 truncate group-aria-selected:text-white transition-colors">{result.title}</div>
                    <div className="text-sm text-slate-500 truncate mt-0.5">{result.subtitle}</div>
                  </div>
                  <div className="text-[10px] font-sans font-medium uppercase tracking-wider text-slate-500 px-2 py-1 bg-white/[0.02] rounded-md border border-white/[0.04]">
                    {result.type}
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
