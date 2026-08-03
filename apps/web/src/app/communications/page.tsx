'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, MessageCircle, PhoneCall, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Sent' | 'Received'>('All');
  const [toast, setToast] = useState<{ message: string } | null>(null);

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const MOCK_COMMS = [
    { id: '1', date: '2026-08-02 10:30 AM', direction: 'Inbound', channel: 'Email', name: 'Alice Smith', subject: 'Question about rent', status: 'Unread' },
    { id: '2', date: '2026-08-01 02:15 PM', direction: 'Outbound', channel: 'SMS', name: 'Bob Jones', subject: 'Late Rent Notice', status: 'Delivered' },
    { id: '3', date: '2026-07-30 09:00 AM', direction: 'Inbound', channel: 'Phone', name: 'Charlie Brown', subject: 'Maintenance update request', status: 'Resolved' },
    { id: '4', date: '2026-07-28 11:45 AM', direction: 'Outbound', channel: 'Email', name: 'Diana Prince', subject: 'Lease Renewal Offer', status: 'Opened' },
    { id: '5', date: '2026-07-25 04:20 PM', direction: 'Inbound', channel: 'SMS', name: 'Evan Wright', subject: 'Will pay tomorrow', status: 'Read' },
  ];

  const filteredComms = activeTab === 'All' 
    ? MOCK_COMMS 
    : MOCK_COMMS.filter(c => c.direction === (activeTab === 'Sent' ? 'Outbound' : 'Inbound'));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-pink-500" />
              Communications Hub
            </h1>
            <p className="text-slate-400">Manage tenant emails, SMS, and call logs.</p>
          </div>
          <button 
            onClick={() => showToast('Compose modal opened')}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Compose Message
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="border-b border-slate-700 flex">
            {['All', 'Sent', 'Received'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab ? 'border-pink-500 text-pink-400 bg-slate-900/50' : 'border-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/30 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Channel</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">Subject / Excerpt</th>
                  <th className="p-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {filteredComms.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-700/30 transition-colors cursor-pointer" onClick={() => showToast('Viewing message')}>
                    <td className="p-4 text-slate-400 whitespace-nowrap">{comm.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {comm.direction === 'Inbound' ? <ArrowDownLeft className="w-4 h-4 text-sky-400" /> : <ArrowUpRight className="w-4 h-4 text-emerald-400" />}
                        {comm.channel === 'Email' && <Mail className="w-4 h-4 text-slate-400" />}
                        {comm.channel === 'SMS' && <MessageCircle className="w-4 h-4 text-slate-400" />}
                        {comm.channel === 'Phone' && <PhoneCall className="w-4 h-4 text-slate-400" />}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-white">{comm.name}</td>
                    <td className="p-4 text-slate-300">{comm.subject}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs border ${
                        comm.status === 'Unread' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 font-semibold' : 'bg-slate-800 text-slate-400 border-slate-600'
                      }`}>
                        {comm.status}
                      </span>
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
