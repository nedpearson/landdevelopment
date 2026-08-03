"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Plus, MessageSquare, FileText, FileSearch, Scale } from 'lucide-react';
import { updatePropertyStage } from '@/actions/propertyActions';


export function PropertyDetail({ property }: { property: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
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

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg z-50 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} text-white`}>
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-4">
        <button 
          onClick={() => router.back()}
          className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center gap-1 w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              APN: {property.apn}
            </h1>
            <select 
              value={property.lifecycleStage} 
              onChange={handleStageChange}
              className="bg-slate-800 text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700"
            >
              <option value="PROSPECT">PROSPECT</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="UNDERWRITING">UNDERWRITING</option>
              <option value="DUE_DILIGENCE">DUE DILIGENCE</option>
              <option value="OFFER_DRAFTED">OFFER DRAFTED</option>
              <option value="OFFER_SENT">OFFER SENT</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="CONTRACTED">CONTRACTED</option>
            </select>
          </div>
          
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Edit className="w-4 h-4" /> Edit Details
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 bg-slate-800/50 p-1 rounded-lg w-fit">
          {['overview', 'due_diligence', 'comps', 'offers', 'communications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              {tab.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Property Details</h2>
              <dl className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 mb-1">County / State</dt>
                  <dd className="text-white font-medium">{property.county}, {property.state}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-1">Acreage</dt>
                  <dd className="text-white font-medium">{property.acreage?.toFixed(2)} Acres</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-slate-500 mb-1">Address</dt>
                  <dd className="text-white font-medium">{property.address || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-1">Coordinates</dt>
                  <dd className="text-white font-medium">
                    {property.centroidLat ? `${property.centroidLat.toFixed(4)}, ${property.centroidLng?.toFixed(4)}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500 mb-1">Asking Price</dt>
                  <dd className="text-emerald-400 font-medium">
                    {property.askingPrice ? `$${property.askingPrice.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Ownership</h2>
              <dl className="grid grid-cols-1 gap-y-4 text-sm">
                <div>
                  <dt className="text-slate-500 mb-1">Owner Name</dt>
                  <dd className="text-white font-medium">{property.ownerName}</dd>
                </div>
                {/* Could map through sellers array if present */}
                {property.sellers?.map((ps: any) => (
                  <div key={ps.sellerId} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                    <div className="font-medium text-white">{ps.seller.name}</div>
                    <div className="text-xs text-slate-400 mt-1">{ps.seller.email} • {ps.seller.phone}</div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'due_diligence' && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden max-w-5xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="font-medium text-white flex items-center gap-2"><FileSearch className="w-4 h-4" /> Due Diligence Items</h2>
              <button 
                onClick={() => showToast('Due Diligence modal coming soon', 'success')}
                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item
              </button>
            </div>
            
            {(!property.dueDiligenceItems || property.dueDiligenceItems.length === 0) ? (
              <div className="p-8 text-center text-slate-500">No due diligence items added yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Blocker</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.dueDiligenceItems.map((item: any) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="p-4 text-slate-300">{item.category}</td>
                      <td className="p-4 font-medium text-white">{item.title}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${item.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-4">{item.isBlocker ? <span className="text-red-400 font-bold">YES</span> : <span className="text-slate-500">No</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'comps' && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden max-w-5xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="font-medium text-white flex items-center gap-2"><Scale className="w-4 h-4" /> Comparable Sales</h2>
              <button 
                onClick={() => showToast('Add Comp modal coming soon', 'success')}
                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Comp
              </button>
            </div>
            
            {(!property.comps || property.comps.length === 0) ? (
              <div className="p-8 text-center text-slate-500">No comps found.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">APN</th>
                    <th className="p-4">Sale Date</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Acres</th>
                    <th className="p-4">Price/Acre</th>
                    <th className="p-4">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.comps.map((comp: any) => (
                    <tr key={comp.id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-medium text-white">{comp.apn}</td>
                      <td className="p-4 text-slate-300">{new Date(comp.saleDate).toLocaleDateString()}</td>
                      <td className="p-4 text-emerald-400">${comp.salePrice.toLocaleString()}</td>
                      <td className="p-4 text-slate-300">{comp.acreage}</td>
                      <td className="p-4 text-emerald-400">${comp.pricePerAcre.toLocaleString()}</td>
                      <td className="p-4 text-slate-400">{comp.distanceMiles?.toFixed(2)} mi</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        
        {activeTab === 'offers' && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden max-w-5xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="font-medium text-white flex items-center gap-2"><FileText className="w-4 h-4" /> Offers</h2>
              <button 
                onClick={() => showToast('Create Offer modal coming soon', 'success')}
                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Create Offer
              </button>
            </div>
            
            {(!property.offers || property.offers.length === 0) ? (
              <div className="p-8 text-center text-slate-500">No offers generated yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Version</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">eSignature</th>
                    <th className="p-4">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.offers.map((offer: any) => (
                    <tr key={offer.id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-medium text-white">v{offer.version}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-[10px] uppercase font-bold">{offer.status}</span>
                      </td>
                      <td className="p-4 text-slate-400">{offer.eSignatureStatus}</td>
                      <td className="p-4 text-slate-400">{new Date(offer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'communications' && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden max-w-5xl">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
              <h2 className="font-medium text-white flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Communications</h2>
              <button 
                onClick={() => showToast('Log Communication modal coming soon', 'success')}
                className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Log Communication
              </button>
            </div>
            
            {(!property.communicationLogs || property.communicationLogs.length === 0) ? (
              <div className="p-8 text-center text-slate-500">No communications logged yet.</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Direction</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {property.communicationLogs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-800/30">
                      <td className="p-4 text-slate-300">{new Date(log.timestamp).toLocaleDateString()}</td>
                      <td className="p-4 font-medium text-white">{log.channel}</td>
                      <td className="p-4 text-slate-400">{log.direction}</td>
                      <td className="p-4 text-slate-400">{log.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
