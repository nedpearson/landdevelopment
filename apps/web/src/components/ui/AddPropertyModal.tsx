"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { X, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useWorkspace } from '@/components/providers/WorkspaceProvider';
import { createProperty, CreatePropertyInput } from '@/actions/propertyActions';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const router = useRouter();
  const { activeWorkspace } = useWorkspace();
  const [isPending, startTransition] = useTransition();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreatePropertyInput>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.apn || formData.apn.length < 5) newErrors.apn = "APN is required (min 5 chars)";
    if (!formData.county) newErrors.county = "County is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.acreage || formData.acreage <= 0) newErrors.acreage = "Acreage must be > 0";
    if (!formData.ownerName) newErrors.ownerName = "Owner Name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    setSubmitError(null);
    startTransition(() => { void (async () => {
      const result = await createProperty(formData as CreatePropertyInput);
      if (!result.success) {
        setSubmitError((result as any).error || 'Failed to save property');
      } else {
        onSuccess(result.data.id);
        router.push(`/properties/${result.data.id}`);
      }
    })(); });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/30">
          <h2 className="text-xl font-semibold text-white">Add New Property</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center px-6 py-4 bg-slate-800/20 border-b border-slate-800">
          <div className={`flex items-center text-sm font-medium ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${step >= 1 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>1</span>
            Details
          </div>
          <div className="flex-1 h-px bg-slate-800 mx-4" />
          <div className={`flex items-center text-sm font-medium ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${step >= 2 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>2</span>
            Context
          </div>
          <div className="flex-1 h-px bg-slate-800 mx-4" />
          <div className={`flex items-center text-sm font-medium ${step >= 3 ? 'text-indigo-400' : 'text-slate-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 text-xs ${step >= 3 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>3</span>
            Review
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">APN *</label>
                <input 
                  type="text" 
                  value={formData.apn || ''}
                  onChange={e => setFormData({...formData, apn: e.target.value})}
                  className={`w-full bg-slate-800 border ${errors.apn ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white`}
                />
                {errors.apn && <p className="text-red-400 text-xs mt-1">{errors.apn}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">County *</label>
                <input 
                  type="text" 
                  value={formData.county || ''}
                  onChange={e => setFormData({...formData, county: e.target.value})}
                  className={`w-full bg-slate-800 border ${errors.county ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white`}
                />
                {errors.county && <p className="text-red-400 text-xs mt-1">{errors.county}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">State *</label>
                <select
                  value={formData.state || ''}
                  onChange={e => setFormData({...formData, state: e.target.value})}
                  className={`w-full bg-slate-800 border ${errors.state ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white`}
                >
                  <option value="">Select State</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="CA">California</option>
                  <option value="NY">New York</option>
                  {/* other states... */}
                </select>
                {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                <input 
                  type="text" 
                  value={formData.address || ''}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Acreage *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.acreage || ''}
                  onChange={e => setFormData({...formData, acreage: parseFloat(e.target.value)})}
                  className={`w-full bg-slate-800 border ${errors.acreage ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white`}
                />
                {errors.acreage && <p className="text-red-400 text-xs mt-1">{errors.acreage}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Asking Price</label>
                <input 
                  type="number" 
                  value={formData.askingPrice || ''}
                  onChange={e => setFormData({...formData, askingPrice: parseFloat(e.target.value)})}
                  className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white`}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Owner Name *</label>
                <input 
                  type="text" 
                  value={formData.ownerName || ''}
                  onChange={e => setFormData({...formData, ownerName: e.target.value})}
                  className={`w-full bg-slate-800 border ${errors.ownerName ? 'border-red-500' : 'border-slate-700'} rounded-lg px-3 py-2 text-white`}
                />
                {errors.ownerName && <p className="text-red-400 text-xs mt-1">{errors.ownerName}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {activeWorkspace.type === 'LAND_INVESTOR' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Lifecycle Stage</label>
                    <select
                      value={formData.lifecycleStage || 'PROSPECT'}
                      onChange={e => setFormData({...formData, lifecycleStage: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="PROSPECT">Prospect</option>
                      <option value="QUALIFIED">Qualified</option>
                      <option value="UNDERWRITING">Underwriting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Lead Source</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Direct Mail, Cold Call"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}
              
              {activeWorkspace.type === 'LANDMAN_ENERGY' && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-amber-400 text-sm font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Assign to Project (Coming Soon)
                  </p>
                  <p className="text-amber-500/70 text-xs mt-1">
                    You will be able to assign this property to an active land project.
                  </p>
                </div>
              )}

              {(activeWorkspace.type as any) === 'DUAL_MODE' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Property Summary</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">APN</dt>
                    <dd className="text-white font-medium">{formData.apn}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Owner</dt>
                    <dd className="text-white font-medium">{formData.ownerName}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Location</dt>
                    <dd className="text-white font-medium">{formData.county}, {formData.state}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Acreage</dt>
                    <dd className="text-white font-medium">{formData.acreage} acres</dd>
                  </div>
                  {formData.askingPrice && (
                    <div>
                      <dt className="text-slate-500">Asking Price</dt>
                      <dd className="text-emerald-400 font-medium">${formData.askingPrice.toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {submitError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-between items-center">
          <button 
            onClick={step === 1 ? onClose : handleBack}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
            disabled={isPending}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isPending}
              className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating...' : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Create Property
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
