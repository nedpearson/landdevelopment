'use client';

import React, { useState } from 'react';
import { Search, MapPin, User, FileText, Briefcase, X, ArrowRight, Home } from 'lucide-react';

const MOCK_RESULTS = {
  properties: [
    { id: 'p1', title: 'Smith Tract - 40 Acres', type: 'Property', apn: '123-456-789', county: 'Travis County', acreage: '40.5', status: 'Available' },
    { id: 'p2', title: 'Riverside Development', type: 'Property', apn: '987-654-321', county: 'Williamson County', acreage: '120.0', status: 'Under Contract' }
  ],
  contacts: [
    { id: 'c1', title: 'Sarah Jenkins', type: 'Contact', email: 'sarah@example.com', phone: '(555) 123-4567', role: 'Broker' },
    { id: 'c2', title: 'Ned Pearson', type: 'Contact', email: 'ned@example.com', phone: '(555) 987-6543', role: 'Owner' }
  ],
  documents: [
    { id: 'd1', title: 'Warranty_Deed_Smith_Tract.pdf', type: 'Document', fileType: 'Deed', date: '2023-10-15' },
    { id: 'd2', title: 'Phase_1_ESA_Riverside.pdf', type: 'Document', fileType: 'Report', date: '2023-10-20' }
  ],
  deals: [
    { id: 'dl1', title: 'Smith Tract Acquisition', type: 'Deal', status: 'In Negotiation', price: '$450,000' },
    { id: 'dl2', title: 'Riverside Sale', type: 'Deal', status: 'Closed', price: '$1,200,000' }
  ]
};

export default function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<any | null>(null);

  const filterResults = (items: any[]) => {
    if (!query) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const filteredProperties = filterResults(MOCK_RESULTS.properties);
  const filteredContacts = filterResults(MOCK_RESULTS.contacts);
  const filteredDocuments = filterResults(MOCK_RESULTS.documents);
  const filteredDeals = filterResults(MOCK_RESULTS.deals);

  const hasResults = filteredProperties.length > 0 || filteredContacts.length > 0 || filteredDocuments.length > 0 || filteredDeals.length > 0;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col h-screen overflow-hidden">
      <div className="p-6 pb-0 shrink-0">
        <h1 className="text-2xl font-bold text-white mb-6">Universal Search</h1>
        
        <div className="relative mb-6">
          <Search className="w-6 h-6 absolute left-4 top-3 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search properties, contacts, documents, deals..." 
            className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg py-3 pl-12 pr-4 text-lg text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-6 pt-2 gap-6">
        {/* Results Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-8">
          {!hasResults && query && (
            <div className="text-center text-slate-400 py-12 bg-slate-800/50 rounded-lg border border-slate-700">
              No results found for "{query}"
            </div>
          )}

          {filteredProperties.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <MapPin className="w-4 h-4 mr-2" /> Properties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredProperties.map(prop => (
                  <div 
                    key={prop.id} 
                    onClick={() => setSelectedResult(prop)}
                    className={`bg-slate-800 border ${selectedResult?.id === prop.id ? 'border-indigo-500' : 'border-slate-700'} p-4 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors`}
                  >
                    <h3 className="font-medium text-white text-lg">{prop.title}</h3>
                    <div className="text-sm text-slate-400 mt-1">{prop.apn} • {prop.county}</div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded">{prop.acreage} ac</span>
                      <span className="text-xs text-indigo-400">{prop.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredContacts.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <User className="w-4 h-4 mr-2" /> Contacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    onClick={() => setSelectedResult(contact)}
                    className={`bg-slate-800 border ${selectedResult?.id === contact.id ? 'border-indigo-500' : 'border-slate-700'} p-4 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors flex items-center`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-slate-300 mr-3">
                      {contact.title.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{contact.title}</h3>
                      <div className="text-sm text-slate-400">{contact.role} • {contact.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredDocuments.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2" /> Documents
              </h2>
              <div className="grid grid-cols-1 gap-2">
                {filteredDocuments.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedResult(doc)}
                    className={`bg-slate-800 border ${selectedResult?.id === doc.id ? 'border-indigo-500' : 'border-slate-700'} p-3 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors flex items-center justify-between`}
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-sky-400 mr-3" />
                      <div>
                        <h3 className="font-medium text-white">{doc.title}</h3>
                        <div className="text-xs text-slate-400">{doc.date}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">{doc.fileType}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {filteredDeals.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Deals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredDeals.map(deal => (
                  <div 
                    key={deal.id}
                    onClick={() => setSelectedResult(deal)}
                    className={`bg-slate-800 border ${selectedResult?.id === deal.id ? 'border-indigo-500' : 'border-slate-700'} p-4 rounded-lg hover:border-indigo-400 cursor-pointer transition-colors`}
                  >
                    <h3 className="font-medium text-white">{deal.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-emerald-400">{deal.price}</span>
                      <span className="text-xs bg-slate-700 px-2 py-1 rounded">{deal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Detail Panel */}
        {selectedResult && (
          <div className="w-96 bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-indigo-900/30 text-indigo-400 px-2 py-1 rounded text-xs font-semibold mb-2 inline-block">
                {selectedResult.type}
              </div>
              <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-6">{selectedResult.title}</h2>
            
            <div className="space-y-4 flex-1">
              {Object.entries(selectedResult).map(([key, value]) => {
                if (key === 'id' || key === 'title' || key === 'type') return null;
                return (
                  <div key={key} className="border-b border-slate-700/50 pb-3">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{key}</div>
                    <div className="text-white font-medium">{String(value)}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md transition-colors flex items-center justify-center">
                Go to {selectedResult.type} <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
