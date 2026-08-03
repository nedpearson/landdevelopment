'use client';

import React, { useState } from 'react';
import { Search, Plus, Users, Phone, Mail, FileText, ChevronRight, XCircle, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

type TenantStatus = 'Current' | 'Late' | 'Eviction' | 'Past';

interface Tenant {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  moveInDate: string;
  leaseEnd: string;
  monthlyRent: number;
  status: TenantStatus;
  balanceDue: number;
}

const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'Alice Smith', unit: '123 Main St - 101', phone: '(555) 123-4567', email: 'alice@example.com', moveInDate: '2023-06-01', leaseEnd: '2027-05-31', monthlyRent: 1200, status: 'Current', balanceDue: 0 },
  { id: '2', name: 'Bob Jones', unit: '123 Main St - 102', phone: '(555) 987-6543', email: 'bob.j@example.com', moveInDate: '2024-01-01', leaseEnd: '2026-12-31', monthlyRent: 1600, status: 'Late', balanceDue: 3200 },
  { id: '3', name: 'Charlie Brown', unit: '123 Main St - 201', phone: '(555) 456-7890', email: 'cbrown@example.com', moveInDate: '2022-09-01', leaseEnd: '2026-08-31', monthlyRent: 1250, status: 'Current', balanceDue: 0 },
  { id: '4', name: 'Diana Prince', unit: '456 Oak Ave - A1', phone: '(555) 222-3333', email: 'diana@example.com', moveInDate: '2025-01-15', leaseEnd: '2027-01-15', monthlyRent: 900, status: 'Current', balanceDue: 0 },
  { id: '5', name: 'Evan Wright', unit: '456 Oak Ave - B1', phone: '(555) 444-5555', email: 'evanw@example.com', moveInDate: '2023-03-01', leaseEnd: '2027-03-01', monthlyRent: 1150, status: 'Eviction', balanceDue: 4600 },
];

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Users className="w-8 h-8 text-indigo-500" />
              Tenant CRM
            </h1>
            <p className="text-slate-400">Manage tenant information, leases, and balances.</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tenant
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tenants by name or unit..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:max-w-md bg-slate-900 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Tenant Name</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Unit & Lease</th>
                  <th className="p-4 font-medium">Rent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {filteredTenants.map((tenant) => (
                  <tr 
                    key={tenant.id} 
                    onClick={() => setSelectedTenant(tenant)}
                    className="hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-medium text-white">{tenant.name}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-slate-400">
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {tenant.phone}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {tenant.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-white mb-1">{tenant.unit}</div>
                      <div className="text-xs text-slate-400">Ends: {tenant.leaseEnd}</div>
                    </td>
                    <td className="p-4">${tenant.monthlyRent}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tenant.status === 'Current' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        tenant.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-medium">
                      <span className={tenant.balanceDue > 0 ? 'text-red-400' : 'text-slate-300'}>
                        ${tenant.balanceDue.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Tenant</h2>
            <p className="text-slate-400 mb-6">Form implementation placeholder.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
              <button onClick={() => { setIsAddModalOpen(false); showToast('Database persistence for this module is coming soon. Your entry has been noted.', 'success'); }} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Detail Modal */}
      {selectedTenant && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-end z-50">
          <div className="bg-slate-800 border-l border-slate-700 w-full max-w-lg h-full overflow-y-auto animate-in slide-in-from-right">
            <div className="sticky top-0 bg-slate-900/90 backdrop-blur border-b border-slate-700 p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedTenant.name}</h2>
                <p className="text-slate-400 mt-1">{selectedTenant.unit}</p>
              </div>
              <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Balance</span>
                  <div className={`text-xl font-bold mt-1 ${selectedTenant.balanceDue > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    ${selectedTenant.balanceDue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Monthly Rent</span>
                  <div className="text-xl font-bold text-white mt-1">
                    ${selectedTenant.monthlyRent.toLocaleString()}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Contact Details</h3>
                <div className="bg-slate-900/50 rounded-lg border border-slate-700 divide-y divide-slate-700">
                  <div className="p-3 flex items-center gap-3">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">{selectedTenant.phone}</span>
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-300">{selectedTenant.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => showToast('Message drafted')} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition-colors">
                    <MessageSquare className="w-4 h-4" /> Message
                  </button>
                  <button onClick={() => showToast('Ledger opened')} className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-md transition-colors">
                    <FileText className="w-4 h-4" /> View Ledger
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border ${
          toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200' : 'bg-red-900/90 border-red-500/50 text-red-200'
        } flex items-center gap-3 z-50`}>
          <CheckCircle2 className="w-5 h-5" />
          {toast.message}
        </div>
      )}
    </div>
  );
}


