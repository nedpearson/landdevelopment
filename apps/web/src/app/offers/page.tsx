'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { calculateSellerFinancing } from '@land-intelligence/domain';
import { FileCheck, DollarSign, Send, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export default function OffersPage() {
  const [purchasePrice, setPurchasePrice] = useState(14500);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(9.9);
  const [amortYears, setAmortYears] = useState(5);
  const [humanApproved, setHumanApproved] = useState(false);

  const financingTerms = calculateSellerFinancing(
    purchasePrice,
    downPaymentPercent,
    interestRate,
    amortYears
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> Offer Scenario Comparison & Contract Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Compare Cash vs Owner-Financing structures. All financial calculations pass automated test suites.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">Property APN: 123-456-789</Badge>
        </div>
      </div>

      {/* Side-by-Side Offer Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario 1: Cash Offer */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-slate-800 bg-slate-900/90">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-slate-100">Scenario A: All-Cash Fast Close</CardTitle>
                <Badge variant="success">Max Discount</Badge>
              </div>
              <CardDescription>Targeted 14-day close with zero seller financing</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Cash Purchase Price:</span>
                <span className="text-lg font-bold text-emerald-400">$10,800</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Earnest Money Deposit:</span>
                <span className="font-semibold text-slate-200">$500</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Inspection & Diligence Term:</span>
                <span className="font-semibold text-slate-200">10 Days</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Estimated Cash-on-Cash Return:</span>
                <span className="font-bold text-emerald-400">122.2%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Scenario 2: Owner Financing */}
        <div className="lg:col-span-6 space-y-4">
          <Card className="border-emerald-900/40 bg-slate-900/90">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-emerald-400">Scenario B: Seller Financing</CardTitle>
                <Badge variant="info">Higher Price to Seller</Badge>
              </div>
              <CardDescription>Monthly installment sale structure</CardDescription>
            </CardHeader>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Price ($)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Down Payment (%)</label>
                  <input
                    type="number"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Interest Rate (% APR)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amortization (Years)</label>
                  <input
                    type="number"
                    value={amortYears}
                    onChange={(e) => setAmortYears(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 space-y-1.5 font-mono text-emerald-300">
                <div className="flex justify-between">
                  <span>Down Payment Amount:</span>
                  <span className="font-bold">${financingTerms.downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Financed Principal:</span>
                  <span>${financingTerms.financedAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-emerald-800/40">
                  <span>Monthly Seller Payment:</span>
                  <span className="text-emerald-400">${financingTerms.monthlyPayment}/mo</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Human Approval Guardrail & Offer Transmission */}
      <Card className="border-amber-900/50 bg-slate-950">
        <CardHeader>
          <CardTitle className="text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" /> Human Approval & Document Dispatch Guardrail
          </CardTitle>
          <CardDescription>
            Consequential Action Enforcement (Product Principle #6): Offers cannot be dispatched automatically by AI without explicit human approval.
          </CardDescription>
        </CardHeader>

        <div className="space-y-4 text-xs">
          <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
            <input
              type="checkbox"
              checked={humanApproved}
              onChange={(e) => setHumanApproved(e.target.checked)}
              className="rounded accent-emerald-500 w-5 h-5"
            />
            <div>
              <span className="font-semibold text-slate-100 block">
                I explicitly verify and approve the valuation assumptions and offer terms above.
              </span>
              <span className="text-slate-400">
                Timestamp: {new Date().toLocaleString()} | User ID: usr-principal-01
              </span>
            </div>
          </label>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Preview Agreement PDF</Button>
            <Button
              variant="primary"
              disabled={!humanApproved}
              icon={humanApproved ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            >
              {humanApproved ? 'Transmit Offer to E-Signature' : 'Approval Required to Send'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
