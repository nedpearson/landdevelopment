"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useMapState } from "./MapProvider";

export function SearchControl() {
  const [query, setQuery] = useState("");
  const { setViewState } = useMapState();

  useEffect(() => {
    if (!query || query.length < 3) return;

    const timer = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) return;

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const [lng, lat] = data.features[0].center;
          setViewState({
            longitude: lng,
            latitude: lat,
            zoom: 12
          });
        }
      } catch (err) {
        console.error("Geocoding failed", err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [query, setViewState]);

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex items-center glass-panel shadow-2xl rounded-xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="px-3 text-slate-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="bg-transparent border-none outline-none py-2.5 pr-4 text-[13px] text-slate-200 placeholder:text-slate-500 min-w-[220px]"
        />
      </div>
    </div>
  );
}
