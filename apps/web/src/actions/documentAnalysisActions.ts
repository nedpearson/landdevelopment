'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key",
});

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
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is missing.");
  }

  // Normally, we would pass the actual text extracted from an OCR pipeline here.
  // For the prototype, we simulate sending the file metadata and requesting a synthetic analysis to prove the concept.
  const prompt = `
    You are an expert real estate attorney and title examiner.
    Analyze the following simulated document.
    
    Document Type: ${documentType.replace(/_/g, ' ')}
    File Name: ${fileName}
    
    Generate a highly realistic AI analysis of this document. 
    Include standard provisions, but also insert 1 or 2 realistic "Red Flags" (e.g. restrictive covenants, easements, environmental RECs) that a developer would need to know.
    
    Return the response STRICTLY as a JSON object matching this exact schema:
    {
      "summary": "2-3 sentences summarizing the document and its critical implications.",
      "redFlags": ["flag 1", "flag 2"],
      "keyTerms": [
        { "label": "Key Term Name", "value": "Value" }
      ]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a specialized land intelligence document analyst. Return strictly JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(resultText);

    return {
      id: Math.random().toString(36).substring(7),
      documentType,
      fileName,
      summary: parsed.summary || "Analysis completed.",
      redFlags: parsed.redFlags || [],
      keyTerms: parsed.keyTerms || []
    };
  } catch (error) {
    console.error("Failed to analyze document:", error);
    // Fallback if API fails
    return {
      id: Math.random().toString(36).substring(7),
      documentType,
      fileName,
      summary: "Document parsed successfully, but AI analysis failed to generate.",
      redFlags: [],
      keyTerms: []
    };
  }
}
