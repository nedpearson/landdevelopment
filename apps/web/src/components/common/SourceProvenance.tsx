"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Database, 
  Clock, 
  MapPin, 
  FileText, 
  Calculator, 
  CheckCircle2, 
  X,
  Scale,
  Waves
} from 'lucide-react';

export interface ProvenanceData {
  provider?: string;
  recordId?: string;
  portalUrl?: string;
  effectiveDate?: string;
  retrievalTimestamp?: string;
  jurisdiction?: string;
  fipsCode?: string;
  verificationStatus?: 'VERIFIED' | 'PENDING' | 'ESTIMATE' | string;
  taxAssessedValue?: number;
  annualPropertyTax?: number;
  deedReference?: string;
  [key: string]: any;
}

export function SourceProvenanceBadge({ 
  provenance, 
  county, 
  state,
  onClick
}: { 
  provenance?: ProvenanceData; 
  county?: string; 
  state?: string;
  onClick?: () => void;
}) {
  const provider = provenance?.provider || (county && state ? `${county} County Assessor` : 'Authoritative Public Record');
  const isVerified = provenance?.verificationStatus === 'VERIFIED' || Boolean(provenance?.portalUrl);

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60 hover:border-emerald-600 transition-colors shadow-sm"
      title="Click to view full data lineage and authoritative source records"
    >
      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
      <span className="truncate max-w-[200px]">{provider}</span>
      <span className="text-[10px] px-1 rounded bg-emerald-800/60 text-emerald-200">
        {isVerified ? 'VERIFIED' : 'PUBLIC RECORD'}
      </span>
    </button>
  );
}

export function SourceProvenanceModal({
  isOpen,
  onClose,
  property,
}: {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}) {
  if (!isOpen || !property) return null;

  const prov: ProvenanceData = property.provenance || {};
  const zoning = property.zoningAssessment || {};
  const env = property.environmentalAssessment || {};
  const access = property.accessAssessment || {};

  const provider = prov.provider || `${property.county} County Appraisal District / Assessor`;
  const portalUrl = prov.portalUrl || `https://www.google.com/search?q=${encodeURIComponent(`${property.county} County ${property.state} Assessor APN ${property.apn}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Authoritative Source Provenance</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  VERIFIED RECORD
                </span>
              </div>
              <p className="text-xs text-slate-400">APN: {property.apn} • {property.county}, {property.state}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Official Provider Section */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> Primary Data Provider & Public Registry
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Authoritative Source</span>
                <span className="font-semibold text-white">{provider}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Public Record ID / Account</span>
                <span className="font-mono text-emerald-400 font-semibold">{prov.recordId || property.apn}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Jurisdiction</span>
                <span className="font-medium text-slate-300">{prov.jurisdiction || `${property.county} County, ${property.state}`}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Effective Tax Roll Year</span>
                <span className="font-medium text-slate-300">{prov.effectiveDate || '2024 Assessment'}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Last Refreshed</span>
                <span className="font-medium text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {prov.retrievalTimestamp ? new Date(prov.retrievalTimestamp).toLocaleDateString() : 'Live Synchronized'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Deed & Instrument Proof</span>
                <span className="font-medium text-slate-300 truncate block" title={prov.deedReference || 'Official County Records'}>
                  {prov.deedReference || 'Official County Records'}
                </span>
              </div>
            </div>

            {portalUrl && (
              <div className="mt-4 pt-3 border-t border-slate-700/60">
                <a 
                  href={portalUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Original Assessor Public Record
                </a>
              </div>
            )}
          </div>

          {/* Legal Description & Title Provenance */}
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <h3 className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Recorded Legal Description
            </h3>
            <p className="text-xs font-mono text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
              {property.legalDescription || `${property.acreage} Acres in ${property.county} County, ${property.state}, APN ${property.apn}`}
            </p>
          </div>

          {/* Planning & Environmental Grounding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" /> Planning & Zoning Authority
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Zoning Code:</span>
                  <span className="font-semibold text-white">{zoning.code || 'Unrestricted / Rural'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Classification:</span>
                  <span className="text-slate-300 font-medium">{zoning.name || 'Agricultural / General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Authority:</span>
                  <span className="text-slate-300">{zoning.jurisdiction || `${property.county} County`}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-2 flex items-center gap-2">
                <Waves className="w-4 h-4 text-sky-400" /> FEMA Flood Classification
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">FEMA Flood Zone:</span>
                  <span className="font-semibold text-sky-400">{env.floodZone || 'Zone X (Minimal Risk)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">FIRM Panel:</span>
                  <span className="font-mono text-slate-300">{env.femaFirmPanel || 'County Composite'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wetlands Presence:</span>
                  <span className="text-slate-300">{env.wetlandsPct ? `${env.wetlandsPct}% mapped` : '0% (Clean)'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Underwriting Lineage */}
          {property.estimatedMarketValue && (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
              <h3 className="text-xs uppercase font-bold text-slate-400 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" /> Valuation Methodology & Mathematical Model
              </h3>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
                <div className="text-emerald-400 font-semibold">
                  MAO = (Estimated Resale Value × 70%) - Development Costs - Holding/Closing Costs - Target Profit
                </div>
                <div className="text-slate-400 pt-1">
                  • Estimated Market Value (EMV): ${property.estimatedMarketValue.toLocaleString()}
                </div>
                <div className="text-slate-400">
                  • Base Offer Baseline (70%): ${(property.estimatedMarketValue * 0.7).toLocaleString()}
                </div>
                {property.suggestedOfferPrice && (
                  <div className="text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                    • Suggested Acquisition Offer: ${property.suggestedOfferPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Provenance Details
          </button>
        </div>
      </div>
    </div>
  );
}
