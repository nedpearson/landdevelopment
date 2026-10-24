'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Plus, 
  FileText, 
  ChevronRight, 
  X, 
  PenTool, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Send,
  Calendar
} from 'lucide-react';
import { getOffers, createOffer, updateOfferStatus, getDropdownData } from '@/actions/offerActions';
import { updatePropertyStage } from '@/actions/propertyActions';

export default function OffersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPropertyId = searchParams.get('propertyId') || '';
  const initialAmount = searchParams.get('amount') || '';

  const [offers, setOffers] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(Boolean(initialPropertyId));
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Offer Form State
  const [newOffer, setNewOffer] = useState({
    propertyId: initialPropertyId,
    sellerId: '',
    purchasePrice: initialAmount ? Number(initialAmount) : 50000,
    scenario: 'cash',
    closingDays: 30,
    inspectionDays: 14,
    earnestMoney: 1000
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [offersData, dropdown] = await Promise.all([
        getOffers(),
        getDropdownData()
      ]);
      setOffers(offersData);
      setProperties(dropdown.properties);
      setSellers(dropdown.sellers);

      if (dropdown.properties.length > 0 && !newOffer.propertyId) {
        setNewOffer(prev => ({ ...prev, propertyId: dropdown.properties[0].id }));
      }
      if (dropdown.sellers.length > 0 && !newOffer.sellerId) {
        setNewOffer(prev => ({ ...prev, sellerId: dropdown.sellers[0].id }));
      }
    } catch (err) {
      showToast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (offer: any, newStatus: string) => {
    const res = await updateOfferStatus(offer.id, newStatus);
    if (res.success) {
      setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, status: newStatus } : o));
      showToast(`Offer status set to ${newStatus}`);

      // If accepted, advance property stage to CONTRACTED
      if (newStatus === 'ACCEPTED' && offer.propertyId) {
        await updatePropertyStage(offer.propertyId, 'CONTRACTED');
        showToast(`Property APN ${offer.property?.apn} advanced to CONTRACTED!`);
      }
    } else {
      showToast(res.error || 'Failed to update offer status', 'error');
    }
  };

  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOffer.propertyId || !newOffer.sellerId) {
      showToast('Please select property and seller', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createOffer({
        propertyId: newOffer.propertyId,
        sellerId: newOffer.sellerId,
        version: 1,
        status: 'DRAFT',
        selectedScenarioKey: newOffer.scenario,
        scenarios: {
          [newOffer.scenario]: {
            purchasePrice: Number(newOffer.purchasePrice),
            earnestMoney: Number(newOffer.earnestMoney),
            closingDays: Number(newOffer.closingDays),
            inspectionDays: Number(newOffer.inspectionDays)
          }
        }
      });

      if (res.success) {
        showToast('Offer created successfully!');
        setIsModalOpen(false);
        await loadData();
      } else {
        showToast(res.error || 'Failed to create offer', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SENT': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'APPROVED': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'AWAITING_APPROVAL': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'COUNTERED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in ${
          toast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200' : 'bg-red-950/90 border-red-500/50 text-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
                <FileText className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Offer Generation & Deal Structuring</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Draft cash & owner finance offers, version approvals, and manage seller acceptances
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-orange-600/20 transition-colors"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Offer
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {loading ? (
          <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
            <p className="text-sm">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800 text-slate-400">
            No offers currently drafted. Prepare an offer from the Underwriting engine or click "Create Offer".
          </div>
        ) : (
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Property APN</th>
                    <th className="p-3.5">Seller / Grantor</th>
                    <th className="p-3.5">Offer Amount</th>
                    <th className="p-3.5">Structure</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Created Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {offers.map((offer) => {
                    const scenarioData = offer.scenarios?.[offer.selectedScenarioKey] || {};
                    const amount = scenarioData.purchasePrice || offer.property?.suggestedOfferPrice || 0;

                    return (
                      <tr key={offer.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-semibold text-white font-mono flex items-center gap-1.5">
                            {offer.property?.apn || 'N/A'}
                            {offer.property && (
                              <Link href={`/properties/${offer.property.id}`} className="text-slate-500 hover:text-indigo-400">
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {offer.property?.county}, {offer.property?.state} • {offer.property?.acreage} AC
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-medium text-slate-200">{offer.seller?.name || 'Unknown Seller'}</div>
                          <div className="text-[11px] text-slate-500">{offer.seller?.email || offer.seller?.phone || 'No direct phone'}</div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">
                            ${amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Earnest Money: ${(scenarioData.earnestMoney || 1000).toLocaleString()}
                          </div>
                        </td>

                        <td className="p-3.5 uppercase font-mono text-[11px] text-indigo-300">
                          {offer.selectedScenarioKey || 'CASH'}
                        </td>

                        <td className="p-3.5">
                          <select
                            value={offer.status}
                            onChange={(e) => handleStatusChange(offer, e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
                          >
                            <option value="DRAFT">DRAFT</option>
                            <option value="AWAITING_APPROVAL">AWAITING APPROVAL</option>
                            <option value="APPROVED">APPROVED</option>
                            <option value="SENT">SENT TO SELLER</option>
                            <option value="ACCEPTED">ACCEPTED (CONTRACT)</option>
                            <option value="COUNTERED">COUNTERED</option>
                            <option value="REJECTED">REJECTED</option>
                          </select>
                        </td>

                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3.5 text-right">
                          {offer.status === 'ACCEPTED' ? (
                            <Link
                              href="/transactions"
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              Track Closing <ChevronRight className="w-3 h-3" />
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(offer, 'SENT')}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] inline-flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" /> Send
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Offer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-orange-400" /> Structure Purchase Agreement / Offer
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="space-y-4 mt-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Select Property *</label>
                <select
                  required
                  value={newOffer.propertyId}
                  onChange={(e) => setNewOffer({ ...newOffer, propertyId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>APN {p.apn} ({p.county})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Select Seller / Recipient *</label>
                <select
                  required
                  value={newOffer.sellerId}
                  onChange={(e) => setNewOffer({ ...newOffer, sellerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {sellers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Offer Price ($) *</label>
                  <input
                    type="number"
                    required
                    value={newOffer.purchasePrice}
                    onChange={(e) => setNewOffer({ ...newOffer, purchasePrice: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Earnest Money ($)</label>
                  <input
                    type="number"
                    value={newOffer.earnestMoney}
                    onChange={(e) => setNewOffer({ ...newOffer, earnestMoney: Number(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Due Diligence Window (Days)</label>
                  <input
                    type="number"
                    value={newOffer.inspectionDays}
                    onChange={(e) => setNewOffer({ ...newOffer, inspectionDays: Number(e.target.value) || 14 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Closing Timeline (Days)</label>
                  <input
                    type="number"
                    value={newOffer.closingDays}
                    onChange={(e) => setNewOffer({ ...newOffer, closingDays: Number(e.target.value) || 30 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
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
                  {isSubmitting ? 'Creating...' : 'Draft Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
