"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Mail, MessageSquare, Loader2, Send, Plus, CheckCircle2 } from "lucide-react";
import type { Property } from "@land-intelligence/database";
import { generateCampaignCopy, getCampaignMessages } from "@/actions/campaignActions";
import { useWorkspace } from "../providers/WorkspaceProvider";

export function CampaignLaunchpad({ propertyData }: { propertyData: Property }) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [channel, setChannel] = useState("Email");
  const [showGenerator, setShowGenerator] = useState(false);
  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    fetchMessages();
  }, [propertyData.id]);

  const fetchMessages = async () => {
    const data = await getCampaignMessages(propertyData.id);
    setMessages(data);
    if (data.length === 0) setShowGenerator(true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateCampaignCopy(propertyData.id, activeWorkspace.type, channel);
    if (res.success) {
      await fetchMessages();
      setShowGenerator(false);
    }
    setLoading(false);
  };

  const markAsSent = (id: string) => {
    // In a full implementation this would update the status in the DB
    setMessages(messages.map(m => m.id === id ? { ...m, status: "SENT" } : m));
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/50 rounded-xl overflow-hidden mt-6 shadow-2xl">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-indigo-950/20">
        <h3 className="font-semibold text-indigo-400 flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          Campaign CRM
        </h3>
        {!showGenerator && (
          <button 
            onClick={() => setShowGenerator(true)}
            className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded"
          >
            <Plus className="w-3 h-3" /> New Draft
          </button>
        )}
      </div>
      
      <div className="p-5">
        {showGenerator && (
          <div className="text-center py-6 bg-slate-800/30 rounded-lg border border-slate-800 mb-6">
            <p className="text-sm text-slate-400 mb-4">
              Leverage AI to automatically draft highly personalized outreach copy for this property owner.
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {['Email', 'Direct Mail', 'SMS'].map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                    channel === c 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {loading ? "Drafting Copy..." : `Generate ${channel} Draft`}
            </button>
            {messages.length > 0 && (
              <div className="mt-4">
                <button onClick={() => setShowGenerator(false)} className="text-xs text-slate-500 hover:text-slate-300">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{msg.channel}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    msg.status === 'SENT' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                {msg.copy}
              </div>
              {msg.status === 'DRAFT' && (
                <div className="p-3 bg-slate-900/30 border-t border-slate-800 flex justify-end gap-2">
                  <button onClick={() => markAsSent(msg.id)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors">
                    <CheckCircle2 className="w-3 h-3" /> Approve & Send
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
