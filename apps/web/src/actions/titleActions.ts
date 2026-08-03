"use server";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type TitleDefect = {
  id: string;
  type: 'LIEN' | 'PROBATE' | 'HEIRSHIP' | 'EASEMENT' | 'TAX' | 'UNKNOWN';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendedCurative: string;
};

export type TitleAnalysisResult = {
  riskScore: number; // 0-100
  defects: TitleDefect[];
  summary: string;
  isClearToClose: boolean;
};

export async function runAutonomousTitleAnalysis(apn: string, county: string, state: string): Promise<TitleAnalysisResult | null> {
  try {
    const prompt = `
      You are an expert real estate title attorney.
      Simulate running a chain of title analysis for APN: ${apn} in ${county} County, ${state}.
      
      Generate a realistic title analysis result. 
      Requirements:
      1. Invent 0 to 3 realistic title defects (e.g. mechanic's lien, unreleased mortgage from 1980, missing heir in probate, back taxes).
      2. If defects exist, assign a realistic risk score (0 is perfect title, 100 is completely clouded).
      3. For each defect, provide the "recommendedCurative" steps (e.g. "File Quiet Title", "Obtain Affidavit of Heirship").
      4. "isClearToClose" should be true ONLY if there are 0 defects or only LOW severity defects.
      
      Return ONLY JSON matching this schema:
      {
        "riskScore": number,
        "summary": "string",
        "isClearToClose": boolean,
        "defects": [
          {
            "id": "uuid",
            "type": "LIEN" | "PROBATE" | "HEIRSHIP" | "EASEMENT" | "TAX" | "UNKNOWN",
            "description": "string",
            "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "recommendedCurative": "string"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are an AI Title Attorney. Return strict JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return null;

    return JSON.parse(content) as TitleAnalysisResult;

  } catch (error) {
    console.error("Title analysis engine failed:", error);
    return null;
  }
}
