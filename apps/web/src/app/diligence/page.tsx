'use client';

import React, { useState } from 'react';
import { CheckSquare, Plus, Filter, AlertTriangle, CheckCircle, Clock, Search, ShieldAlert } from 'lucide-react';

const MOCK_ITEMS = [
  { id: '1', property: 'Riverside 120 AC', category: 'Title', item: 'Review Title Commitment', status: 'In Progress', blocker: false, assignedTo: 'David Miller', dueDate: '2023-11-01' },
  { id: '2', property: 'Riverside 120 AC', category: 'Environmental', item: 'Phase 1 ESA Report', status: 'Pending', blocker: true, assignedTo: 'Sarah J.', dueDate: '2023-11-15' },
  { id: '3', property: 'Oak Hill Parcels', category: 'Zoning', item: 'Verify Setbacks', status: 'Verified', blocker: false, assignedTo: 'Ned Pearson', dueDate: '2023-10-25' },
  { id: '4', property: 'Smith Tract', category: 'Access', item: 'Easement Verification', status: 'Failed', blocker: true, assignedTo: 'David Miller', dueDate: '2023-10-20' },
  { id: '5', property: 'Riverside 120 AC', category: 'Survey', item: 'Boundary Survey', status: 'Verified', blocker: false, assignedTo: 'Mike S.', dueDate: '2023-10-30' },
];

export default function DiligenceCenter() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Verified': return <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>;
      case 'In Progress': return <span className="bg-amber-900/30 text-amber-400 border border-amber-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><Clock className="w-3 h-3 mr-1" /> In Progress</span>;
      case 'Failed': return <span className="bg-red-900/30 text-red-400 border border-red-800/50 px-2 py-1 rounded text-xs flex items-center w-fit"><ShieldAlert className="w-3 h-3 mr-1" /> Failed</span>;
      default: return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-1 rounded text-xs flex items-center w-fit">Pending</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-orange-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <CheckSquare className="w-6 h-6 mr-3 text-orange-500" />
            Due Diligence Center
          </h1>
          <p className="text-slate-400 mt-1">Track checklist items and critical path blockers</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm">Total Items</div>
          <div className="text-2xl font-bold text-white">{items.length}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm">Completed</div>
          <div className="text-2xl font-bold text-emerald-400">{items.filter(i => i.status === 'Verified').length}</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm">Active Blockers</div>
          <div className="text-2xl font-bold text-red-400 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" /> {items.filter(i => i.blocker && i.status !== 'Verified').length}
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-sm">Upcoming Deadlines</div>
          <div className="text-2xl font-bold text-amber-400">2</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input type="text" placeholder="Filter items..." className="w-full bg-slate-900 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-sm text-white focus:border-orange-500 outline-none" />
          </div>
          <button className="text-sm flex items-center text-slate-300 hover:text-white bg-slate-900 px-3 py-1.5 rounded border border-slate-700">
            <Filter className="w-4 h-4 mr-2" /> Filter Status
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium w-10"></th>
              <th className="p-4 font-medium">Property</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Task Item</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Assigned To</th>
              <th className="p-4 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className={`border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors ${item.blocker && item.status !== 'Verified' ? 'bg-red-900/10' : ''}`}>
                <td className="p-4">
                  <input type="checkbox" className="accent-orange-500 w-4 h-4" checked={item.status === 'Verified'} onChange={() => showToast('Status updated')} />
                </td>
                <td className="p-4 font-medium text-white">{item.property}</td>
                <td className="p-4">
                  <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">{item.category}</span>
                </td>
                <td className="p-4">
                  <div className="text-slate-200">{item.item}</div>
                  {item.blocker && <div className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" /> Blocker</div>}
                </td>
                <td className="p-4">{getStatusBadge(item.status)}</td>
                <td className="p-4 text-sm">{item.assignedTo}</td>
                <td className="p-4 text-sm text-slate-400">{item.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Diligence Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Property</label>
                <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                  <option>Riverside 120 AC</option>
                  <option>Oak Hill Parcels</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Item Description</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" id="blocker" className="accent-orange-500 mr-2" />
                <label htmlFor="blocker" className="text-sm text-red-400 font-medium flex items-center">Mark as Critical Blocker <AlertTriangle className="w-4 h-4 ml-1" /></label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => { showToast('Item added'); setIsModalOpen(false); }} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded">Save Item</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
