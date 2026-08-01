'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, Badge, Button } from '@land-intelligence/ui';
import { GraduationCap, Play, CheckCircle2, BookOpen } from 'lucide-react';

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" /> Training & Synthetic Demo Sandbox
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive training modules and synthetic scenario sandboxes for title runsheets, severed minerals, Pugh clauses, and ROW negotiation.
          </p>
        </div>
        <Badge variant="info">10 Interactive Training Modules</Badge>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <Badge variant="warning">TITLE RUNSHEETS</Badge>
            <CardTitle className="text-white mt-1">1. Severed Mineral Title & Gap Spotting</CardTitle>
            <CardDescription>Practice building chronological runsheets and spotting unprobated wills</CardDescription>
          </CardHeader>

          <Button variant="primary" size="sm" icon={<Play className="w-3.5 h-3.5" />}>
            Start Interactive Sandbox
          </Button>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <Badge variant="success">LEASE ADMINISTRATION</Badge>
            <CardTitle className="text-white mt-1">2. Pugh Clauses & HBP Evidence Chain</CardTitle>
            <CardDescription>Learn how vertical and horizontal Pugh clauses impact held-by-production status</CardDescription>
          </CardHeader>

          <Button variant="outline" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
            Open Module Guide
          </Button>
        </Card>

        <Card className="border-slate-800 bg-slate-900">
          <CardHeader>
            <Badge variant="info">RIGHT-OF-WAY</Badge>
            <CardTitle className="text-white mt-1">3. ROW Easement Damage Settlement</CardTitle>
            <CardDescription>Calculate price per rod, crop damages, and temporary workspace acreage</CardDescription>
          </CardHeader>

          <Button variant="outline" size="sm" icon={<BookOpen className="w-3.5 h-3.5" />}>
            Open Module Guide
          </Button>
        </Card>
      </div>
    </div>
  );
}
