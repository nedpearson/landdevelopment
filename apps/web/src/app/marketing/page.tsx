'use client';

import React, { useState } from 'react';
import { Plus, Copy, Send, Mail, MessageSquare, Target, Megaphone } from 'lucide-react';
import { createCampaign, dispatchMailer } from '@/actions/marketingActions';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
  date: string;
  sent: number;
  openRate: string;
  responses: number;
}

const mockHistory: Campaign[] = [
  { id: '1', name: 'Q3 Texas Land Owners', type: 'Direct Mail', status: 'Sent', date: '2023-08-15', sent: 5000, openRate: 'N/A', responses: 45 },
  { id: '2', name: 'Florida Infill Buyers', type: 'Email Blast', status: 'Sent', date: '2023-09-01', sent: 1200, openRate: '34%', responses: 12 },
  { id: '3', name: 'Arizona Off-Market', type: 'SMS', status: 'Scheduled', date: '2023-10-01', sent: 0, openRate: 'N/A', responses: 0 },
  { id: '4', name: 'Colorado Mountain Tracts', type: 'Email Blast', status: 'Draft', date: 'N/A', sent: 0, openRate: 'N/A', responses: 0 },
  { id: '5', name: 'Nevada Desert Lots', type: 'Social Media', status: 'Sent', date: '2023-07-20', sent: 10000, openRate: 'N/A', responses: 89 },
];

export default function MarketingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = () => {
    showToast('Copied to clipboard!');
  };

  const handleDispatch = async () => {
    setIsLoading(true);
    const result = await dispatchMailer();
    setIsLoading(false);
    if (result.success) {
      showToast('Mailer Batch Dispatched!');
    } else {
      showToast(result.error || 'Failed to dispatch mailer', 'error');
    }
  };

  const handleLaunchCampaign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      audience: formData.get('audience') as string,
      budget: formData.get('budget') as string,
      subjectLine: formData.get('subjectLine') as string,
      bodyPreview: formData.get('bodyPreview') as string,
    };
    const result = await createCampaign(data);
    setIsModalOpen(false);
    if (result.success) {
      showToast('Campaign Created!');
    } else {
      showToast(result.error || 'Failed to create campaign', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400">Marketing & Campaign Center</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Launch New Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Total Sent</h3>
            <p className="text-2xl font-semibold">16,200</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Avg Open Rate</h3>
            <p className="text-2xl font-semibold">28%</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Total Responses</h3>
            <p className="text-2xl font-semibold">146</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 text-sm">Conversions</h3>
            <p className="text-2xl font-semibold">18</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-4 text-emerald-400">
              <Mail className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Email Blast Template</h2>
            </div>
            <div className="bg-slate-900 p-4 rounded text-sm text-slate-300 mb-4 whitespace-pre-wrap font-mono">
              Subject: Quick Question About Your Property in [County]&#10;
              Hi [Name],&#10;
              I'm reaching out because we're looking to purchase land in [County], and your property at [APN] caught our eye. Are you open to a cash offer?&#10;
              Best,&#10;Land Investors
            </div>
            <button 
              onClick={handleCopy}
              className="flex items-center px-4 py-2 border border-slate-600 hover:bg-slate-700 rounded-md transition-colors w-full justify-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy to Clipboard
            </button>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="flex items-center mb-4 text-amber-400">
              <Target className="w-5 h-5 mr-2" />
              <h2 className="text-xl font-semibold">Direct Mail Template</h2>
            </div>
            <div className="bg-slate-900 p-4 rounded text-sm text-slate-300 mb-4 font-mono">
              [Logo]&#10;
              We want to buy your land at [Property Address].&#10;
              We pay cash and cover all closing costs.&#10;
              Call us at (555) 123-4567 to get your offer!
            </div>
            <button 
              onClick={handleDispatch}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 rounded-md transition-colors w-full justify-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? 'Dispatching...' : 'Dispatch Mailer Batch'}
            </button>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold">Campaign History</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {mockHistory.map((c) => (
                <tr key={c.id} className="hover:bg-slate-700/50 cursor-pointer transition-colors" onClick={() => showToast(`View ${c.name}`)}>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      c.status === 'Sent' ? 'bg-emerald-500/20 text-emerald-400' :
                      c.status === 'Draft' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-sky-500/20 text-sky-400'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.date}</td>
                  <td className="px-4 py-3">{c.sent.toLocaleString()}</td>
                  <td className="px-4 py-3 text-slate-400">Open: {c.openRate} | Resp: {c.responses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Launch New Campaign</h2>
            <form onSubmit={handleLaunchCampaign} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Campaign Name</label>
                <input required type="text" name="name" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Type</label>
                  <select name="type" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none">
                    <option>Email Blast</option>
                    <option>SMS</option>
                    <option>Direct Mail</option>
                    <option>Social Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Target Audience</label>
                  <select name="audience" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none">
                    <option>Buyer List</option>
                    <option>Seller Acquisition</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Budget ($)</label>
                <input type="number" name="budget" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Subject Line</label>
                <input type="text" name="subjectLine" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Body Preview</label>
                <textarea name="bodyPreview" rows={3} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded transition-colors">Launch Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
