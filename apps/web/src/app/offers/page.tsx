'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox } from '@land-intelligence/ui';
import { FileCheck, DollarSign, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { calculateSellerFinancing } from '@land-intelligence/domain';

export default function OffersPage() {
  const [purchasePrice, setPurchasePrice] = useState(15000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(9.9);
  const [years, setYears] = useState(5);

  const terms = calculateSellerFinancing(purchasePrice, downPaymentPercent, interestRate, years);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-emerald-400" /> Offers & Amortization Scenarios
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate cash vs. seller-financing offer letters with human approval guardrails before dispatch.
          </p>
        </div>
        <Badge variant="warning">Requires Human Approval</Badge>
      </div>

      {/* Amortization Calculator & Offer Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <CardTitle>Seller Financing Calculator</CardTitle>
            <CardDescription>Adjust down payment, interest rate, and term length</CardDescription>
          </CardHeader>

          <div className="space-y-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 uppercase text-[10px]">Purchase Price ($)</label>
              <input
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-400 uppercase text-[9px]">Down %</label>
                <input
                  type="number"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-emerald-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase text-[9px]">Interest %</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-emerald-300 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 uppercase text-[9px]">Term (Yrs)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-emerald-300 focus:outline-none"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Down Payment Amount:</span>
                <span className="font-bold text-amber-300">${terms.downPaymentAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Monthly Payment:</span>
                <span className="text-base font-bold text-emerald-400">${terms.monthlyPayment.toFixed(2)} / mo</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Offer Dispatch Card */}
        <Card className="border-amber-900/40 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-amber-400">Offer Dispatch Approval Guardrail</CardTitle>
            <CardDescription>Human approval required prior to sending binding purchase agreement</CardDescription>
          </CardHeader>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
              <p className="font-bold text-white">Target Seller: Estate of Henry T. Miller</p>
              <p>Property: APN 123-456-789 (Costilla County, CO)</p>
              <p className="text-emerald-400">Approved Offer Price: $10,800 All-Cash</p>
            </div>

            <Button variant="primary" size="lg" className="w-full" icon={<Send className="w-4 h-4" />}>
              Approve & Dispatch Offer Letter
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
