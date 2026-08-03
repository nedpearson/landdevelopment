'use client';

import React from 'react';
import { Zap, Construction } from 'lucide-react';

export default function AutomationsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md mx-auto text-center space-y-6 bg-slate-800 p-10 rounded-lg border border-slate-700">
        <div className="flex justify-center">
          <Zap className="w-16 h-16 text-rose-500 mb-4 opacity-50" />
        </div>
        <h1 className="text-3xl font-bold text-rose-400">Automations</h1>
        <div className="bg-slate-900/50 p-6 rounded border border-slate-700 flex flex-col items-center space-y-4">
          <Construction className="w-10 h-10 text-slate-500" />
          <h2 className="text-xl font-semibold text-slate-300">Coming Soon</h2>
          <p className="text-slate-400">
            We are actively building the powerful Land Intelligence workflow engine. 
            Check back soon for the ability to automate emails, SMS, and task assignments based on deal lifecycle events.
          </p>
        </div>
        <div className="pt-4 text-sm text-slate-500">
          Stay tuned for updates!
        </div>
      </div>
    </div>
  );
}
