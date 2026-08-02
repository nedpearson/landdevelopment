"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Map, User, FileText, X } from "lucide-react";
import { useDrilldown, EntityType } from "../providers/DrilldownProvider";
import { searchDatabase, SearchResult } from "@/app/actions/search";

export function UniversalSearch() {
  const { push } = useDrilldown();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await searchDatabase(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    push({ id: result.id, type: result.type, label: result.label });
    setIsOpen(false);
  };

  const ICONS: Record<EntityType, React.ReactNode> = {
    PROPERTY: <Map className="w-4 h-4 text-emerald-400" />,
    OWNER: <User className="w-4 h-4 text-sky-400" />,
    LEASE: <FileText className="w-4 h-4 text-amber-400" />,
    TRACT: <Map className="w-4 h-4 text-purple-400" />,
    DOCUMENT: <FileText className="w-4 h-4 text-rose-400" />
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[200] bg-slate-950/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-x-0 top-[10%] mx-auto z-[201] w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parcels, owners, leases, APNs..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-500"
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isSearching && (
            <div className="p-4 text-sm text-slate-500 text-center animate-pulse">Searching global intelligence...</div>
          )}
          {!isSearching && query && results.length === 0 && (
            <div className="p-4 text-sm text-slate-500 text-center">No results found for "{query}"</div>
          )}
          {!isSearching && results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full text-left flex items-center gap-4 p-3 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-0"
            >
              <div className="p-2 rounded-lg bg-slate-800 shrink-0">
                {ICONS[result.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-200 truncate">{result.label}</h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase">{result.type}</span>
                </div>
                {result.subtitle && <p className="text-xs text-slate-500 truncate">{result.subtitle}</p>}
              </div>
            </button>
          ))}
          {!query && (
            <div className="p-4 text-xs text-slate-500 text-center flex items-center justify-center gap-4">
              <span>Pro Tip: Press <kbd className="bg-slate-800 border border-slate-700 px-1 rounded mx-1">Cmd</kbd> + <kbd className="bg-slate-800 border border-slate-700 px-1 rounded mx-1">K</kbd> to open anytime</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
