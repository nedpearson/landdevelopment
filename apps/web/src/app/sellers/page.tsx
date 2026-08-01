'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { Users, Mail, Phone, MessageSquare, ShieldCheck, Clock, Send } from 'lucide-react';

export default function SellersCRMPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" /> Seller CRM & Multichannel Communication Timeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compliant direct outreach with strict DNC / TCPA consent tracking and automated follow-up sequences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" icon={<Mail className="w-3.5 h-3.5" />}>
            New Campaign Outreach
          </Button>
        </div>
      </div>

      {/* Seller CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Sellers Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Active Contacts</h2>

          <Card className="border-emerald-800 bg-slate-900 cursor-pointer">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-sm">Robert & Elena Vance</h3>
                <Badge variant="success">HIGH MOTIVATION</Badge>
              </div>
              <p className="text-slate-400">APN: 123-456-789 (Costilla, CO)</p>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> rvance84@gmail.com
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> (512) 555-0192
              </div>
              <div className="flex items-center gap-2 text-emerald-400 pt-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" /> Opted-In / DNC Clean
              </div>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60 opacity-80 cursor-pointer">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white text-sm">Desert Sun Investments LLC</h3>
                <Badge variant="warning">MEDIUM MOTIVATION</Badge>
              </div>
              <p className="text-slate-400">APN: 987-654-321 (Elko, NV)</p>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> info@desertsun.com
              </div>
            </div>
          </Card>
        </div>

        {/* Communication Timeline & Direct Outreach Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Timeline for Robert & Elena Vance</CardTitle>
                <CardDescription>All emails, calls, SMS messages, and direct mail letters</CardDescription>
              </div>
              <Badge variant="success">Consent Verified</Badge>
            </CardHeader>

            <div className="space-y-4 text-xs">
              {/* Event 1 */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-950 text-emerald-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-semibold text-slate-200">OUTBOUND EMAIL: Initial Cash Offer Letter</span>
                    <span>Yesterday at 2:15 PM</span>
                  </div>
                  <p className="text-slate-300">
                    "Hello Robert, Apex Land Capital would like to extend a cash offer of $10,800 for your 5.2-acre parcel in Costilla County..."
                  </p>
                </div>
              </div>

              {/* Event 2 */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded bg-emerald-950 text-emerald-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span className="font-semibold text-slate-200">INBOUND CALL: Seller Phone Discussion</span>
                    <span>3 days ago</span>
                  </div>
                  <p className="text-slate-300">
                    Seller confirmed interest in selling. Wants to verify if owner financing is an option. Prefers $14,500 with $1,450 down.
                  </p>
                </div>
              </div>

              {/* Send Quick Reply Input */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <label className="block text-slate-300 font-semibold">Send Direct Message / Email</label>
                <textarea
                  rows={3}
                  placeholder="Type your message to seller..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  defaultValue="Hi Robert, we've reviewed your request and generated a custom 5-year seller financing option at $276.54/mo. Let me know if you would like me to send over the agreement!"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="primary" size="sm" icon={<Send className="w-3.5 h-3.5" />}>
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
