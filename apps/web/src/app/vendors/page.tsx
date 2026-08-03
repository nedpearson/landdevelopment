'use client';

import React, { useState } from 'react';
import { Truck, Plus, Star, Phone, Mail } from 'lucide-react';

export default function VendorsPage() {
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const MOCK_VENDORS = [
    { id: '1', name: 'Joe Plumbing', trade: 'Plumbing', phone: '(555) 111-2222', email: 'joe@plumbing.com', license: 'PL-12345', activeJobs: 1, rating: 5 },
    { id: '2', name: 'Cool Breeze HVAC', trade: 'HVAC', phone: '(555) 333-4444', email: 'service@coolbreeze.com', license: 'HV-9876', activeJobs: 2, rating: 4 },
    { id: '3', name: 'Appliance Pros', trade: 'Appliance Repair', phone: '(555) 555-6666', email: 'repair@apppros.com', license: 'AP-5555', activeJobs: 0, rating: 3 },
    { id: '4', name: 'Sparky Electric', trade: 'Electric', phone: '(555) 777-8888', email: 'hello@sparky.com', license: 'EL-4321', activeJobs: 0, rating: 5 },
    { id: '5', name: 'RoofMasters', trade: 'Roofing', phone: '(555) 999-0000', email: 'info@roofmasters.com', license: 'RF-1111', activeJobs: 0, rating: 4 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Truck className="w-8 h-8 text-orange-500" />
              Vendor Directory
            </h1>
            <p className="text-slate-400">Manage contractors, trades, and service providers.</p>
          </div>
          <button 
            onClick={() => showToast('Add Vendor modal opened')}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Vendor Name</th>
                  <th className="p-4 font-medium">Trade</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">License #</th>
                  <th className="p-4 font-medium">Rating</th>
                  <th className="p-4 font-medium text-right">Active Jobs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {MOCK_VENDORS.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-medium text-white">{vendor.name}</td>
                    <td className="p-4">
                      <span className="bg-slate-900 border border-slate-600 px-2.5 py-1 rounded text-xs text-slate-300">
                        {vendor.trade}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-slate-400 text-xs">
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {vendor.phone}</span>
                        <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {vendor.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{vendor.license}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            onClick={() => showToast(`Rating updated to ${star} stars`)}
                            className={`w-4 h-4 cursor-pointer ${star <= vendor.rating ? 'fill-orange-400 text-orange-400' : 'text-slate-600'}`} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {vendor.activeJobs > 0 ? (
                        <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-1 rounded text-xs font-bold">
                          {vendor.activeJobs} Jobs
                        </span>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white z-50">
          {toast.message}
        </div>
      )}
    </div>
  );
}
