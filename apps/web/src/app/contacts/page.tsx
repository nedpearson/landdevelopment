'use client';

import React, { useState } from 'react';
import { Users, Plus, Upload, Download, Search, Mail, Phone, MoreHorizontal, Clock, Tag } from 'lucide-react';

const MOCK_CONTACTS = [
  { id: '1', name: 'Robert Chen', role: 'Broker', company: 'Apex Real Estate', phone: '(512) 555-0198', email: 'robert@apexre.com', lastActivity: '2 days ago', tags: ['High Priority', 'Commercial'] },
  { id: '2', name: 'Elena Rodriguez', role: 'Title Company', company: 'First National Title', phone: '(512) 555-0234', email: 'erodriguez@fnt.com', lastActivity: 'Today', tags: ['Vendor'] },
  { id: '3', name: 'Michael Chang', role: 'Lender', company: 'Capital Bank', phone: '(512) 555-0987', email: 'mchang@capbank.com', lastActivity: '1 week ago', tags: ['Finance'] },
  { id: '4', name: 'Sarah Jenkins', role: 'Seller', company: '-', phone: '(512) 555-3456', email: 'sarah.j@email.com', lastActivity: '3 hrs ago', tags: ['Lead'] },
  { id: '5', name: 'David Miller', role: 'Attorney', company: 'Miller & Associates', phone: '(512) 555-7654', email: 'david@millerlaw.com', lastActivity: '1 month ago', tags: ['Legal'] },
];

export default function ContactsDirectory() {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string} | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      {toast && (
        <div className="fixed bottom-4 right-4 p-4 rounded-md shadow-lg bg-sky-600 text-white z-50 animate-in fade-in">
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="bg-sky-900/50 p-2 rounded-lg mr-4">
            <Users className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Contacts Directory</h1>
            <p className="text-slate-400">Manage relationships and interactions</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => showToast('Importing CSV...')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md flex items-center border border-slate-700 transition-colors">
            <Upload className="w-4 h-4 mr-2" /> Import
          </button>
          <button onClick={() => showToast('Exporting data...')} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md flex items-center border border-slate-700 transition-colors">
            <Download className="w-4 h-4 mr-2" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Add Contact
          </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6 flex">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search contacts..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-700 text-slate-400 text-sm">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Role & Company</th>
              <th className="p-4 font-medium">Contact Info</th>
              <th className="p-4 font-medium">Last Activity</th>
              <th className="p-4 font-medium">Tags</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => showToast(`Viewing ${contact.name}'s profile`)}>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-medium mr-3">
                      {contact.name.charAt(0)}
                    </div>
                    <span className="font-medium text-white">{contact.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-white">{contact.role}</div>
                  <div className="text-sm text-slate-400">{contact.company}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-300 mb-1">
                    <Mail className="w-3 h-3 mr-2 text-slate-500" /> {contact.email}
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Phone className="w-3 h-3 mr-2 text-slate-500" /> {contact.phone}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center text-sm text-slate-400">
                    <Clock className="w-3 h-3 mr-2" /> {contact.lastActivity}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map(tag => (
                      <span key={tag} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded flex items-center">
                        <Tag className="w-3 h-3 mr-1 opacity-50" /> {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-white p-1" onClick={(e) => { e.stopPropagation(); showToast('Menu opened'); }}>
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add New Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Name</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Role</label>
                  <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white">
                    <option>Seller</option>
                    <option>Buyer</option>
                    <option>Broker</option>
                    <option>Attorney</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Company</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input type="email" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => { showToast('Contact added'); setIsModalOpen(false); }} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">Save Contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
