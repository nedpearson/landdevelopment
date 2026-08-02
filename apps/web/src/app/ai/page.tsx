'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { Sparkles, Send, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export default function AIPage() {
  const [prompt, setPrompt] = useState('Analyze deal scores and mineral tract title gaps in Reeves County, TX');
  const [response, setResponse] = useState<string | null>(
    'Pearson Developments Grounded AI Assistant: Analysis of Reeves County Tract #T-104 indicates a 1/4 mineral interest owned by the Estate of Henry T. Miller. Unprobated foreign will detected in Instrument #3 requires an Affidavit of Heirship before division order approval. Suggested bonus offer is $4,500/NMA.'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" /> Grounded AI Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Execute natural language market research, title gap analysis, runsheet summarization, and offer generation with source citations.
          </p>
        </div>
        <Badge variant="success" className="font-mono">MODEL: GROUNDED RAG v2.0</Badge>
      </div>

      {/* Interactive AI Prompt Console */}
      <Card className="border-emerald-900/40 bg-slate-900">
        <CardHeader>
          <CardTitle>AI Prompt Assistant</CardTitle>
          <CardDescription>Enter natural language questions or select from verified prompt presets</CardDescription>
        </CardHeader>

        <div className="space-y-4 text-xs">
          <div className="flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything about parcels, title runsheets, leases, or comps..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <Button variant="primary" icon={<Send className="w-4 h-4" />}>
              Execute Analysis
            </Button>
          </div>

          {/* AI Response Box */}
          {response && (
            <EvidenceBox
              source="Costilla County Registry & Reeves County Title Plant Unified Data Feed"
              retrievedAt={new Date().toISOString()}
              confidenceScore={96}
              verificationState="ATTORNEY_VERIFIED"
              assumptions={['Comps restricted to last 180 days', 'Depth interval restricted to Wolfcamp A & B']}
            >
              <div className="space-y-2 text-xs text-slate-200">
                <p className="font-semibold text-emerald-400">Response:</p>
                <p>{response}</p>
              </div>
            </EvidenceBox>
          )}
        </div>
      </Card>
    </div>
  );
}
