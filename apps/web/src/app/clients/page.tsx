'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Users, Search, Plus, X, Phone, Mail, Building, Target, Clock, Check, MoreHorizontal, FileText } from 'lucide-react';
import { getBuyers, createBuyer } from '@/actions/buyerActions';
import { getSellers, createSeller } from '@/actions/sellerActions';

type ClientType = 'Buyer' | 'Seller';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const [buyers, sellers] = await Promise.all([getBuyers(), getSellers()]);
    const mappedBuyers = buyers.map(b => ({ ...b, type: 'Buyer', targetPrice: (b.criteria as any)?.targetPrice || 0, status: 'Active' }));
    const mappedSellers = sellers.map(s => ({ ...s, type: 'Seller', targetPrice: s.askingPrice || 0, status: 'Active' }));
    
    const combined = [...mappedBuyers, ...mappedSellers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setClients(combined);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val: number) => {
    if (!val || val === 0) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
      'Active': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      'Inactive': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      'Prospect': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles['Active']}`}>{status || 'Active'}</span>;
  };

  const TypeBadge = ({ type }: { type: ClientType }) => {
    const styles = {
      'Buyer': 'text-sky-400 bg-sky-400/10',
      'Seller': 'text-amber-400 bg-amber-400/10',
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[type]}`}>{type}</span>;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = formData.get('type') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const targetPrice = Number(formData.get('targetPrice'));

    startTransition(() => {
      (async () => {
        if (type === 'Buyer') {
          const res = await createBuyer({ name, email, phone, criteria: { targetPrice } });
          if (res.success) {
            showToast('Buyer added successfully');
            setIsModalOpen(false);
            loadClients();
          } else showToast('Failed to add buyer', 'error');
        } else {
          const res = await createSeller({ name, email, phone, askingPrice: targetPrice });
          if (res.success) {
            showToast('Seller added successfully');
            setIsModalOpen(false);
            loadClients();
          } else showToast('Failed to add seller', 'error');
        }
      })();
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans flex gap-6">
      <div className={`flex-1 transition-all ${selectedClient ? 'hidden lg:block lg:w-2/3' : 'w-full'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="text-indigo-500" />
              Client Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">Track buyers and sellers.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Client
          </button>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search clients by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Target Price / Asking</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredClients.map(client => (
                  <tr 
                    key={client.id} 
                    onClick={() => setSelectedClient(client)}
                    className={`hover:bg-slate-700/50 transition-colors cursor-pointer ${selectedClient?.id === client.id ? 'bg-slate-700/50 border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{client.name}</div>
                    </td>
                    <td className="px-4 py-3"><TypeBadge type={client.type} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 text-slate-300">
                        <span className="flex items-center gap-1 text-xs"><Phone className="w-3 h-3 text-slate-500"/> {client.phone || 'N/A'}</span>
                        <span className="flex items-center gap-1 text-xs"><Mail className="w-3 h-3 text-slate-500"/> {client.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-medium">
                      {formatCurrency(client.targetPrice)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={client.status} /></td>
                    <td className="px-4 py-3 text-slate-400 text-xs flex items-center gap-1 h-full pt-5">
                       <Clock className="w-3 h-3" /> {new Date(client.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedClient && (
        <div className="w-full lg:w-1/3 bg-slate-800 border border-slate-700 rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-3rem)] sticky top-6">
          <div className="p-5 border-b border-slate-700 flex justify-between items-start bg-slate-900/30 rounded-t-xl">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{selectedClient.name}</h2>
                <StatusBadge status={selectedClient.status} />
              </div>
            </div>
            <button onClick={() => setSelectedClient(null)} className="text-slate-500 hover:text-white bg-slate-800 p-1 rounded-md">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contact Info</h3>
              <div className="bg-slate-900/50 rounded-lg p-3 space-y-3 border border-slate-700/50">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="select-all cursor-pointer hover:text-indigo-400" onClick={() => { navigator.clipboard.writeText(selectedClient.phone || ''); showToast('Copied phone'); }}>{selectedClient.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="select-all cursor-pointer hover:text-indigo-400" onClick={() => { navigator.clipboard.writeText(selectedClient.email || ''); showToast('Copied email'); }}>{selectedClient.email || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</h3>
              <div className="bg-slate-900/50 rounded-lg p-3 grid grid-cols-2 gap-4 border border-slate-700/50">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Client Type</div>
                  <TypeBadge type={selectedClient.type} />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Price Marker</div>
                  <div className="text-sm font-medium text-white">{formatCurrency(selectedClient.targetPrice)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-lg shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Add New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input required name="name" type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="John Doe" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input name="phone" type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="(555) 000-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input name="email" type="email" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="john@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Client Type</label>
                    <select name="type" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">
                      <option>Buyer</option>
                      <option>Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Target Price / Asking ($)</label>
                    <input name="targetPrice" type="number" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" placeholder="0" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {isPending ? 'Saving...' : 'Save Client'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className={`p-1.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
