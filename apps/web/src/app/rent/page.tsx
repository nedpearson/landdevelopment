'use client';

import React, { useState } from 'react';
import { DollarSign, Download, Plus, AlertTriangle, FileText, XCircle, CheckCircle2 } from 'lucide-react';

interface RentRecord {
  id: string;
  tenant: string;
  unit: string;
  rentDue: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  daysLate: number;
  status: 'Paid' | 'Partial' | 'Late' | 'Unpaid';
}

const MOCK_RENT_ROLL: RentRecord[] = [
  { id: '1', tenant: 'Alice Smith', unit: '123 Main St - 101', rentDue: 1200, paidAmount: 1200, balance: 0, dueDate: '2026-08-01', daysLate: 0, status: 'Paid' },
  { id: '2', tenant: 'Bob Jones', unit: '123 Main St - 102', rentDue: 1600, paidAmount: 0, balance: 1600, dueDate: '2026-08-01', daysLate: 5, status: 'Late' },
  { id: '3', tenant: 'Charlie Brown', unit: '123 Main St - 201', rentDue: 1250, paidAmount: 1250, balance: 0, dueDate: '2026-08-01', daysLate: 0, status: 'Paid' },
  { id: '4', tenant: 'Diana Prince', unit: '456 Oak Ave - A1', rentDue: 900, paidAmount: 450, balance: 450, dueDate: '2026-08-01', daysLate: 5, status: 'Partial' },
  { id: '5', tenant: 'Evan Wright', unit: '456 Oak Ave - B1', rentDue: 1150, paidAmount: 0, balance: 2300, dueDate: '2026-07-01', daysLate: 36, status: 'Unpaid' },
];

export default function RentPage() {
  const [records, setRecords] = useState<RentRecord[]>(MOCK_RENT_ROLL);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordId) return;

    const amount = Number(paymentAmount);
    setRecords(records.map(r => {
      if (r.id === selectedRecordId) {
        const newPaid = r.paidAmount + amount;
        const newBalance = r.rentDue - newPaid;
        let newStatus = r.status;
        if (newBalance <= 0) newStatus = 'Paid';
        else if (newPaid > 0) newStatus = 'Partial';
        return { ...r, paidAmount: newPaid, balance: Math.max(0, newBalance), status: newStatus };
      }
      return r;
    }));
    
    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    setSelectedRecordId(null);
    showToast('Payment recorded successfully');
  };

  const handleSendNotice = (id: string) => {
    showToast('Late notice sent via Email & SMS');
  };

  const handleExport = () => {
    showToast('Rent roll exported as CSV');
  };

  const totalCollected = records.reduce((sum, r) => sum + r.paidAmount, 0);
  const totalOutstanding = records.reduce((sum, r) => sum + r.balance, 0);
  const collectionRate = Math.round((totalCollected / (totalCollected + totalOutstanding)) * 100);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-8 h-8 text-amber-500" />
              Rent Roll & Collections
            </h1>
            <p className="text-slate-400">Track payments, balances, and send notices.</p>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Total Collected (MTD)</h3>
            <p className="text-3xl font-bold text-white mt-2">${totalCollected.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Outstanding Balances</h3>
            <p className="text-3xl font-bold text-amber-500 mt-2">${totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-slate-400 font-medium">Collection Rate</h3>
            <p className="text-3xl font-bold text-white mt-2">{collectionRate || 0}%</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                  <th className="p-4 font-medium">Tenant & Unit</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Rent Due</th>
                  <th className="p-4 font-medium">Paid Amount</th>
                  <th className="p-4 font-medium">Balance</th>
                  <th className="p-4 font-medium">Due Date</th>
                  <th className="p-4 font-medium">Days Late</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{record.tenant}</div>
                      <div className="text-xs text-slate-400">{record.unit}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        record.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        record.status === 'Partial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                        record.status === 'Late' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4">${record.rentDue}</td>
                    <td className="p-4">${record.paidAmount}</td>
                    <td className={`p-4 font-medium ${record.balance > 0 ? 'text-amber-400' : 'text-slate-300'}`}>
                      ${record.balance}
                    </td>
                    <td className="p-4 text-slate-400">{record.dueDate}</td>
                    <td className="p-4 text-slate-400">{record.daysLate > 0 ? `${record.daysLate} days` : '-'}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        {record.balance > 0 && (
                          <>
                            <button 
                              onClick={() => { setSelectedRecordId(record.id); setIsPaymentModalOpen(true); }}
                              className="px-2 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 rounded text-xs transition-colors"
                            >
                              Pay
                            </button>
                            {record.daysLate > 0 && (
                              <button 
                                onClick={() => handleSendNotice(record.id)}
                                title="Send Late Notice"
                                className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        <button title="View Ledger" className="p-1 text-slate-400 hover:text-white transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-lg font-semibold text-white">Record Payment</h2>
              <button onClick={() => { setIsPaymentModalOpen(false); setSelectedRecordId(null); }} className="text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Amount Received</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    required 
                    type="number" 
                    step="0.01"
                    value={paymentAmount} 
                    onChange={e => setPaymentAmount(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-9 pr-3 text-white focus:outline-none focus:border-amber-500" 
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors w-full">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg border bg-slate-800 border-slate-600 text-white flex items-center gap-3 z-50">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {toast.message}
        </div>
      )}
    </div>
  );
}
