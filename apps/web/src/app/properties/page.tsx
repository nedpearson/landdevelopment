'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  X,
  Map as MapIcon,
  Database,
  Globe
} from 'lucide-react';
import { 
  getAllProperties, 
  createProperty, 
  updatePropertyStage, 
  deleteProperty, 
  exportPropertiesCSV,
  CreatePropertyInput 
} from '@/actions/propertyActions';
import { runCountyParcelIngestion } from '@/actions/expansionActions';

interface PropertyItem {
  id: string;
  apn: string;
  county: string;
  state: string;
  address?: string | null;
  zipCode?: string | null;
  acreage: number;
  usableAcreage?: number | null;
  lifecycleStage: string;
  propertyClass?: string | null;
  ownerName: string;
  askingPrice?: number | null;
  estimatedMarketValue?: number | null;
  suggestedOfferPrice?: number | null;
  dealScore?: number | null;
  centroidLat?: number | null;
  centroidLng?: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

const STAGES = [
  'ALL',
  'PROSPECT',
  'QUALIFIED',
  'UNDERWRITING',
  'DUE_DILIGENCE',
  'OFFER_SENT',
  'CONTRACTED',
  'OWNED'
];

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Property Form State
  const [newProperty, setNewProperty] = useState<CreatePropertyInput>({
    apn: '',
    county: '',
    state: '',
    address: '',
    zipCode: '',
    acreage: 10,
    usableAcreage: 10,
    ownerName: '',
    mailingAddress: '',
    askingPrice: 0,
    lifecycleStage: 'PROSPECT',
    legalDescription: ''
  });

  // CSV Import State
  const [csvText, setCsvText] = useState('');

  // County CAD Parcel Ingestion State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [ingestCounty, setIngestCounty] = useState('Reeves');
  const [ingestState, setIngestState] = useState('TX');
  const [ingestLimit, setIngestLimit] = useState(10);
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestResult, setIngestResult] = useState<any>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleRunIngest = async () => {
    setIsIngesting(true);
    setIngestResult(null);
    try {
      const res = await runCountyParcelIngestion(ingestCounty, ingestState, Number(ingestLimit));
      if (res.success && res.data) {
        setIngestResult(res.data);
        showToast(`Successfully ingested ${res.data.count} parcels from ${ingestCounty} County CAD!`, 'success');
        await loadProperties();
      } else {
        showToast((res as any).error || 'Ingestion failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsIngesting(false);
    }
  };

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getAllProperties();
      setProperties(data as PropertyItem[]);
    } catch (err: any) {
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.apn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.county.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStage = selectedStage === 'ALL' || p.lifecycleStage === selectedStage;
      const matchesState = selectedState === 'ALL' || p.state === selectedState;

      return matchesSearch && matchesStage && matchesState;
    });
  }, [properties, searchQuery, selectedStage, selectedState]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalParcels = filteredProperties.length;
    const totalAcreage = filteredProperties.reduce((sum, p) => sum + (p.acreage || 0), 0);
    const totalEstimatedValue = filteredProperties.reduce((sum, p) => sum + (p.estimatedMarketValue || 0), 0);
    const avgScore =
      totalParcels > 0
        ? Math.round(filteredProperties.reduce((sum, p) => sum + (p.dealScore || 70), 0) / totalParcels)
        : 0;

    return { totalParcels, totalAcreage, totalEstimatedValue, avgScore };
  }, [filteredProperties]);

  const uniqueStates = useMemo(() => {
    const states = new Set(properties.map((p) => p.state).filter(Boolean));
    return Array.from(states);
  }, [properties]);

  const handleStageChange = async (id: string, stage: string) => {
    const res = await updatePropertyStage(id, stage);
    if (res.success) {
      setProperties((prev) =>
        prev.map((p) => (p.id === id ? { ...p, lifecycleStage: stage } : p))
      );
      showToast('Property stage updated');
    } else {
      showToast((res as any).error || 'Failed to update stage', 'error');
    }
  };

  const handleDelete = async (id: string, apn: string) => {
    if (!confirm(`Are you sure you want to remove APN ${apn}?`)) return;
    const res = await deleteProperty(id);
    if (res.success) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
      showToast(`Property APN ${apn} deleted`);
    } else {
      showToast((res as any).error || 'Failed to delete property', 'error');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty.apn || !newProperty.county || !newProperty.state || !newProperty.ownerName) {
      showToast('Please fill in required fields (APN, County, State, Owner)', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await createProperty({
        ...newProperty,
        acreage: Number(newProperty.acreage),
        usableAcreage: Number(newProperty.usableAcreage || newProperty.acreage),
        askingPrice: Number(newProperty.askingPrice || 0)
      });
      if (res.success && res.data) {
        showToast('Property created successfully!');
        setIsAddModalOpen(false);
        setNewProperty({
          apn: '',
          county: '',
          state: '',
          address: '',
          zipCode: '',
          acreage: 10,
          usableAcreage: 10,
          ownerName: '',
          mailingAddress: '',
          askingPrice: 0,
          lifecycleStage: 'PROSPECT',
          legalDescription: ''
        });
        await loadProperties();
      } else {
        showToast((res as any).error || 'Failed to create property', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    const res = await exportPropertiesCSV();
    if (res.success && res.data) {
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `land_intelligence_properties_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Properties exported to CSV');
    } else {
      showToast('Failed to export CSV', 'error');
    }
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setIsSubmitting(true);
    try {
      const lines = csvText.trim().split('\n');
      let createdCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 4) {
          const [apn, county, state, acreageStr, owner] = parts;
          if (apn && county && state) {
            await createProperty({
              apn,
              county,
              state,
              acreage: parseFloat(acreageStr) || 10,
              ownerName: owner || 'Unknown Owner',
              lifecycleStage: 'PROSPECT'
            });
            createdCount++;
          }
        }
      }
      showToast(`Imported ${createdCount} properties successfully!`);
      setIsImportModalOpen(false);
      setCsvText('');
      await loadProperties();
    } catch (err: any) {
      showToast('Error parsing CSV data', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/90 border-red-500/50 text-red-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Properties Platform</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Central system of record for land parcels, valuations, owner records, and due diligence
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title="Export all property records to CSV"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
              title="Import properties from CSV"
            >
              <Upload className="w-3.5 h-3.5" /> Import
            </button>
            <button
              onClick={() => setIsIngestModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 transition-colors shadow-sm"
              title="Ingest live county tax parcels via ArcGIS CAD open data"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" /> Ingest CAD Parcels
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Property
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6 flex-1 flex flex-col">
        {/* KPI Traceable Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => { setSelectedStage('ALL'); setSelectedState('ALL'); setSearchQuery(''); }}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-sm"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Total Parcels</div>
            <div className="text-2xl font-bold text-white mt-1">{metrics.totalParcels}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-400" /> Active in database
            </div>
          </div>

          <div 
            onClick={() => setSelectedStage('ALL')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 cursor-pointer transition-all shadow-sm"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Gross Acreage</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics.totalAcreage.toLocaleString()} <span className="text-sm font-normal text-slate-400">AC</span></div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Total controlled land area
            </div>
          </div>

          <div 
            onClick={() => setSelectedStage('QUALIFIED')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition-all shadow-sm"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Est. Market Value</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">${metrics.totalEstimatedValue.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" /> Portfolio asset evaluation
            </div>
          </div>

          <div 
            onClick={() => setSelectedStage('UNDERWRITING')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 cursor-pointer transition-all shadow-sm"
          >
            <div className="text-xs font-medium uppercase tracking-wider text-slate-400">Avg Deal Score</div>
            <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics.avgScore}<span className="text-sm font-normal text-slate-500">/100</span></div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Percent className="w-3 h-3 text-cyan-400" /> AI investment viability index
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by APN, Owner, County, State, or Address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                title="Grid card view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={loadProperties}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Refresh properties"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {STAGES.map((stage) => {
            const count = stage === 'ALL'
              ? properties.length
              : properties.filter((p) => p.lifecycleStage === stage).length;
            const isSelected = selectedStage === stage;

            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{stage.replace('_', ' ')}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-sm">Loading properties from system of record...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center rounded-xl bg-slate-900/30 border border-slate-800/80 flex flex-col items-center justify-center gap-3">
            <Building2 className="w-10 h-10 text-slate-600" />
            <h3 className="text-base font-semibold text-slate-300">No properties found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery || selectedStage !== 'ALL' || selectedState !== 'ALL'
                ? 'Try adjusting your search criteria or clear your filters.'
                : 'Get started by creating your first parcel or importing records via CSV.'}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => { setSearchQuery(''); setSelectedStage('ALL'); setSelectedState('ALL'); }}
                className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
              >
                Add First Property
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div className="rounded-xl bg-slate-900/40 border border-slate-800/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">APN / Location</th>
                    <th className="p-3.5">Acreage</th>
                    <th className="p-3.5">Owner / Contact</th>
                    <th className="p-3.5">Valuation</th>
                    <th className="p-3.5">Deal Score</th>
                    <th className="p-3.5">Lifecycle Stage</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProperties.map((prop) => (
                    <tr
                      key={prop.id}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    >
                      <td 
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-3.5"
                      >
                        <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors font-mono">
                          {prop.apn}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {prop.county}, {prop.state} {prop.zipCode && `• ${prop.zipCode}`}
                        </div>
                        {prop.address && (
                          <div className="text-[10px] text-slate-500 truncate max-w-xs">{prop.address}</div>
                        )}
                      </td>

                      <td 
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-3.5 font-medium text-slate-200"
                      >
                        <div>{prop.acreage} AC</div>
                        {prop.usableAcreage && prop.usableAcreage !== prop.acreage && (
                          <div className="text-[10px] text-slate-500">Usable: {prop.usableAcreage} AC</div>
                        )}
                      </td>

                      <td 
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-3.5"
                      >
                        <div className="text-slate-200 font-medium truncate max-w-xs">{prop.ownerName}</div>
                        <div className="text-[10px] text-slate-500">Verified System Record</div>
                      </td>

                      <td 
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-3.5"
                      >
                        <div className="font-semibold text-white">
                          ${prop.estimatedMarketValue ? prop.estimatedMarketValue.toLocaleString() : 'TBD'}
                        </div>
                        {prop.askingPrice ? (
                          <div className="text-[10px] text-slate-500">Asking: ${prop.askingPrice.toLocaleString()}</div>
                        ) : (
                          <div className="text-[10px] text-slate-500">Off-Market</div>
                        )}
                      </td>

                      <td 
                        onClick={() => router.push(`/properties/${prop.id}`)}
                        className="p-3.5"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            (prop.dealScore || 50) >= 80 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : (prop.dealScore || 50) >= 65
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-700/50 text-slate-300'
                          }`}>
                            {prop.dealScore || 50}/100
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <select
                          value={prop.lifecycleStage}
                          onChange={(e) => handleStageChange(prop.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
                        >
                          <option value="MARKET_DISCOVERY">DISCOVERY</option>
                          <option value="PROSPECT">PROSPECT</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="UNDERWRITING">UNDERWRITING</option>
                          <option value="DUE_DILIGENCE">DUE DILIGENCE</option>
                          <option value="OFFER_SENT">OFFER SENT</option>
                          <option value="CONTRACTED">CONTRACTED</option>
                          <option value="OWNED">OWNED</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => router.push(`/properties/${prop.id}`)}
                            className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors"
                            title="Open Property Profile"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(prop.id, prop.apn); }}
                            className="p-1.5 rounded hover:bg-red-950 text-slate-500 hover:text-red-400 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProperties.map((prop) => (
              <div
                key={prop.id}
                onClick={() => router.push(`/properties/${prop.id}`)}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-white group-hover:text-indigo-400 transition-colors">
                        APN: {prop.apn}
                      </span>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {prop.county}, {prop.state}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      (prop.dealScore || 50) >= 80 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      Score: {prop.dealScore || 50}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Acreage</span>
                      <span className="font-semibold text-slate-200">{prop.acreage} AC</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-500 block">Est. Value</span>
                      <span className="font-semibold text-emerald-400">
                        ${prop.estimatedMarketValue ? prop.estimatedMarketValue.toLocaleString() : 'TBD'}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Owner:</span> {prop.ownerName}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
                    {prop.lifecycleStage.replace('_', ' ')}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-white transition-colors">
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Add New Property
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">APN (Parcel Number) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 703-12-890"
                    value={newProperty.apn}
                    onChange={(e) => setNewProperty({ ...newProperty, apn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe / Estate"
                    value={newProperty.ownerName}
                    onChange={(e) => setNewProperty({ ...newProperty, ownerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">County *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Costilla"
                    value={newProperty.county}
                    onChange={(e) => setNewProperty({ ...newProperty, county: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">State *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CO"
                    maxLength={2}
                    value={newProperty.state}
                    onChange={(e) => setNewProperty({ ...newProperty, state: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white uppercase focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Zip Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 81151"
                    value={newProperty.zipCode || ''}
                    onChange={(e) => setNewProperty({ ...newProperty, zipCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Gross Acreage *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProperty.acreage}
                    onChange={(e) => setNewProperty({ ...newProperty, acreage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Usable Acreage</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProperty.usableAcreage || newProperty.acreage}
                    onChange={(e) => setNewProperty({ ...newProperty, usableAcreage: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Asking Price ($)</label>
                  <input
                    type="number"
                    value={newProperty.askingPrice || 0}
                    onChange={(e) => setNewProperty({ ...newProperty, askingPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Address / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Costilla Ranch Road"
                  value={newProperty.address || ''}
                  onChange={(e) => setNewProperty({ ...newProperty, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Lifecycle Stage</label>
                <select
                  value={newProperty.lifecycleStage}
                  onChange={(e) => setNewProperty({ ...newProperty, lifecycleStage: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="PROSPECT">Prospect</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="UNDERWRITING">Underwriting</option>
                  <option value="DUE_DILIGENCE">Due Diligence</option>
                  <option value="OFFER_SENT">Offer Sent</option>
                  <option value="CONTRACTED">Contracted</option>
                  <option value="OWNED">Owned</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Save Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                Import Properties from CSV
              </h2>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-slate-400">
                Paste CSV data below with columns: <code className="text-indigo-300">APN, County, State, Acreage, Owner</code>
              </p>
              <textarea
                rows={8}
                placeholder={`APN, County, State, Acreage, Owner\n123-456-789, Costilla, CO, 160.0, John Doe\n987-654-321, Mohave, AZ, 40.0, Jane Smith`}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono focus:outline-none focus:border-indigo-500"
              />

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !csvText.trim()}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  Execute Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* County CAD Parcel Ingestion Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Ingest Public County CAD Parcels</h2>
                  <p className="text-xs text-slate-400">Direct ArcGIS Open Data CAD & Tax Roll Sync into PostgreSQL</p>
                </div>
              </div>
              <button 
                onClick={() => { setIsIngestModalOpen(false); setIngestResult(null); }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Target County CAD Authority</label>
                <select
                  value={`${ingestCounty},${ingestState}`}
                  onChange={(e) => {
                    const [c, s] = e.target.value.split(',');
                    setIngestCounty(c);
                    setIngestState(s);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Reeves,TX">Reeves County Appraisal District (Texas - Permian Basin)</option>
                  <option value="Midland,TX">Midland County Appraisal District (Texas - Permian Basin)</option>
                  <option value="Costilla,CO">Costilla County GIS & Assessor (Colorado - San Luis Valley)</option>
                  <option value="Mohave,AZ">Mohave County Assessor GIS (Arizona - Tri-State Area)</option>
                  <option value="Brevard,FL">Brevard County Property Appraiser (Florida - Space Coast)</option>
                  <option value="Elko,NV">Elko County Assessor GIS (Nevada - High Desert)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Ingestion Batch Limit</label>
                <select
                  value={ingestLimit}
                  onChange={(e) => setIngestLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="5">5 Parcels (Quick Test Batch)</option>
                  <option value="10">10 Parcels (Standard Batch)</option>
                  <option value="25">25 Parcels (Expanded Batch)</option>
                  <option value="50">50 Parcels (Bulk Ingestion)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-slate-400">
                <div className="text-white font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" /> Automated Pipeline Capabilities:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li>Connects directly to county ArcGIS REST FeatureServer endpoints.</li>
                  <li>Translates ESRI geometry polygons to standard GeoJSON with calculated centroids.</li>
                  <li>Extracts APN, legal description, deed book/page, assessed value, and property tax roll.</li>
                  <li>Writes validated records into PostgreSQL with full audit provenance metadata.</li>
                </ul>
              </div>

              {ingestResult && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Successfully Ingested {ingestResult.count} Parcels</span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Authority: <span className="font-mono text-emerald-300">{ingestResult.county} County, {ingestResult.state} CAD</span>
                  </div>
                  {ingestResult.ingestedApns && ingestResult.ingestedApns.length > 0 && (
                    <div className="max-h-32 overflow-y-auto bg-slate-950/80 p-2 rounded border border-slate-800 font-mono text-[10px] space-y-1">
                      {ingestResult.ingestedApns.map((apn: string, idx: number) => (
                        <div key={idx} className="flex justify-between text-slate-300">
                          <span>APN: {apn}</span>
                          <span className="text-emerald-400">PostgreSQL Synced</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsIngestModalOpen(false); setIngestResult(null); }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleRunIngest}
                  disabled={isIngesting}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {isIngesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  {isIngesting ? 'Ingesting from ArcGIS...' : 'Run Pipeline Ingestion'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
