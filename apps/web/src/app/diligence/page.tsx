'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search, 
  ShieldAlert, 
  Trash2, 
  RefreshCw, 
  X,
  FileCheck,
  Building2,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { 
  getDiligenceItems, 
  createDiligenceItem, 
  updateDiligenceStatus, 
  deleteDiligenceItem 
} from '@/actions/diligenceActions';
import { getAllProperties } from '@/actions/propertyActions';

const CATEGORIES = [
  'ALL',
  'TITLE_OWNERSHIP',
  'TAXES_LIENS',
  'LEGAL_ACCESS',
  'ZONING_RESTRICTIONS',
  'ENVIRONMENTAL_FLOOD',
  'UTILITIES_SEPTIC',
  'SURVEY_BOUNDARIES',
  'CLOSING_REQUIREMENTS'
];

export default function DiligenceCenter() {
  const [items, setItems] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showBlockersOnly, setShowBlockersOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New Item State
  const [newItem, setNewItem] = useState({
    propertyId: '',
    category: 'TITLE_OWNERSHIP',
    title: '',
    description: '',
    isBlocker: false,
    assignedToUser: 'Lead Underwriter',
    dueDate: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [diligenceData, propsData] = await Promise.all([
        getDiligenceItems(),
        getAllProperties()
      ]);
      setItems(diligenceData);
      setProperties(propsData);
      if (propsData.length > 0 && !newItem.propertyId) {
        setNewItem(prev => ({ ...prev, propertyId: propsData[0].id }));
      }
    } catch (err) {
      showToast('Failed to load due diligence records', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.property?.apn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.property?.county?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesBlocker = !showBlockersOnly || item.isBlocker;

      return matchesSearch && matchesCategory && matchesBlocker;
    });
  }, [items, searchQuery, selectedCategory, showBlockersOnly]);

  const stats = useMemo(() => {
    const total = items.length;
    const verified = items.filter(i => i.status === 'VERIFIED').length;
    const inProgress = items.filter(i => i.status === 'IN_PROGRESS').length;
    const blockers = items.filter(i => i.isBlocker && i.status !== 'VERIFIED').length;
    return { total, verified, inProgress, blockers };
  }, [items]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateDiligenceStatus(id, newStatus);
    if (res.success) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
      showToast(`Status updated to ${newStatus}`);
    } else {
      showToast(res.error || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this diligence requirement?')) return;
    const res = await deleteDiligenceItem(id);
    if (res.success) {
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('Item deleted');
    } else {
      showToast('Failed to delete item', 'error');
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.propertyId || !newItem.title) {
      showToast('Please specify a property and title', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createDiligenceItem(newItem);
      if (res.success && res.data) {
        showToast('Due diligence checklist item created!');
        setIsModalOpen(false);
        setNewItem({
          propertyId: properties[0]?.id || '',
          category: 'TITLE_OWNERSHIP',
          title: '',
          description: '',
          isBlocker: false,
          assignedToUser: 'Lead Underwriter',
          dueDate: ''
        });
        await loadData();
      } else {
        showToast(res.error || 'Failed to create item', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center w-fit gap-1"><CheckCircle className="w-3 h-3" /> VERIFIED</span>;
      case 'IN_PROGRESS':
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center w-fit gap-1"><Clock className="w-3 h-3" /> IN PROGRESS</span>;
      case 'FAILED_BLOCKER':
        return <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded text-[11px] font-bold flex items-center w-fit gap-1"><ShieldAlert className="w-3 h-3" /> FAILED BLOCKER</span>;
      default:
        return <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[11px] font-medium flex items-center w-fit gap-1"><Clock className="w-3 h-3 text-slate-500" /> PENDING</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Due Diligence Center</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Title verification, tax delinquencies, road access easements, flood plains, and critical closing blockers
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-600/20 transition-colors self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Diligence Item
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6 flex-1 flex flex-col">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Total Requirements</span>
            <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
            <span className="text-[10px] text-slate-500">Across active parcels</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Active Critical Blockers</span>
            <div className={`text-2xl font-bold mt-1 ${stats.blockers > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.blockers}
            </div>
            <span className="text-[10px] text-slate-500">Preventing contract closing</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">In Progress</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats.inProgress}</div>
            <span className="text-[10px] text-slate-500">Under courthouse / surveyor review</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Verified Clear</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.verified}</div>
            <span className="text-[10px] text-slate-500">Cleared with evidence on file</span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, APN, or county..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
              ))}
            </select>

            <button
              onClick={() => setShowBlockersOnly(!showBlockersOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                showBlockersOnly
                  ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Critical Blockers Only
            </button>

            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Diligence Checklist Items */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 rounded-xl bg-slate-900/40 border border-slate-800">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-orange-400 mb-2" />
            <p className="text-sm">Loading due diligence items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400">
            No due diligence items match the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border bg-slate-900/60 transition-all ${
                  item.isBlocker && item.status !== 'VERIFIED'
                    ? 'border-rose-900/50 bg-rose-950/10'
                    : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{item.title}</span>
                      {getStatusBadge(item.status)}
                      {item.isBlocker && (
                        <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 text-[10px] font-bold">
                          CLOSING BLOCKER
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                      {item.property && (
                        <Link
                          href={`/properties/${item.property.id}`}
                          className="text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1"
                        >
                          <Building2 className="w-3 h-3" /> APN: {item.property.apn} ({item.property.county}, {item.property.state})
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                      <span>• Assigned: {item.assignedToUser || 'Unassigned'}</span>
                      {item.verificationSource && (
                        <span>• Source: <span className="text-slate-300">{item.verificationSource}</span></span>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                    )}

                    {item.evidenceNotes && (
                      <div className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-300 mt-2">
                        <span className="font-semibold text-emerald-400">Recorded Evidence:</span> {item.evidenceNotes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="VERIFIED">VERIFIED CLEAR</option>
                      <option value="FAILED_BLOCKER">FAILED BLOCKER</option>
                    </select>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete requirement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" /> Add Due Diligence Checklist Item
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Associated Property *</label>
                <select
                  required
                  value={newItem.propertyId}
                  onChange={(e) => setNewItem({ ...newItem, propertyId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>APN {p.apn} ({p.county}, {p.state} - {p.acreage} AC)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {CATEGORIES.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Assigned Landman / Agent</label>
                  <input
                    type="text"
                    value={newItem.assignedToUser}
                    onChange={(e) => setNewItem({ ...newItem, assignedToUser: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Requirement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. County Road Ingress Easement Verification"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Scope & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Details of county records or surveyor notes required..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isBlocker"
                  checked={newItem.isBlocker}
                  onChange={(e) => setNewItem({ ...newItem, isBlocker: e.target.checked })}
                  className="accent-rose-500 rounded"
                />
                <label htmlFor="isBlocker" className="text-slate-300 font-medium">
                  Designate as critical closing blocker (Must clear before offer signing)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Add Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
