'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, Download, X, DollarSign, Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface LandPayment {
  id: string;
  payee: string;
  reference: string;
  category: 'OPTION_FEE' | 'ROYALTY' | 'SURFACE_DAMAGE' | 'DELAY_RENTAL' | 'MUNICIPAL_PERMIT';
  amount: number;
  dueDate: string;
  disbursedDate?: string;
  method: 'ACH' | 'WIRE' | 'CHECK';
  status: 'PAID' | 'SCHEDULED' | 'PENDING' | 'OVERDUE';
}

const INITIAL_PAYMENTS: LandPayment[] = [
  {
    id: 'pay-201',
    payee: 'Henderson Family Ranch LLC',
    reference: 'Red River Mesa Tract A - Q2 Option Fee',
    category: 'OPTION_FEE',
    amount: 32000,
    dueDate: '2024-06-01',
    disbursedDate: '2024-05-28',
    method: 'ACH',
    status: 'PAID',
  },
  {
    id: 'pay-202',
    payee: 'Double Diamond Minerals LLC',
    reference: 'Sand Creek Section 14 - Annual Surface Damage',
    category: 'SURFACE_DAMAGE',
    amount: 24000,
    dueDate: '2024-10-15',
    method: 'WIRE',
    status: 'SCHEDULED',
  },
  {
    id: 'pay-203',
    payee: 'Weld County Planning Commission',
    reference: 'Sand Creek Parcel 14 - Major Subdivision Filing Fee',
    category: 'MUNICIPAL_PERMIT',
    amount: 8500,
    dueDate: '2024-07-01',
    disbursedDate: '2024-06-25',
    method: 'CHECK',
    status: 'PAID',
  },
  {
    id: 'pay-204',
    payee: 'Martinez Estate Trust',
    reference: 'Rio Grande Basin - Section 4 Delay Rental',
    category: 'DELAY_RENTAL',
    amount: 9600,
    dueDate: '2024-08-15',
    method: 'ACH',
    status: 'PENDING',
  },
  {
    id: 'pay-205',
    payee: 'Pecos County Clerk',
    reference: 'Recording Fees - Runsheet Package #402',
    category: 'MUNICIPAL_PERMIT',
    amount: 1450,
    dueDate: '2024-05-10',
    disbursedDate: '2024-05-09',
    method: 'ACH',
    status: 'PAID',
  },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState<LandPayment[]>(INITIAL_PAYMENTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form State
  const [payee, setPayee] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState<LandPayment['category']>('OPTION_FEE');
  const [amount, setAmount] = useState(15000);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<LandPayment['method']>('ACH');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p.payee.toLowerCase().includes(search.toLowerCase()) ||
      p.reference.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalDisbursed = payments
    .filter((p) => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalScheduled = payments
    .filter((p) => p.status === 'SCHEDULED' || p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payee || !reference) {
      showToast('Please fill in required fields', 'error');
      return;
    }

    const newPayment: LandPayment = {
      id: `pay-${Date.now()}`,
      payee,
      reference,
      category,
      amount: Number(amount),
      dueDate,
      method,
      status: 'SCHEDULED',
    };

    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);
    showToast(`Payment of $${amount.toLocaleString()} scheduled for ${payee}`);

    setPayee('');
    setReference('');
  };

  const handleMarkPaid = (id: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: 'PAID', disbursedDate: new Date().toISOString().split('T')[0] }
          : p
      )
    );
    showToast('Payment marked as disbursed');
  };

  const handleExportCSV = () => {
    const headers = ['Payee', 'Reference', 'Category', 'Amount ($)', 'Due Date', 'Disbursed Date', 'Method', 'Status'];
    const rows = payments.map((p) => [
      `"${p.payee}"`,
      `"${p.reference}"`,
      p.category,
      p.amount,
      p.dueDate,
      p.disbursedDate || 'N/A',
      p.method,
      p.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `payments-ledger-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported payments ledger to CSV');
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-slate-200">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium transition-all ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="text-emerald-500 w-6 h-6" />
            Land Payments & Capital Disbursements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track landowner options, surface damages, delay rentals, and regulatory escrow fees.
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4 mr-2" /> Export Ledger
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 transition-colors text-sm font-medium shadow-md shadow-emerald-900/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Schedule Payment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Disbursed (YTD)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">${totalDisbursed.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Settled disbursements</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Scheduled / Pending</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">${totalScheduled.toLocaleString()}</div>
          <div className="text-xs text-slate-400 mt-1">Upcoming 90-day commitments</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Disbursement Count</div>
          <div className="text-2xl font-bold text-white mt-1">{payments.length}</div>
          <div className="text-xs text-slate-400 mt-1">Total ledger entries</div>
        </div>
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">ACH Settlement Rate</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">100%</div>
          <div className="text-xs text-slate-400 mt-1">Zero payment defaults</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search payee, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 uppercase font-medium shrink-0">Category:</span>
          {['ALL', 'OPTION_FEE', 'SURFACE_DAMAGE', 'DELAY_RENTAL', 'MUNICIPAL_PERMIT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4">Payee</th>
                <th className="py-3 px-4">Reference Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">{p.payee}</td>
                  <td className="py-3 px-4 text-slate-300">{p.reference}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-xs">
                      {p.category.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    ${p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-300">{p.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-slate-900 border border-slate-700 px-2 py-0.5 rounded font-mono">
                      {p.method}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : p.status === 'SCHEDULED'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.status !== 'PAID' ? (
                      <button
                        onClick={() => handleMarkPaid(p.id)}
                        className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded transition-colors"
                      >
                        Disburse
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Paid {p.disbursedDate}</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No payment records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="text-emerald-500 w-5 h-5" /> Schedule Disbursement
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Payee Name *</label>
                <input
                  type="text"
                  required
                  value={payee}
                  onChange={(e) => setPayee(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Henderson Family Ranch LLC"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reference / Description *</label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Option Fee Year 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="OPTION_FEE">Option Fee</option>
                    <option value="SURFACE_DAMAGE">Surface Damage</option>
                    <option value="DELAY_RENTAL">Delay Rental</option>
                    <option value="ROYALTY">Royalty</option>
                    <option value="MUNICIPAL_PERMIT">Municipal Permit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ACH">ACH Direct Deposit</option>
                    <option value="WIRE">Wire Transfer</option>
                    <option value="CHECK">Physical Check</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm font-medium transition-colors"
                >
                  Schedule Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
