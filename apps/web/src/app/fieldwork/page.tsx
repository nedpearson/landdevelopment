'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileText, 
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';

interface FieldInspection {
  id: string;
  apn: string;
  county: string;
  state: string;
  inspector: string;
  date: string;
  status: 'COMPLETED' | 'SCHEDULED' | 'PENDING_UPLOAD';
  physicalAccessType: string;
  terrainCondition: string;
  photosCount: number;
  notes: string;
}

const INITIAL_INSPECTIONS: FieldInspection[] = [
  {
    id: 'insp_1',
    apn: '703-12-890',
    county: 'Costilla',
    state: 'CO',
    inspector: 'Sarah Jenkins',
    date: '2026-10-19',
    status: 'COMPLETED',
    physicalAccessType: 'Graded County Dirt Road',
    terrainCondition: 'Flat sagebrush, minor 3% slope to east',
    photosCount: 8,
    notes: 'Access road in good condition. Power lines located approximately 500ft north along section line.'
  },
  {
    id: 'insp_2',
    apn: '314-09-122',
    county: 'Mohave',
    state: 'AZ',
    inspector: 'Ned Pearson',
    date: '2026-10-22',
    status: 'COMPLETED',
    physicalAccessType: 'Bladed Desert Track',
    terrainCondition: 'High desert gravel, excellent solar exposure',
    photosCount: 12,
    notes: 'Access requires high-clearance vehicle after rain. Beautiful panoramic mountain views. No trash or dumping.'
  },
  {
    id: 'insp_3',
    apn: '045-88-201',
    county: 'Reeves',
    state: 'TX',
    inspector: 'David Miller',
    date: '2026-10-25',
    status: 'SCHEDULED',
    physicalAccessType: 'Paved FM 1450',
    terrainCondition: 'Industrial / Agricultural Flat',
    photosCount: 0,
    notes: 'Scheduled for drone boundary flyover and utility pole inspection.'
  }
];

export default function FieldworkPage() {
  const [inspections, setInspections] = useState<FieldInspection[]>(INITIAL_INSPECTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [newInsp, setNewInsp] = useState({
    apn: '',
    county: '',
    state: '',
    inspector: 'Ned Pearson',
    date: new Date().toISOString().slice(0, 10),
    physicalAccessType: 'Paved / Graded Dirt',
    terrainCondition: 'Dry Flat Plains',
    notes: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsp.apn || !newInsp.county) return;

    const entry: FieldInspection = {
      id: `insp_${Date.now()}`,
      apn: newInsp.apn,
      county: newInsp.county,
      state: newInsp.state.toUpperCase(),
      inspector: newInsp.inspector,
      date: newInsp.date,
      status: 'SCHEDULED',
      physicalAccessType: newInsp.physicalAccessType,
      terrainCondition: newInsp.terrainCondition,
      photosCount: 0,
      notes: newInsp.notes
    };

    setInspections([entry, ...inspections]);
    setIsModalOpen(false);
    showToast('Field inspection scheduled');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-2xl z-50 flex items-center gap-2 border bg-emerald-950/90 border-emerald-500/50 text-emerald-200 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Field Inspections & Ground Truth</h1>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Courthouse record abstracting, physical access verification, site topography inspections, and geo-tagged photos
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" /> Schedule Inspection
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inspections.map((insp) => (
            <div 
              key={insp.id}
              className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all shadow-sm"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-bold text-white text-sm">
                    APN: {insp.apn}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    insp.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {insp.status}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {insp.county}, {insp.state} • Inspector: {insp.inspector}
                </div>

                <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 text-xs border border-slate-800/80 mb-3">
                  <div><span className="text-slate-500">Access:</span> <span className="text-slate-200">{insp.physicalAccessType}</span></div>
                  <div><span className="text-slate-500">Terrain:</span> <span className="text-slate-200">{insp.terrainCondition}</span></div>
                </div>

                {insp.notes && (
                  <p className="text-xs text-slate-400 italic">"{insp.notes}"</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Camera className="w-3.5 h-3.5 text-slate-400" /> {insp.photosCount} Photos
                </span>
                <span>Date: {insp.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 text-xs">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Schedule Field Inspection
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 mt-4">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">APN (Parcel Number) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 703-12-890"
                  value={newInsp.apn}
                  onChange={(e) => setNewInsp({ ...newInsp, apn: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">County *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Costilla"
                    value={newInsp.county}
                    onChange={(e) => setNewInsp({ ...newInsp, county: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">State *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="e.g. CO"
                    value={newInsp.state}
                    onChange={(e) => setNewInsp({ ...newInsp, state: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Field Notes & Ground Instructions</label>
                <textarea
                  rows={3}
                  value={newInsp.notes}
                  onChange={(e) => setNewInsp({ ...newInsp, notes: e.target.value })}
                  placeholder="Verify road access, identify electric poles, check slope..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold"
                >
                  Schedule Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
