'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Users, Mail, Phone, Calendar, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { getSellers } from '@/actions/crmActions';
import { logCommunication } from '@/actions/communicationActions';

export default function SellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSellers().then(data => {
      setSellers(data);
      setIsLoading(false);
    });
  }, []);

  const handleMessage = async (sellerId: string) => {
    const text = window.prompt('Enter your message to the seller:');
    if (!text) return;
    
    await logCommunication(sellerId, 'SMS', text);
    alert('Message sent successfully!');
    
    // Refresh
    const data = await getSellers();
    setSellers(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Seller CRM & Multi-Channel Outreach Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage seller relationships, direct mail campaign responses, phone logs, and offer delivery timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            Add New Seller Record
          </Button>
        </div>
      </div>

      {/* Seller CRM Table */}
      <Card className="border-slate-800 bg-slate-900">
        <CardHeader>
          <CardTitle>Active Seller Pipeline</CardTitle>
          <CardDescription>Seller motivation levels, contact timeline, asking price, and offer status</CardDescription>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase text-[10px] text-slate-400">
              <tr>
                <th className="p-3">Seller Name</th>
                <th className="p-3">Associated Property</th>
                <th className="p-3">Contact Email / Phone</th>
                <th className="p-3">Motivation Level</th>
                <th className="p-3">Asking Price</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {sellers.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">No sellers found in the database.</td>
                </tr>
              )}
              {sellers.map((seller) => {
                const primaryProperty = seller.properties?.[0]?.property;
                return (
                  <tr key={seller.id} className="hover:bg-slate-800/40 group">
                    <td className="p-3 font-semibold text-white">{seller.name}</td>
                    <td className="p-3 text-emerald-400">
                      {primaryProperty ? `APN: ${primaryProperty.apn} (${primaryProperty.acreage} AC)` : 'None'}
                    </td>
                    <td className="p-3">{seller.email || seller.phone || 'N/A'}</td>
                    <td className="p-3">
                      <Badge variant={seller.motivationLevel === 'HIGH' || seller.motivationLevel === 'URGENT' ? 'danger' : 'info'}>
                        {seller.motivationLevel} MOTIVATION
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-200">{seller.askingPrice ? `$${seller.askingPrice.toLocaleString()}` : 'Unknown'}</td>
                    <td className="p-3">{new Date(seller.updatedAt).toISOString().split('T')[0]}</td>
                    <td className="p-3">
                      <Badge variant="warning">AWAITING ACTION</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleMessage(seller.id)} className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageSquare className="w-3 h-3" />
                        Quick SMS
                      </Button>
                    </td>
                  </tr>
                );
              })}
              
              {sellers.length === 0 && isLoading && (
                 <tr className="hover:bg-slate-800/40 opacity-50">
                   <td className="p-3 font-semibold text-white">Loading database...</td>
                   <td colSpan={7}></td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
