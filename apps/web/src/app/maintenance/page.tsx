'use client';

import React, { useState } from 'react';
import { Wrench, Plus, Filter, Search, CheckCircle2, Clock, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';

type Priority = 'Emergency' | 'High' | 'Normal' | 'Low';
type Status = 'Open' | 'Assigned' | 'In Progress' | 'Complete';

interface WorkOrder {
  id: string;
  woNumber: string;
  unit: string;
  issue: string;
  priority: Priority;
  status: Status;
  vendor: string | null;
  submittedDate: string;
  completedDate: string | null;
}

const MOCK_ORDERS: WorkOrder[] = [
  { id: '1', woNumber: 'WO-2026-101', unit: '123 Main St - 102', issue: 'Leaking sink in kitchen', priority: 'High', status: 'In Progress', vendor: 'Joe Plumbing', submittedDate: '2026-08-01', completedDate: null },
  { id: '2', woNumber: 'WO-2026-102', unit: '456 Oak Ave - B1', issue: 'AC not blowing cold air', priority: 'Emergency', status: 'Assigned', vendor: 'Cool Breeze HVAC', submittedDate: '2026-08-02', completedDate: null },
  { id: '3', woNumber: 'WO-2026-103', unit: '123 Main St - 201', issue: 'Broken blind cord', priority: 'Low', status: 'Open', vendor: null, submittedDate: '2026-08-01', completedDate: null },
  { id: '4', woNumber: 'WO-2026-104', unit: '123 Main St - 101', issue: 'Dishwasher won\'t start', priority: 'Normal', status: 'Complete', vendor: 'Appliance Pros', submittedDate: '2026-07-28', completedDate: '2026-07-30' },
  { id: '5', woNumber: 'WO-2026-105', unit: '456 Oak Ave - A1', issue: 'Light bulb burned out in hallway', priority: 'Low', status: 'Complete', vendor: 'In-house Maint', submittedDate: '2026-07-25', completedDate: '2026-07-26' },
];

export default function MaintenancePage() {
  const [orders, setOrders] = useState<WorkOrder[]>(MOCK_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.issue.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          o.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          o.woNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wrench className="w-8 h-8 text-sky-500" />
              Maintenance Tracker
            </h1>
            <p className="text-slate-400">Manage work orders, vendor assignments, and repairs.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Work Order
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by issue, unit, or WO#..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-md py-2 px-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Work Order</th>
                  <th className="p-4 font-medium">Issue</th>
                  <th className="p-4 font-medium">Priority</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Vendor</th>
                  <th className="p-4 font-medium">Submitted</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors group cursor-pointer" onClick={() => showToast(`Opening details for ${order.woNumber}`)}>
                    <td className="p-4">
                      <div className="font-medium text-white">{order.woNumber}</div>
                      <div className="text-xs text-slate-400">{order.unit}</div>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{order.issue}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 ${
                        order.status === 'Complete' ? 'text-emerald-400' : 'text-slate-300'
                      }`}>
                        {order.status === 'Complete' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4 text-sky-400" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{order.vendor || 'Unassigned'}</td>
                    <td className="p-4 text-slate-400">{order.submittedDate}</td>
                    <td className="p-4 text-right">
                      <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Create Work Order</h2>
            <p className="text-slate-400 mb-6">Form implementation placeholder.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
              <button onClick={() => { setIsModalOpen(false); showToast('Database persistence for this module is coming soon. Your entry has been noted.'); }} className="px-4 py-2 bg-sky-600 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white flex items-center gap-3 z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toast.message}
        </div>
      )}
    </div>
  );
}


