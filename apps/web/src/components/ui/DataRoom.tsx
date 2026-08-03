"use client";

import React, { useState } from "react";
import { FolderKanban, FileText, UploadCloud, FileSearch, Loader2, AlertTriangle, CheckCircle2, FileSignature } from "lucide-react";
import { analyzeDocument } from "@/actions/documentAnalysisActions";
import { generatePSA } from "@/actions/documentActions";
import type { AIAnalysisResult, DocumentType } from "@/actions/documentAnalysisActions";
import type { GeneratedDocument } from "@/actions/documentActions";

const MOCK_FILES = [
  { id: "1", name: "Title_Commitment_Prelim.pdf", type: "TITLE_COMMITMENT" as DocumentType, date: "Oct 12, 2026" },
  { id: "2", name: "Phase_1_ESA_Final.pdf", type: "ENVIRONMENTAL_PHASE_1" as DocumentType, date: "Oct 14, 2026" },
  { id: "3", name: "Warranty_Deed_Recorded.pdf", type: "WARRANTY_DEED" as DocumentType, date: "Jan 05, 2024" }
];

interface Props {
  propertyId?: string;
}

export function DataRoom({ propertyId }: Props) {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, AIAnalysisResult>>({});
  
  const [generatingPSA, setGeneratingPSA] = useState(false);
  const [generatedPSA, setGeneratedPSA] = useState<GeneratedDocument | null>(null);

  const handleAnalyze = async (fileId: string, type: DocumentType, fileName: string) => {
    setAnalyzingId(fileId);
    const result = await analyzeDocument(type, fileName);
    setResults(prev => ({ ...prev, [fileId]: result }));
    setAnalyzingId(null);
  };

  const handleGeneratePSA = async () => {
    if (!propertyId) return;
    setGeneratingPSA(true);
    const doc = await generatePSA(propertyId);
    if (doc) {
      setGeneratedPSA(doc);
    }
    setGeneratingPSA(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-6">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-emerald-400" />
          Smart Data Room
        </h3>
        <div className="flex items-center gap-3">
          {propertyId && (
            <button 
              onClick={handleGeneratePSA}
              disabled={generatingPSA}
              className="flex items-center gap-2 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg transition-colors border border-emerald-500/20 disabled:opacity-50"
            >
              {generatingPSA ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSignature className="w-4 h-4" />}
              {generatingPSA ? "Generating..." : "Auto-Generate PSA"}
            </button>
          )}
          <button className="flex items-center gap-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-700">
            <UploadCloud className="w-4 h-4" /> Upload
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800">
        {MOCK_FILES.map(file => {
          const analysis = results[file.id];
          const isAnalyzing = analyzingId === file.id;

          return (
            <div key={file.id} className="p-4 hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-200">{file.name}</div>
                    <div className="text-xs text-slate-500">{file.date} • {file.type.replace(/_/g, ' ')}</div>
                  </div>
                </div>

                {!analysis && !isAnalyzing && (
                  <button 
                    onClick={() => handleAnalyze(file.id, file.type, file.name)}
                    className="flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/30 hover:bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-900/50 transition-colors"
                  >
                    <FileSearch className="w-3.5 h-3.5" /> AI Analysis
                  </button>
                )}
                {isAnalyzing && (
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-400 px-3 py-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Scanning OCR...
                  </span>
                )}
                {analysis && (
                  <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 px-3 py-1.5 bg-emerald-950/30 border border-emerald-900/50 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Parsed
                  </span>
                )}
              </div>

              {/* AI Result Expansion */}
              {analysis && (
                <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg ml-12">
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{analysis.summary}</p>
                  
                  {analysis.redFlags.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Critical Risks Detected
                      </h4>
                      {analysis.redFlags.map((flag, idx) => (
                        <div key={idx} className="text-xs text-slate-300 bg-red-950/30 border border-red-900/50 p-2 rounded">
                          {flag}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {analysis.keyTerms.map((term, idx) => (
                      <div key={idx}>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">{term.label}</div>
                        <div className="text-xs font-semibold text-slate-200">{term.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {generatedPSA && (
        <div className="p-6 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 mb-4">
            <FileSignature className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-bold text-slate-200">{generatedPSA.title}</h4>
            <span className="ml-auto text-xs font-semibold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
              AI Generated
            </span>
          </div>
          
          <div className="mb-6 space-y-2">
            <h5 className="text-xs font-bold text-slate-500 uppercase">Key Clauses Detected</h5>
            {generatedPSA.clauses.map((clause, idx) => (
              <div key={idx} className="text-sm text-slate-300 bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {clause}
              </div>
            ))}
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">Document Content</h5>
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg text-sm text-slate-300 whitespace-pre-wrap font-mono overflow-auto max-h-96">
              {generatedPSA.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
