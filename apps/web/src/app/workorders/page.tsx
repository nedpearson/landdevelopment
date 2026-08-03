'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Plus, MoreHorizontal, User, Calendar, Image as ImageIcon } from 'lucide-react';

type Status = 'Open' | 'Assigned' | 'In Progress' | 'Complete';
type Priority = 'Emergency' | 'High' | 'Normal' | 'Low';

interface WO {
  id: string;
  issue: string;
  unit: string;
  priority: Priority;
  vendor: string | null;
  status: Status;
}

const MOCK_CARDS: WO[] = [
  { id: '1', issue: 'Broken blind cord', unit: '123 Main St - 201', priority: 'Low', vendor: null, status: 'Open' },
  { id: '2', issue: 'Garbage disposal stuck', unit: '456 Oak Ave - A1', priority: 'Normal', vendor: null, status: 'Open' },
  { id: '3', issue: 'AC not blowing cold air', unit: '456 Oak Ave - B1', priority: 'Emergency', vendor: 'Cool Breeze HVAC', status: 'Assigned' },
  { id: '4', issue: 'Leaking sink in kitchen', unit: '123 Main St - 102', priority: 'High', vendor: 'Joe Plumbing', status: 'In Progress' },
  { id: '5', issue: 'Dishwasher won\'t start', unit: '123 Main St - 101', priority: 'Normal', vendor: 'Appliance Pros', status: 'Complete' },
];

export default function WorkOrdersKanbanPage() {
  const [cards, setCards] = useState<WO[]>(MOCK_CARDS);
  const [selectedCard, setSelectedCard] = useState<WO | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const columns: Status[] = ['Open', 'Assigned', 'In Progress', 'Complete'];

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'Emergency': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Normal': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Low': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 flex flex-col">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-purple-500" />
              Work Orders Board
            </h1>
          </div>
          <button 
            onClick={() => showToast('New Work Order modal would open')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Work Order
          </button>
        </div>

        <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
          {columns.map(col => (
            <div key={col} className="bg-slate-800/50 rounded-lg border border-slate-700/50 flex flex-col min-w-[320px] w-[320px]">
              <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="font-semibold text-white">{col}</h3>
                <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded-full">
                  {cards.filter(c => c.status === col).length}
                </span>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {cards.filter(c => c.status === col).map(card => (
                  <div 
                    key={card.id} 
                    onClick={() => setSelectedCard(card)}
                    className="bg-slate-800 border border-slate-700 p-4 rounded-lg cursor-pointer hover:border-slate-500 transition-colors shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(card.priority)}`}>
                        {card.priority}
                      </span>
                      <button className="text-slate-500 hover:text-slate-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-medium text-white mb-1 line-clamp-2">{card.issue}</h4>
                    <p className="text-sm text-slate-400 mb-3">{card.unit}</p>
                    
                    {card.vendor && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 bg-slate-900/50 px-2 py-1 rounded w-fit">
                        <User className="w-3 h-3" />
                        {card.vendor}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCard && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedCard.issue}</h2>
                <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-slate-400">Unit: <span className="text-white">{selectedCard.unit}</span></span>
                <span className="text-slate-400">Priority: <span className={`px-2 py-0.5 rounded text-xs border ${getPriorityColor(selectedCard.priority)}`}>{selectedCard.priority}</span></span>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Description / Notes</h3>
                  <div className="bg-slate-900/50 p-4 rounded border border-slate-700 min-h-[100px] text-slate-400 text-sm">
                    Tenant reported the issue yesterday. Please investigate.
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Photos</h3>
                  <div className="flex gap-2">
                    <div className="w-24 h-24 bg-slate-900 border border-slate-700 border-dashed rounded flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Status</h3>
                  <select 
                    value={selectedCard.status} 
                    onChange={(e) => {
                      setCards(cards.map(c => c.id === selectedCard.id ? {...c, status: e.target.value as Status} : c));
                      setSelectedCard({...selectedCard, status: e.target.value as Status});
                      showToast('Status updated');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded py-2 px-3 text-white focus:outline-none"
                  >
                    {columns.map(col => <option key={col} value={col}>{col}</option>)}
                  </select>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Assigned Vendor</h3>
                  <div className="bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300">
                    {selectedCard.vendor || 'Unassigned'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}
