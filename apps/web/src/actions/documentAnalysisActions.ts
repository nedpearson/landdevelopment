'use server';

export type DocumentType = 'TITLE_COMMITMENT' | 'WARRANTY_DEED' | 'ENVIRONMENTAL_PHASE_1' | 'TAX_RECORD';

export type AIAnalysisResult = {
  id: string;
  documentType: DocumentType;
  fileName: string;
  summary: string;
  redFlags: string[];
  keyTerms: { label: string; value: string }[];
};

export async function analyzeDocument(documentType: DocumentType, fileName: string): Promise<AIAnalysisResult> {
  // Simulate AI latency for OCR and NLP extraction
  await new Promise(resolve => setTimeout(resolve, 2000));

  if (documentType === 'TITLE_COMMITMENT') {
    return {
      id: Math.random().toString(36).substring(7),
      documentType,
      fileName,
      summary: "The Title Commitment shows standard exceptions, but flags a restrictive covenant and a utility easement crossing the buildable area.",
      redFlags: ["Schedule B: 20ft Ingress/Egress Easement on North Boundary", "Schedule B: Restrictive Covenant limiting commercial use"],
      keyTerms: [
        { label: "Vesting", value: "Fee Simple Estate" },
        { label: "Insured Amount", value: "$1,200,000" },
        { label: "Effective Date", value: "10/12/2026" }
      ]
    };
  }

  if (documentType === 'ENVIRONMENTAL_PHASE_1') {
    return {
      id: Math.random().toString(36).substring(7),
      documentType,
      fileName,
      summary: "Phase I ESA identified a Recognized Environmental Condition (REC) related to a historical underground storage tank on the adjacent parcel.",
      redFlags: ["REC: Potential groundwater migration from adjacent defunct gas station"],
      keyTerms: [
        { label: "Recommendation", value: "Phase II Subsurface Testing Required" },
        { label: "Historical Use", value: "Agricultural (1950-1990)" }
      ]
    };
  }

  // Default fallback for Deeds/Tax
  return {
    id: Math.random().toString(36).substring(7),
    documentType,
    fileName,
    summary: "Document parsed successfully. No critical anomalies detected in standard provisions.",
    redFlags: [],
    keyTerms: [
      { label: "Grantor", value: "John Doe LLC" },
      { label: "Grantee", value: "Pearson Developments" }
    ]
  };
}
