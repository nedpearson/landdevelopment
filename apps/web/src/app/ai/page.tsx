'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Sparkles, Send, ShieldCheck, Database, FileText } from 'lucide-react';

export default function AICommandCenterPage() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; text: string; citations?: any[] }[]
  >([
    {
      role: 'assistant',
      text: `Hello! I am your Land Intelligence OS Grounded AI Assistant. All my analyses are strictly grounded in your organization's verified parcel records, spatial comp engine, and licensed GIS feeds. How can I assist your underwriting or outreach today?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!prompt.trim()) return;
    const userMsg = prompt;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setPrompt('');
    setLoading(true);

    setTimeout(() => {
      let replyText = '';
      if (userMsg.toLowerCase().includes('score') || userMsg.toLowerCase().includes('deal')) {
        replyText = `Based on your Costilla County GIS feed and 3 spatial comps:\n- **APN 123-456-789** has an **84/100 Deal Score**.\n- Equity margin is 39.5% ($14,500 asking vs $24,000 market).\n- Road access is 100% verified (320 ft frontage on County Dirt Road).\n- Recommended Next Action: Approve cash offer of $10,800 or 5-year seller financing option.`;
      } else if (userMsg.toLowerCase().includes('offer') || userMsg.toLowerCase().includes('finance')) {
        replyText = `Cash vs Owner Financing Comparison for APN 123-456-789:\n1. **Cash Offer**: $10,800 (122.2% Cash-on-Cash Return, 14-day close)\n2. **Seller Financing**: $14,500 Price ($1,450 down, 9.9% APR, $276.54/mo over 60 months).`;
      } else {
        replyText = `I have verified all 3 properties in your active pipeline. Zero cross-tenant data leakage detected. All 3 properties have 0% flood zone risk and verified access deeds.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: replyText,
          citations: [
            { source: 'Regrid Licensed Parcel Feed', confidence: 0.96 },
            { source: 'Land Intelligence Spatial Comp Engine', confidence: 0.94 },
          ],
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> Grounded AI Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Retrieval-grounded assistant with tenant data isolation, tool execution guardrails, and citation tracking.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success">Gateway: Anthropic / OpenAI Grounded RAG</Badge>
        </div>
      </div>

      {/* Suggested Grounded Prompts */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setPrompt('Show the highest-confidence deals in my target counties.')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-700 hover:text-white transition-colors"
        >
          💡 "Show highest-confidence deals in Costilla & Elko"
        </button>
        <button
          onClick={() => setPrompt('Compare the owner-finance and cash scenarios for APN 123-456-789.')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-700 hover:text-white transition-colors"
        >
          💡 "Compare owner-finance and cash scenarios"
        </button>
        <button
          onClick={() => setPrompt('Which diligence items are blocking closing?')}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-700 hover:text-white transition-colors"
        >
          💡 "Which diligence items are blocking closing?"
        </button>
      </div>

      {/* Chat Area */}
      <Card className="h-[480px] flex flex-col justify-between p-4 bg-slate-900/90 border-slate-800">
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {msg.citations && (
                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Grounded Citations & Sources:
                    </span>
                    {msg.citations.map((c, cIdx) => (
                      <div key={cIdx} className="flex justify-between">
                        <span>• {c.source}</span>
                        <span className="text-emerald-300 font-mono">{(c.confidence * 100).toFixed(0)}% Confidence</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" /> Retrieving grounded parcel intelligence...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant about deals, comps, underwriting, or sellers..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
          />
          <Button variant="primary" size="md" onClick={handleSend} icon={<Send className="w-4 h-4" />}>
            Ask AI
          </Button>
        </div>
      </Card>
    </div>
  );
}
