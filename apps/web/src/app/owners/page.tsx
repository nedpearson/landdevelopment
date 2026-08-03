'use client';

import React, { useState } from 'react';
import { Database, Plus, Search, Building, User, Mail, Map } from 'lucide-react';

const MOCK_OWNERS = [
  { id: '1', name: 'Riverside Holdings LLC', type: 'LLC', phone: '(555) 123-4567', email: 'admin@riverside.com', properties: 4, state: 'TX', lastContact: '2023-10-15' },
  { id: '2', name: 'John & Mary Smith', type: 'Individual', phone: '(555) 987-6543', email: 'jsmith@email.com', properties: 1, state: 'TX', lastContact: '2023-10-20' },
  { id: '3', name: 'Pine Valley Trust', type: 'Trust', phone: '(555) 456-7890', email: 'trustee@pvtrust.org', properties: 2, state: 'CO', lastContact: '2023-09-05' },
];

export default function OwnersDatabase() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-indigo-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Database className="w-6 h-6 mr-3 text-indigo-500" />
            Owner Database
          </h1>
          <p className="text-slate-400">Track property ownership entities and individuals</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Owner
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input type="text" placeholder="Search by name, entity, or state..." className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Owner / Entity</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Contact</th>
              <th className="p-4 font-medium">Properties</th>
              <th className="p-4 font-medium">State</th>
              <th className="p-4 font-medium">Last Contact</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_OWNERS.map(owner => (
              <tr key={owner.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${owner.name}`)}>
                <td className="p-4 font-medium text-white flex items-center">
                  {owner.type === 'Individual' ? <User className="w-4 h-4 mr-2 text-slate-400" /> : <Building className="w-4 h-4 mr-2 text-slate-400" />}
                  {owner.name}
                </td>
                <td className="p-4"><span className="bg-slate-700 px-2 py-1 rounded text-xs">{owner.type}</span></td>
                <td className="p-4 text-sm text-slate-300">
                  <div>{owner.phone}</div>
                  <div className="text-xs text-slate-500">{owner.email}</div>
                </td>
                <td className="p-4">
                  <span className="bg-indigo-900/30 text-indigo-400 border border-indigo-800/50 px-2 py-1 rounded text-xs">{owner.properties} Owned</span>
                </td>
                <td className="p-4 text-sm"><Map className="w-4 h-4 inline mr-1 text-slate-500" />{owner.state}</td>
                <td className="p-4 text-sm text-slate-400">{owner.lastContact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
