"use client";

import { useEffect } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Route Error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-900 text-slate-200">
      <div className="flex max-w-md flex-col items-center gap-6 text-center bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700/50">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
          <AlertTriangle className="h-8 w-8 text-rose-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Something went wrong</h2>
          <p className="text-sm text-slate-400">
            We encountered an unexpected error while loading this page. 
            Don't worry, your data is safe.
          </p>
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-700 overflow-auto text-xs text-left max-h-32 text-rose-400 font-mono">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex w-full gap-3 mt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" /> Try Again
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors text-white"
          >
            <Home className="h-4 w-4" /> Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
