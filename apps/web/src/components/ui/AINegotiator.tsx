"use client";

import React, { useState } from 'react';
import { MessageSquare, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { processInboundSellerMessage } from '@/actions/negotiationActions';

interface Props {
  propertyId: string;
  sellerId: string;
}

export function AINegotiator({ propertyId, sellerId }: Props) {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Hi! This is the Omni-Channel AI Negotiator. Simulate a seller text below to see how I extract data and reply.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<any>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    const result = await processInboundSellerMessage(propertyId, sellerId, userText);
    
    if (result.success) {
      setMessages(prev => [...prev, { role: 'ai', text: result.aiResponse }]);
      if (result.extractedData && Object.keys(result.extractedData).length > 0) {
        setExtracted(result.extractedData);
      }
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: 'Failed to process message.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6 shadow-xl">
      <div className="bg-slate-950/50 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Omni-Channel AI Negotiator</h2>
            <p className="text-xs text-slate-500">Live SMS Simulation</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[400px]">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col border-r border-slate-800">
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-slate-800' : 'bg-indigo-500/20'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-slate-400" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${
                  msg.role === 'user' ? 'bg-slate-800 text-slate-200 rounded-tr-none' : 'bg-indigo-950/30 text-indigo-100 border border-indigo-900/50 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full shrink-0 bg-indigo-500/20">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="p-3 rounded-lg bg-indigo-950/30 text-indigo-400 border border-indigo-900/50 rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> AI is analyzing intent...
                </div>
              </div>
            )}
          </div>
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Simulate seller reply (e.g. 'I want $50k and need to close fast')"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data Extraction Panel */}
        <div className="w-full md:w-64 bg-slate-950 p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Live Data Extraction
          </h3>
          {extracted ? (
            <div className="space-y-4">
              {Object.entries(extracted).map(([key, val]) => (
                <div key={key} className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-1">
                    {typeof val === 'number' && key === 'askingPrice' ? `$${val.toLocaleString()}` : String(val)}
                  </div>
                </div>
              ))}
              <div className="text-xs text-slate-500 italic mt-4">
                CRM models have been updated automatically.
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 text-center mt-10">
              Awaiting negotiation data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
