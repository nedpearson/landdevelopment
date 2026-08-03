'use client';

import { submitGenericForm } from '@/actions/genericActions';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Check, X, Plus, Users } from 'lucide-react';

type TourStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show';

interface Tour {
  id: string;
  date: string;
  time: string;
  address: string;
  clientName: string;
  agent: string;
  status: TourStatus;
  notes: string;
}

const MOCK_TOURS: Tour[] = [
  { id: '1', date: '2024-02-15', time: '10:00 AM', address: '1200 Commerce Blvd', clientName: 'Sarah Jenkins', agent: 'Ned Pearson', status: 'Scheduled', notes: 'First showing, focus on loading docks.' },
  { id: '2', date: '2024-02-15', time: '02:30 PM', address: '850 Industrial Pkwy', clientName: 'Michael Chang', agent: 'Ned Pearson', status: 'Scheduled', notes: 'Client wants to see office buildup.' },
  { id: '3', date: '2024-02-16', time: '09:00 AM', address: '400 Main St Retail', clientName: 'Emily Robinson', agent: 'Jane Doe', status: 'Cancelled', notes: 'Client rescheduled.' },
  { id: '4', date: '2024-02-14', time: '11:00 AM', address: '9900 Medical Plaza', clientName: 'Jessica Torres', agent: 'Ned Pearson', status: 'Completed', notes: 'Went well, expects LOI.' },
  { id: '5', date: '2024-02-14', time: '04:00 PM', address: '250 Warehouse Way', clientName: 'David Miller', agent: 'Ned Pearson', status: 'No-Show', notes: 'Client stuck in traffic, rebooking.' },
];

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await submitGenericForm(Object.fromEntries(formData.entries()));
    setIsModalOpen(false);
    showToast(result.success ? 'Saved successfully!' : 'Error saving');
  };

  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  const updateStatus = (id: string, status: TourStatus) => {
    showToast(`Tour status persistence coming soon`);
  };

  const StatusBadge = ({ status }: { status: TourStatus }) => {
    const styles = {
      'Scheduled': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      'Completed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      'Cancelled': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      'No-Show': 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[status]}`}>{status}</span>;
  };

  // Group tours by date
  const groupedTours = tours.reduce((acc, tour) => {
    if (!acc[tour.date]) acc[tour.date] = [];
    acc[tour.date].push(tour);
    return acc;
  }, {} as Record<string, Tour[]>);

  const sortedDates = Object.keys(groupedTours).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-rose-500" />
            Tour Scheduler
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage property showings and site visits.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Schedule Tour
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {sortedDates.map(date => (
          <div key={date}>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
              <CalendarIcon className="w-5 h-5 text-slate-400" />
              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="space-y-4">
              {groupedTours[date].sort((a,b) => a.time.localeCompare(b.time)).map(tour => (
                <div key={tour.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm hover:border-rose-500/30 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
                  
                  <div className="md:w-32 shrink-0">
                    <div className="text-xl font-bold text-white flex items-center gap-1"><Clock className="w-4 h-4 text-rose-500"/> {tour.time}</div>
                    <div className="mt-2"><StatusBadge status={tour.status} /></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-6">
                    <div>
                      <h3 className="font-medium text-white text-base mb-1">{tour.address}</h3>
                      <div className="text-sm text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> Property</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-200 text-base mb-1">{tour.clientName}</h3>
                      <div className="text-sm text-slate-400 flex items-center gap-1"><User className="w-3 h-3"/> Client</div>
                    </div>
                    {tour.notes && (
                      <div className="md:col-span-2 text-sm text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-700/50">
                        {tour.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 justify-end shrink-0 md:border-l border-slate-700 md:pl-4">
                    {tour.status === 'Scheduled' && (
                      <>
                        <button onClick={() => updateStatus(tour.id, 'Completed')} className="text-emerald-400 hover:bg-emerald-400/10 p-2 rounded transition-colors" title="Mark Completed"><Check className="w-5 h-5" /></button>
                        <button onClick={() => updateStatus(tour.id, 'Cancelled')} className="text-slate-400 hover:bg-slate-400/10 p-2 rounded transition-colors" title="Cancel Tour"><X className="w-5 h-5" /></button>
                        <button onClick={() => updateStatus(tour.id, 'No-Show')} className="text-red-400 hover:bg-red-400/10 p-2 rounded transition-colors" title="Mark No-Show"><Users className="w-5 h-5" /></button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Schedule Tour</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Property Address</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" placeholder="123 Main St" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Client Name</label>
                  <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" placeholder="Client Name" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date</label>
                    <input required type="date" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Time</label>
                    <input required type="time" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
                  <textarea rows={2} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500" placeholder="Special instructions..."></textarea>
                </div>
                
                <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Schedule Tour</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 border border-slate-700 shadow-lg rounded-lg p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-500">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-white">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
