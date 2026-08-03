'use client';

import React, { useState } from 'react';
import { Plus, Zap, Settings, X, Play } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  isActive: boolean;
  lastRun: string;
}

const initialAutomations: Automation[] = [
  { id: '1', name: 'Initial Follow-up', description: 'Auto-send follow-up email 3 days after first outreach if no response', trigger: 'Seller Status = Contacted', action: 'Send Email Template', isActive: true, lastRun: 'Today, 9:00 AM' },
  { id: '2', name: 'Hot Deal Alert', description: 'Alert when deal score > 80', trigger: 'Deal Score > 80', action: 'Send SMS Alert', isActive: true, lastRun: 'Yesterday, 2:15 PM' },
  { id: '3', name: 'Weekly Digest', description: 'Weekly portfolio digest email to partners', trigger: 'Schedule: Every Friday 5PM', action: 'Generate & Email Report', isActive: false, lastRun: 'Oct 20, 5:00 PM' },
  { id: '4', name: 'Buyer Matching', description: 'Notify VIP buyers when new property matches criteria', trigger: 'New Property Added', action: 'Email Matched Buyers', isActive: true, lastRun: 'Oct 25, 11:30 AM' },
  { id: '5', name: 'Dead Lead Recycle', description: 'Move to nurture sequence after 6 months cold', trigger: 'Last Contact > 6 Months', action: 'Update Status -> Nurture', isActive: false, lastRun: 'Never' },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleStatus = (id: string) => {
    setAutomations(automations.map(a => {
      if (a.id === id) {
        const newStatus = !a.isActive;
        showToast(`Automation ${newStatus ? 'Enabled' : 'Disabled'}`);
        return { ...a, isActive: newStatus };
      }
      return a;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-rose-400 flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Automations & Workflows
          </h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Rule
          </button>
        </div>

        <div className="space-y-4">
          {automations.map((rule) => (
            <div key={rule.id} className="bg-slate-800 p-5 rounded-lg border border-slate-700 flex items-start justify-between hover:border-slate-600 transition-colors">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className="font-semibold text-lg">{rule.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-900 rounded text-slate-400 border border-slate-700">
                    Last Run: {rule.lastRun}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-4">{rule.description}</p>
                
                <div className="flex items-center text-sm space-x-4">
                  <div className="flex items-center text-slate-300">
                    <span className="text-slate-500 mr-2 uppercase text-xs font-bold">IF</span>
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">{rule.trigger}</span>
                  </div>
                  <div className="text-slate-500 font-bold">→</div>
                  <div className="flex items-center text-slate-300">
                    <span className="text-slate-500 mr-2 uppercase text-xs font-bold">THEN</span>
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-700">{rule.action}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between ml-4 h-full space-y-6">
                <button 
                  onClick={() => toggleStatus(rule.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${rule.isActive ? 'bg-rose-500' : 'bg-slate-600'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <div className="flex space-x-2">
                  <button onClick={() => showToast('Running manually...')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Run Now">
                    <Play className="w-4 h-4" />
                  </button>
                  <button onClick={() => showToast('Opening settings...')} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Edit Rule">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Rule Builder</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-700 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); showToast('Rule Created Successfully!'); }} className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Rule Name</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-500 outline-none" />
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-rose-400 mb-2 uppercase">When (Trigger)</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-500 outline-none">
                    <option>Property Added</option>
                    <option>Status Changed</option>
                    <option>Schedule (Time)</option>
                    <option>Tag Added</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Condition</label>
                  <input type="text" placeholder="e.g. Status equals 'Underwriting'" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-500 outline-none" />
                </div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded border border-slate-700 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-rose-400 mb-2 uppercase">Do This (Action)</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-rose-500 outline-none">
                    <option>Send Email</option>
                    <option>Send SMS</option>
                    <option>Update Status</option>
                    <option>Assign Task</option>
                    <option>Add Tag</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded transition-colors">Save Rule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-2 bg-slate-800 border border-slate-700 rounded shadow-lg flex items-center">
          <Zap className="w-4 h-4 text-rose-500 mr-2" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
