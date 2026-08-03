"use client";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-slate-900 text-slate-200">
        <div className="flex h-screen w-full flex-col items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-6 text-center bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Fatal Application Error</h2>
              <p className="text-sm text-slate-400">
                A critical error occurred that prevented the application from loading.
              </p>
            </div>

            <button
              onClick={() => reset()}
              className="mt-4 flex w-full items-center justify-center px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm font-medium transition-colors text-white"
            >
              Restart Application
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
