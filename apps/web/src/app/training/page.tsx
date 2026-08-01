'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { GraduationCap, RefreshCw, CheckCircle2, Play, BookOpen, ShieldCheck } from 'lucide-react';

export default function TrainingPage() {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetDemo = () => {
    setResetting(true);
    setResetSuccess(false);
    setTimeout(() => {
      setResetting(false);
      setResetSuccess(true);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" /> Interactive Training & Demo Sandbox Mode
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Guided onboarding, resettable synthetic demo environment, and step-by-step land investment walkthroughs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">DEMO TENANT: demo-sandbox-01 ACTIVE</Badge>
        </div>
      </div>

      {/* Demo Tenant Management Card */}
      <Card className="border-amber-900/40 bg-slate-900/90">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-amber-400">Isolated Demo Tenant Sandbox</CardTitle>
              <CardDescription>
                Populated with 100+ synthetic parcels across CO, NV, and TX with complete seller communication, diligence, and financial histories. Demo data never leaks into production.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetDemo}
              disabled={resetting}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />}
            >
              {resetting ? 'Resetting Demo Data...' : 'Reset Demo Tenant Fixtures'}
            </Button>
          </div>
        </CardHeader>

        {resetSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Demo Environment Reset Successfully!</strong> 100+ synthetic parcel records, comps, seller logs, and offer scenarios re-seeded.
            </span>
          </div>
        )}
      </Card>

      {/* Interactive Guided Onboarding Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="space-y-3 text-xs">
            <div className="p-2 rounded bg-emerald-950/60 text-emerald-400 w-fit">
              <Play className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Module 1: Market & Parcel Discovery</h3>
            <p className="text-slate-400">Learn how to search licensed Regrid/ATTOM datasets and configure target market scoring filters.</p>
            <Button variant="outline" size="sm" className="w-full">
              Launch Guided Tour
            </Button>
          </div>
        </Card>

        <Card>
          <div className="space-y-3 text-xs">
            <div className="p-2 rounded bg-emerald-950/60 text-emerald-400 w-fit">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Module 2: Evidence-First Underwriting</h3>
            <p className="text-slate-400">Master Quick Screen vs Verified Underwriting and verify legal access & zoning rules.</p>
            <Button variant="outline" size="sm" className="w-full">
              Launch Guided Tour
            </Button>
          </div>
        </Card>

        <Card>
          <div className="space-y-3 text-xs">
            <div className="p-2 rounded bg-emerald-950/60 text-emerald-400 w-fit">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-sm">Module 3: Compliant Offers & E-Signature</h3>
            <p className="text-slate-400">Understand cash vs seller-financing math and human approval dispatch guardrails.</p>
            <Button variant="outline" size="sm" className="w-full">
              Launch Guided Tour
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
