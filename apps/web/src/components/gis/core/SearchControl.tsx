"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useMapState } from "./MapProvider";

export function SearchControl() {
  const [query, setQuery] = useState("");
  const { setViewState } = useMapState();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

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
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <form 
        onSubmit={handleSearch}
        className="flex items-center bg-slate-900 border border-slate-700 rounded-md shadow-lg overflow-hidden"
      >
        <div className="px-3 text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search location..."
          className="bg-transparent border-none outline-none py-2 pr-4 text-sm text-slate-200 placeholder:text-slate-500 min-w-[200px]"
        />
      </form>
    </div>
  );
}
