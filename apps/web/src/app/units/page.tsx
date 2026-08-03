'use client';

import React, { useState } from 'react';
import { Search, Plus, Building2, Home, HomeIcon, ArrowUpDown, ChevronDown, CheckCircle2, XCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';

type UnitStatus = 'Occupied' | 'Vacant' | 'Notice';
type UnitType = 'Studio' | '1BR' | '2BR' | '3BR';

interface Unit {
  id: string;
  unitNumber: string;
  propertyAddress: string;
  type: UnitType;
  sqFt: number;
  rentAmount: number;
  status: UnitStatus;
  tenantName: string | null;
  leaseEndDate: string | null;
}

const MOCK_UNITS: Unit[] = [
  { id: '1', unitNumber: '101', propertyAddress: '123 Main St', type: '1BR', sqFt: 750, rentAmount: 1200, status: 'Occupied', tenantName: 'Alice Smith', leaseEndDate: '2027-05-31' },
  { id: '2', unitNumber: '102', propertyAddress: '123 Main St', type: '2BR', sqFt: 950, rentAmount: 1600, status: 'Occupied', tenantName: 'Bob Jones', leaseEndDate: '2026-12-31' },
  { id: '3', unitNumber: '201', propertyAddress: '123 Main St', type: '1BR', sqFt: 750, rentAmount: 1250, status: 'Notice', tenantName: 'Charlie Brown', leaseEndDate: '2026-08-31' },
  { id: '4', unitNumber: '202', propertyAddress: '123 Main St', type: '2BR', sqFt: 950, rentAmount: 1650, status: 'Vacant', tenantName: null, leaseEndDate: null },
  { id: '5', unitNumber: 'A1', propertyAddress: '456 Oak Ave', type: 'Studio', sqFt: 500, rentAmount: 900, status: 'Occupied', tenantName: 'Diana Prince', leaseEndDate: '2027-01-15' },
  { id: '6', unitNumber: 'A2', propertyAddress: '456 Oak Ave', type: '3BR', sqFt: 1200, rentAmount: 2200, status: 'Vacant', tenantName: null, leaseEndDate: null },
  { id: '7', unitNumber: 'B1', propertyAddress: '456 Oak Ave', type: '1BR', sqFt: 700, rentAmount: 1150, status: 'Occupied', tenantName: 'Evan Wright', leaseEndDate: '2027-03-01' },
];

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'All'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    unitNumber: '', propertyAddress: '', type: '1BR', sqFt: 0, rentAmount: 0, status: 'Vacant'
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    const unit: Unit = {
      id: Math.random().toString(36).substr(2, 9),
      unitNumber: newUnit.unitNumber || '',
      propertyAddress: newUnit.propertyAddress || '',
      type: newUnit.type as UnitType,
      sqFt: newUnit.sqFt || 0,
      rentAmount: newUnit.rentAmount || 0,
      status: newUnit.status as UnitStatus,
      tenantName: newUnit.status === 'Vacant' ? null : 'Pending Tenant',
      leaseEndDate: newUnit.status === 'Vacant' ? null : '2027-12-31',
    };
    setUnits([...units, unit]);
    setIsModalOpen(false);
    setNewUnit({ unitNumber: '', propertyAddress: '', type: '1BR', sqFt: 0, rentAmount: 0, status: 'Vacant' });
    showToast('Unit added successfully');
  };

  const handleDelete = (id: string) => {
    setUnits(units.filter(u => u.id !== id));
    showToast('Unit deleted');
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || unit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalUnits = units.length;
  const occupiedUnits = units.filter(u => u.status === 'Occupied' || u.status === 'Notice').length;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalMonthlyRent = units.reduce((sum, u) => sum + (u.status === 'Occupied' || u.status === 'Notice' ? u.rentAmount : 0), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-8 h-8 text-emerald-500" />
              Units Manager
            </h1>
            <p className="text-slate-400">Manage property units, statuses, and rents.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Unit
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Total Units</h3>
            <p className="text-3xl font-bold text-white mt-2">{totalUnits}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Occupancy Rate</h3>
            <p className="text-3xl font-bold text-white mt-2">{occupancyRate}%</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Expected Monthly Rent</h3>
            <p className="text-3xl font-bold text-white mt-2">${totalMonthlyRent.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by address or unit #..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-9 pr-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-md py-2 px-4 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Occupied">Occupied</option>
            <option value="Vacant">Vacant</option>
            <option value="Notice">Notice</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Unit / Property</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Sq Ft</th>
                  <th className="p-4 font-medium">Rent</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Tenant</th>
                  <th className="p-4 font-medium">Lease End</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500">
                      No units found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{unit.unitNumber}</div>
                        <div className="text-xs text-slate-400">{unit.propertyAddress}</div>
                      </td>
                      <td className="p-4">{unit.type}</td>
                      <td className="p-4">{unit.sqFt}</td>
                      <td className="p-4">${unit.rentAmount}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          unit.status === 'Occupied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          unit.status === 'Vacant' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {unit.status === 'Occupied' && <CheckCircle2 className="w-3 h-3" />}
                          {unit.status === 'Vacant' && <HomeIcon className="w-3 h-3" />}
                          {unit.status === 'Notice' && <AlertCircle className="w-3 h-3" />}
                          {unit.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{unit.tenantName || '-'}</td>
                      <td className="p-4 text-slate-400">{unit.leaseEndDate || '-'}</td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => showToast('Edit modal would open', 'success')} className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(unit.id)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-lg font-semibold text-white">Add New Unit</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUnit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                <input required type="text" value={newUnit.propertyAddress} onChange={e => setNewUnit({...newUnit, propertyAddress: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Unit Number</label>
                  <input required type="text" value={newUnit.unitNumber} onChange={e => setNewUnit({...newUnit, unitNumber: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select value={newUnit.type} onChange={e => setNewUnit({...newUnit, type: e.target.value as UnitType})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500">
                    <option value="Studio">Studio</option>
                    <option value="1BR">1BR</option>
                    <option value="2BR">2BR</option>
                    <option value="3BR">3BR</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Sq Ft</label>
                  <input required type="number" value={newUnit.sqFt || ''} onChange={e => setNewUnit({...newUnit, sqFt: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rent Amount</label>
                  <input required type="number" value={newUnit.rentAmount || ''} onChange={e => setNewUnit({...newUnit, rentAmount: Number(e.target.value)})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Initial Status</label>
                <select value={newUnit.status} onChange={e => setNewUnit({...newUnit, status: e.target.value as UnitStatus})} className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-emerald-500">
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied (Mock Data)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors">Save Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border ${
          toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/50 text-emerald-200' : 'bg-red-900/90 border-red-500/50 text-red-200'
        } flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
