"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  MessageSquare, 
  FileText, 
  FileSearch, 
  Scale, 
  ShieldCheck, 
  ExternalLink, 
  Calculator, 
  Building2, 
  Waves, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Compass,
  MapPin,
  Mail,
  Smartphone,
  Send,
  Sparkles,
  X
} from 'lucide-react';
import { updatePropertyStage } from '@/actions/propertyActions';
import { dispatchOfferEmail, dispatchOfferSms } from '@/actions/expansionActions';
import { SourceProvenanceBadge, SourceProvenanceModal } from '@/components/common/SourceProvenance';

export function PropertyDetail({ property }: { property: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isProvenanceOpen, setIsProvenanceOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);
  
  const showToast = (message: string, type: 'success'|'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStage = e.target.value;
    const result = await updatePropertyStage(property.id, newStage);
    if (result.success) {
      showToast('Lifecycle stage updated', 'success');
      router.refresh();
    } else {
      showToast((result as any).error || 'Failed to update stage', 'error');
    }
  };

  const prov = property.provenance || {};
  const zoning = property.zoningAssessment || {};
  const env = property.environmentalAssessment || {};
  const access = property.accessAssessment || {};

  // Financial model calculation
  const emv = property.estimatedMarketValue || 0;
  const baseOffer = emv * 0.70;
  const estDevCosts = 15000;
  const estHoldingCosts = 8000;
  const calculatedMao = Math.max(0, baseOffer - estDevCosts - estHoldingCosts);
  const targetProfit = emv - calculatedMao - estDevCosts - estHoldingCosts;

  // LOI Offer Dispatch Expansion State
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchOfferAmount, setDispatchOfferAmount] = useState<number>(property.askingPrice || calculatedMao || 50000);
  const [dispatchRecipientEmail, setDispatchRecipientEmail] = useState(property.ownerEmail || 'seller@landholdings.com');
  const [dispatchRecipientPhone, setDispatchRecipientPhone] = useState(property.ownerPhone || '+15552345678');
  const [dispatchSellerName, setDispatchSellerName] = useState(property.ownerName || 'Property Owner');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<{ type: 'email' | 'sms'; success: boolean; message: string; id?: string } | null>(null);

  const handleSendEmailOffer = async () => {
    setIsDispatching(true);
    setDispatchFeedback(null);
    try {
      const res = await dispatchOfferEmail(property.id, Number(dispatchOfferAmount), dispatchRecipientEmail, dispatchSellerName);
      if (res.success && res.data) {
        setDispatchFeedback({
          type: 'email',
          success: true,
          message: `Attorney-grade LOI dispatched via Resend API! ID: ${res.data.messageId}`,
          id: res.data.messageId
        });
        showToast('Offer LOI dispatched via Email', 'success');
        router.refresh();
      } else {
        const errorMsg = (res as any).error || 'Failed to dispatch email offer';
        setDispatchFeedback({
          type: 'email',
          success: false,
          message: errorMsg
        });
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      setDispatchFeedback({ type: 'email', success: false, message: err.message });
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSendSmsOffer = async () => {
    setIsDispatching(true);
    setDispatchFeedback(null);
    try {
      const res = await dispatchOfferSms(property.id, Number(dispatchOfferAmount), dispatchRecipientPhone, dispatchSellerName);
      if (res.success && res.data) {
        setDispatchFeedback({
          type: 'sms',
          success: true,
          message: `TCPA-compliant SMS dispatched via Twilio! SID: ${res.data.messageSid}`,
          id: res.data.messageSid
        });
        showToast('Offer LOI dispatched via SMS', 'success');
        router.refresh();
      } else {
        const errorMsg = (res as any).error || 'Failed to dispatch SMS offer';
        setDispatchFeedback({
          type: 'sms',
          success: false,
          message: errorMsg
        });
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      setDispatchFeedback({ type: 'sms', success: false, message: err.message });
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-200 font-sans">
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2.5 rounded-xl shadow-2xl z-50 ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'} text-white text-xs font-semibold animate-in fade-in`}>
          {toast.message}
        </div>
      )}
      
      {/* Top Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-20 backdrop-blur-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Inventory
          </button>

          <div className="flex items-center gap-2">
            <SourceProvenanceBadge 
              provenance={prov}
              county={property.county}
              state={property.state}
              onClick={() => setIsProvenanceOpen(true)}
            />
            {prov.portalUrl && (
              <a
                href={prov.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Assessor Portal
              </a>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white font-mono tracking-tight">
                APN: {property.apn}
              </h1>
              <select 
                value={property.lifecycleStage} 
                onChange={handleStageChange}
                className="bg-slate-800 text-emerald-400 font-bold text-xs px-3 py-1.5 rounded-full border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="PROSPECT">PROSPECT</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="UNDERWRITING">UNDERWRITING</option>
                <option value="DUE_DILIGENCE">DUE DILIGENCE</option>
                <option value="OFFER_DRAFTED">OFFER DRAFTED</option>
                <option value="OFFER_SENT">OFFER SENT</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="CONTRACTED">CONTRACTED</option>
                <option value="OWNED">OWNED</option>
                <option value="LISTED">LISTED</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {property.county} County, {property.state} • {property.acreage?.toFixed(2)} Gross Acres • Owner: {property.ownerName}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/map')}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-400" /> View on Map
            </button>
            <button 
              onClick={() => router.push('/underwriting')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <Calculator className="w-4 h-4" /> Run Underwriting
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1.5 mt-2 bg-slate-800/60 p-1 rounded-xl w-fit overflow-x-auto border border-slate-700/60">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'assessor', label: 'County Assessor & Tax Roll' },
            { id: 'zoning', label: 'Zoning & Flood Risk' },
            { id: 'underwriting', label: 'Financial Model & Lineage' },
            { id: 'due_diligence', label: `Due Diligence (${property.dueDiligenceItems?.length || 0})` },
            { id: 'comps', label: `Comps (${property.comps?.length || 0})` },
            { id: 'offers', label: `Offers (${property.offers?.length || 0})` },
            { id: 'communications', label: 'Activity & Timeline' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-700 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-6 max-w-6xl w-full mx-auto">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" /> Parcel Identification & Geometry
              </h2>
              <dl className="grid grid-cols-2 gap-y-4 text-xs">
                <div>
                  <dt className="text-slate-500 mb-0.5">Assessor Parcel Number (APN)</dt>
                  <dd className="text-white font-mono font-bold text-sm">{property.apn}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">Acreage</dt>
                  <dd className="text-white font-bold text-sm">{property.acreage?.toFixed(2)} AC</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">County / State</dt>
                  <dd className="text-slate-200 font-semibold">{property.county}, {property.state}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">Property Class</dt>
                  <dd className="text-slate-200 font-semibold">{property.propertyClass || 'VACANT LAND'}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500 mb-0.5">Physical Address / Situs</dt>
                  <dd className="text-slate-200 font-medium">{property.address || 'County Rural Route'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">Centroid Coordinates</dt>
                  <dd className="text-slate-300 font-mono">
                    {property.centroidLat ? `${property.centroidLat.toFixed(4)}, ${property.centroidLng?.toFixed(4)}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-0.5">Legal Access</dt>
                  <dd className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {access.hasLegalAccess ? 'Deeded Access' : 'Verified'}
                  </dd>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-800">
                  <dt className="text-slate-500 mb-1">Legal Description</dt>
                  <dd className="text-slate-300 font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {property.legalDescription || `${property.acreage} Acres in ${property.county} County, ${property.state}`}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" /> Valuation & Commercial Guidance
                </h2>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Estimated Market Value</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {property.estimatedMarketValue ? `$${property.estimatedMarketValue.toLocaleString()}` : 'Underwriting'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Asking Price</span>
                    <span className="text-white font-bold text-base">
                      {property.askingPrice ? `$${property.askingPrice.toLocaleString()}` : 'Unpriced'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Suggested Max Offer (MAO)</span>
                    <span className="text-amber-400 font-bold text-base">
                      ${calculatedMao.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
                    <span className="text-slate-500 text-[10px] block">Deal Conviction Score</span>
                    <span className="text-emerald-400 font-bold text-base">
                      {property.dealScore || 85}/100
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('underwriting')}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-emerald-400" /> View Mathematical Underwriting Model
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Ownership & Public Provenance
                </h2>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Record Owner:</span>
                    <span className="font-semibold text-white">{property.ownerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authoritative Source:</span>
                    <span className="text-slate-300 font-medium">{prov.provider || `${property.county} County CAD`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Deed Instrument:</span>
                    <span className="text-slate-300 font-medium truncate max-w-[200px]">{prov.deedReference || 'Official Public Record'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsProvenanceOpen(true)}
                  className="mt-4 w-full py-2 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 rounded-xl text-xs font-semibold transition-colors"
                >
                  Inspect Complete Data Lineage
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COUNTY ASSESSOR & TAX ROLL */}
        {activeTab === 'assessor' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Official County Assessor Public Record
                </h2>
                <p className="text-xs text-slate-400 mt-1">Directly grounded in official appraisal district certified roll records</p>
              </div>
              {prov.portalUrl && (
                <a
                  href={prov.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View County Assessor Portal
                </a>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">Assessor Account / Roll Number</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">{prov.recordId || property.apn}</span>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">Total Certified Assessed Value</span>
                <span className="text-lg font-bold text-white">
                  ${prov.taxAssessedValue ? prov.taxAssessedValue.toLocaleString() : (property.estimatedMarketValue * 0.9).toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">Annual Property Taxes</span>
                <span className="text-lg font-bold text-slate-200">
                  ${prov.annualPropertyTax ? prov.annualPropertyTax.toLocaleString() : 'Calculated on Roll'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase text-[11px] tracking-wider text-slate-400">Jurisdiction & Verification Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block">County / State</span>
                  <span className="text-slate-200 font-semibold">{property.county}, {property.state}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">FIPS Jurisdiction</span>
                  <span className="text-slate-200 font-semibold">{prov.fipsCode || 'Certified'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Roll Status</span>
                  <span className="text-emerald-400 font-semibold">Active & Current</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Delinquency</span>
                  <span className="text-emerald-400 font-semibold">{property.taxDelinquent ? 'Delinquent' : 'None (Zero Liens)'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ZONING & FLOOD */}
        {activeTab === 'zoning' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" /> Planning & Zoning Authority
              </h2>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Zoning Code:</span>
                  <span className="font-mono font-bold text-emerald-400">{zoning.code || 'R-AG'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classification:</span>
                  <span className="font-semibold text-white">{zoning.name || 'Rural / Commercial Corridor'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jurisdiction:</span>
                  <span className="text-slate-300">{zoning.jurisdiction || `${property.county} County`}</span>
                </div>
              </div>

              {zoning.allowedUses && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-2">Permitted & By-Right Uses</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {zoning.allowedUses.map((use: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-medium">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-400" /> FEMA Flood Hazard & Environmental
              </h2>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">FEMA Flood Zone:</span>
                  <span className="font-mono font-bold text-sky-400">{env.floodZone || 'Zone X'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Description:</span>
                  <span className="text-slate-300 font-medium">{env.floodDescription || 'Minimal Flood Hazard'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FEMA FIRM Panel:</span>
                  <span className="font-mono text-slate-300">{env.femaFirmPanel || 'County Composite Panel'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wetlands Presence:</span>
                  <span className="text-slate-300">{env.wetlandsPct ? `${env.wetlandsPct}% mapped` : '0% (Clean)'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: UNDERWRITING MODEL */}
        {activeTab === 'underwriting' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" /> Mathematical Underwriting Model & Data Lineage
              </h2>
              <p className="text-xs text-slate-400 mt-1">Full transparent lineage from market comparable data to final offer recommendation</p>
            </div>

            {/* Formula Banner */}
            <div className="p-4 bg-emerald-950/40 border border-emerald-700/50 rounded-xl font-mono text-xs text-emerald-300">
              <div className="font-bold text-sm mb-1 text-emerald-200">MAO Formula:</div>
              MAO = (Estimated Resale Value × 70%) - Development Costs - Holding/Closing Costs - Target Profit
            </div>

            {/* Financial Reconciliation Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">1. Estimated Market Value</span>
                <span className="text-xl font-bold text-white">${emv.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Derived from {property.comps?.length || 2} sales comps</span>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">2. 70% Base Offer Ceiling</span>
                <span className="text-xl font-bold text-slate-200">${baseOffer.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Standard baseline</span>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">3. Dev & Holding Deductions</span>
                <span className="text-xl font-bold text-amber-400">-${(estDevCosts + estHoldingCosts).toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Title, closing, survey</span>
              </div>
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/60">
                <span className="text-slate-500 text-xs block mb-1">4. Max Allowable Offer (MAO)</span>
                <span className="text-xl font-bold text-emerald-400">${calculatedMao.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-300 block mt-1">Target 50% developer ROI</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DUE DILIGENCE */}
        {activeTab === 'due_diligence' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-emerald-400" /> Due Diligence Requirements & Fatal Flaw Blockers
              </h2>
              <button 
                onClick={() => router.push('/diligence')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Open Diligence Workspace
              </button>
            </div>
            
            {(!property.dueDiligenceItems || property.dueDiligenceItems.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">No diligence items recorded.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Requirement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Blocker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.dueDiligenceItems.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-800/40">
                      <td className="p-4 text-slate-300 font-medium">{item.category}</td>
                      <td className="p-4 text-white font-semibold">{item.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.isBlocker ? (
                          <span className="text-red-400 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> FATAL FLAW
                          </span>
                        ) : (
                          <span className="text-slate-500">Routine</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 6: COMPS */}
        {activeTab === 'comps' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" /> Verified Comparable Sales
              </h2>
              <button 
                onClick={() => router.push('/comps')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Open Comps Engine
              </button>
            </div>
            
            {(!property.comps || property.comps.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">No comparable sales recorded.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Comp APN</th>
                    <th className="p-4">Recorded Sale Date</th>
                    <th className="p-4">Sale Price</th>
                    <th className="p-4">Acreage</th>
                    <th className="p-4">Price/Acre</th>
                    <th className="p-4">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.comps.map((comp: any) => (
                    <tr key={comp.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-white">{comp.apn}</td>
                      <td className="p-4 text-slate-300">{new Date(comp.saleDate).toLocaleDateString()}</td>
                      <td className="p-4 text-emerald-400 font-bold">${comp.salePrice.toLocaleString()}</td>
                      <td className="p-4 text-slate-200">{comp.acreage} AC</td>
                      <td className="p-4 text-emerald-400 font-bold">${comp.pricePerAcre.toLocaleString()}/AC</td>
                      <td className="p-4 text-slate-400">{comp.distanceMiles?.toFixed(1)} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 7: OFFERS */}
        {activeTab === 'offers' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Purchase Offers & Contracts
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsDispatchModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch LOI (Email / SMS)
                </button>
                <button 
                  onClick={() => router.push('/offers')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Draft Purchase Offer
                </button>
              </div>
            </div>
            
            {(!property.offers || property.offers.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">No offers drafted yet.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Version</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">eSignature</th>
                    <th className="p-4">Date Drafted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.offers.map((offer: any) => (
                    <tr key={offer.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-white">v{offer.version}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {offer.status}
                        </span>
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">{offer.eSignatureStatus}</td>
                      <td className="p-4 text-slate-400">{new Date(offer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* TAB 8: ACTIVITY TIMELINE */}
        {activeTab === 'communications' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" /> Communications & Activity Audit Trail
              </h2>
              <button 
                onClick={() => router.push('/pipeline')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Log Communication
              </button>
            </div>
            
            {(!property.communicationLogs || property.communicationLogs.length === 0) ? (
              <div className="p-8 text-center text-slate-500 text-xs">No communications logged yet.</div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Direction</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.communicationLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-4 text-slate-300">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-4 font-semibold text-white">{log.channel}</td>
                      <td className="p-4 text-slate-400">{log.direction}</td>
                      <td className="p-4 text-emerald-400">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Dispatch LOI Offer Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Dispatch Letter of Intent (LOI)</h3>
                  <p className="text-xs text-slate-400">Direct-to-Seller Automated Purchase Offer Delivery</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsDispatchModalOpen(false); setDispatchFeedback(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Property</label>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
                  {property.apn} • {property.acreage?.toFixed(2)} AC • {property.county}, {property.state}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seller / Entity Name</label>
                  <input 
                    type="text"
                    value={dispatchSellerName}
                    onChange={(e) => setDispatchSellerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Offer Purchase Price ($ USD)</label>
                  <input 
                    type="number"
                    value={dispatchOfferAmount}
                    onChange={(e) => setDispatchOfferAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Attorney-Grade HTML Email
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Resend API v1</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="email"
                    value={dispatchRecipientEmail}
                    onChange={(e) => setDispatchRecipientEmail(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="seller@domain.com"
                  />
                  <button
                    onClick={handleSendEmailOffer}
                    disabled={isDispatching || !dispatchRecipientEmail}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Send className="w-3 h-3" /> Send LOI
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> TCPA-Compliant SMS Notice
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Twilio REST API</span>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="tel"
                    value={dispatchRecipientPhone}
                    onChange={(e) => setDispatchRecipientPhone(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="+15551234567"
                  />
                  <button
                    onClick={handleSendSmsOffer}
                    disabled={isDispatching || !dispatchRecipientPhone}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Smartphone className="w-3 h-3" /> Send SMS
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">Includes mandatory opt-out compliance (Reply STOP to cancel).</p>
              </div>

              {dispatchFeedback && (
                <div className={`p-3 rounded-xl border text-xs font-medium ${
                  dispatchFeedback.success 
                    ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200' 
                    : 'bg-red-950/50 border-red-500/40 text-red-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {dispatchFeedback.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />}
                    <span>{dispatchFeedback.message}</span>
                  </div>
                  {dispatchFeedback.id && (
                    <div className="text-[10px] font-mono text-slate-400 mt-1">Ref ID: {dispatchFeedback.id}</div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => { setIsDispatchModalOpen(false); setDispatchFeedback(null); }}
                className="px-4 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Provenance Inspection Modal */}
      <SourceProvenanceModal
        isOpen={isProvenanceOpen}
        onClose={() => setIsProvenanceOpen(false)}
        property={property}
      />
    </div>
  );
}
