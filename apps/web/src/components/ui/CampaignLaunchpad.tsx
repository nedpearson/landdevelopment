"use client";

import React, { useState } from "react";
import { Megaphone, Mail, MessageSquare, Loader2, Send } from "lucide-react";
import type { Property } from "@land-intelligence/database";
import { generateCampaignCopy } from "@/actions/campaignActions";
import { useIndustryRole } from "../providers/IndustryRoleProvider";

export function CampaignLaunchpad({ propertyData }: { propertyData: Property }) {
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState("");
  const { currentRole } = useIndustryRole();

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateCampaignCopy(propertyData.id, currentRole);
    if (res.success) {
      setCopy(res.copy);
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-indigo-900/50 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-indigo-950/20">
        <h3 className="font-semibold text-indigo-400 flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          Automated Campaign Engine
        </h3>
      </div>
      
      <div className="p-5">
        {!copy ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-4">
              Leverage the AI Scorecard to automatically draft highly personalized outreach copy for this property owner.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              {loading ? "Drafting Copy..." : "Generate Outreach"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap">
              {copy}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Send className="w-4 h-4" /> Send Direct Mail
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-semibold border border-slate-700 transition-colors">
                <MessageSquare className="w-4 h-4" /> Send SMS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
