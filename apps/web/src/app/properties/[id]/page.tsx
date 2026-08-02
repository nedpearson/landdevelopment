'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button, EvidenceBox, FractionBadge } from '@land-intelligence/ui';
import { MapPin, Calculator, ShieldCheck, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/discover" className="text-xs text-emerald-400 flex items-center gap-1 hover:underline mb-2 font-mono">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Parcel Discovery
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Property Record: APN 123-456-789
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Costilla County, CO | San Luis Valley Region | Legal Description: NW1/4 Section 14, Block 55
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="font-mono">STAGE: QUALIFIED (DEAL SCORE 84)</Badge>
        </div>
      </div>

      {/* Property Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle>Parcel Specifications & Attributes</CardTitle>
              <CardDescription>Spatial boundaries, county assessor data, and tax status</CardDescription>
            </CardHeader>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Gross Acreage</span>
                <p className="text-base font-bold text-white mt-1">160.00 AC</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Assessed Value</span>
                <p className="text-base font-bold text-emerald-400 mt-1">$96,000</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Delinquent Taxes</span>
                <p className="text-base font-bold text-emerald-400 mt-1">$0.00 (Clear)</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase font-semibold">Mineral Share</span>
                <div className="mt-1">
                  <FractionBadge fraction={{ numerator: 1n, denominator: 4n }} label="NMA" />
                </div>
              </div>
            </div>
          </Card>

          <EvidenceBox
            source="Costilla County GIS & Clerk Assessor Record Feed"
            retrievedAt={new Date().toISOString()}
            confidenceScore={96}
            verificationState="ATTORNEY_VERIFIED"
          >
            <p className="text-xs text-slate-300">
              Verified Parcel Data Provenance: Legal description matched against county plat maps. Property has 160 gross acres with 40 Net Mineral Acres severed.
            </p>
          </EvidenceBox>
        </div>

        {/* Action Handoff Panel */}
        <div>
          <Card className="border-emerald-900/40 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-emerald-400">Quick Actions</CardTitle>
              <CardDescription>Dispatch offers or open underwriting</CardDescription>
            </CardHeader>

            <div className="space-y-3">
              <Link href="/underwriting">
                <Button variant="primary" size="lg" className="w-full" icon={<Calculator className="w-4 h-4" />}>
                  Open Underwriting
                </Button>
              </Link>
              <Link href="/offers">
                <Button variant="outline" size="lg" className="w-full" icon={<FileText className="w-4 h-4" />}>
                  Generate Offer Letter
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
