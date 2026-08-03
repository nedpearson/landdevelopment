'use client';
import React, { useState } from 'react';
import { Search, Plus, Calendar, Check, X, DollarSign } from 'lucide-react';

const MOCK_PAYMENTS = [
  { id: 'PAY-01', landowner: 'Smith Farms LLC', parcel: 'P-001', type: 'Option', amount: '$12,000', due: '2024-05-10', paid: '2024-05-05', status: 'Paid' },
  { id: 'PAY-02', landowner: 'Johnson Trust', parcel: 'P-002', type: 'Annual Rent', amount: '$34,000', due: '2024-01-01', paid: '2023-12-28', status: 'Paid' },
  { id: 'PAY-03', landowner: 'Carter Family', parcel: 'P-005', type: 'Option', amount: '$21,000', due: '2024-11-01', paid: '-', status: 'Pending' },
  { id: 'PAY-04', landowner: 'Davis Ranch', parcel: 'P-006', type: 'Const. Bonus', amount: '$50,000', due: '2024-07-15', paid: '-', status: 'Overdue' },
  { id: 'PAY-05', landowner: 'Smith Farms LLC', parcel: 'P-001', type: 'Option', amount: '$12,000', due: '2023-05-10', paid: '2023-05-01', status: 'Paid' },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success'|'error'} | null>(null);

  const showToast = (message: string) => {
    setToast({ message, type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-900/50 text-emerald-400 border-emerald-700/50';
      case 'Pending': return 'bg-amber-900/50 text-amber-400 border-amber-700/50';
      case 'Overdue': return 'bg-red-900/50 text-red-400 border-red-700/50';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Landowner Payments</h1>
          <p className="text-sm text-slate-400">Track scheduled payments and obligations.</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => showToast('Generating schedule...')} className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:bg-slate-700 transition-colors">
            <Calendar className="w-4 h-4 mr-2" /> Generate Schedule
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-500 transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Total Paid (YTD)</span>
          <span className="text-3xl font-bold text-white mt-2">$46,000</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Upcoming (30 days)</span>
          <span className="text-3xl font-bold text-lime-400 mt-2">$0</span>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 flex flex-col">
          <span className="text-slate-400 text-sm font-medium">Overdue Obligations</span>
          <span className="text-3xl font-bold text-red-400 mt-2">$50,000</span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search payments..." 
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-lime-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-3">Landowner</th>
                <th className="px-6 py-3">Parcel</th>
                <th className="px-6 py-3">Payment Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Paid Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PAYMENTS.map((item) => (
                <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{item.landowner}</td>
                  <td className="px-6 py-4 text-lime-400">{item.parcel}</td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4 font-medium">{item.amount}</td>
                  <td className="px-6 py-4">{item.due}</td>
                  <td className="px-6 py-4">{item.paid}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs border ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status !== 'Paid' && (
                      <button onClick={() => showToast('Marked as paid')} className="text-slate-400 hover:text-white">
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Record Payment</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Landowner / Parcel</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-lime-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Amount</label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-white focus:outline-none focus:border-lime-500" placeholder="0.00" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">Cancel</button>
                <button onClick={() => { showToast('Payment recorded'); setIsModalOpen(false); }} className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-500 transition-colors">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center space-x-3">
          <Check className="w-5 h-5 text-lime-400" />
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
