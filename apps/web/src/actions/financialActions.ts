'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key"|| 'dummy_key',
});

export interface FinancialScenarioParams {
  purchasePrice: number;
  developmentCosts: number;
  holdTimeMonths: number;
  exitStrategy: 'AS_IS' | 'SUBDIVIDE' | 'ENTITLE_FLIP' | 'BUILD_TO_RENT';
  subdivisionLots?: number;
  ltvPercent: number;
  interestRatePercent: number;
}

export interface FinancialScenarioResult {
  metrics: {
    totalCapitalRequired: number;
    projectedRevenue: number;
    totalProfit: number;
    unleveredIrr: number;
    leveredIrr: number;
    equityMultiple: number;
    cashOnCash: number;
  };
  aiAnalysis: {
    optimalStrategy: string;
    hiddenRisks: string[];
    timelineWarnings: string[];
    recommendation: string;
  };
}

export async function runFinancialScenario(params: FinancialScenarioParams): Promise<FinancialScenarioResult> {
  // 1. Math calculations (baseline)
  const equityRequired = (params.purchasePrice + params.developmentCosts) * (1 - (params.ltvPercent / 100));
  const loanAmount = (params.purchasePrice + params.developmentCosts) * (params.ltvPercent / 100);
  
  // Calculate simple interest carry cost
  const annualInterest = loanAmount * (params.interestRatePercent / 100);
  const totalInterest = annualInterest * (params.holdTimeMonths / 12);
  
  const totalCapitalRequired = equityRequired + totalInterest;

  // Mock revenue generation based on strategy
  let projectedRevenue = params.purchasePrice;
  if (params.exitStrategy === 'AS_IS') {
    projectedRevenue = params.purchasePrice * Math.pow(1.05, params.holdTimeMonths / 12); // 5% annual appreciation
  } else if (params.exitStrategy === 'ENTITLE_FLIP') {
    projectedRevenue = (params.purchasePrice + params.developmentCosts) * 1.5; // 50% bump for entitlements
  } else if (params.exitStrategy === 'SUBDIVIDE' && params.subdivisionLots) {
    const avgLotPrice = (params.purchasePrice / Math.max(1, (params.subdivisionLots / 3))); // Subdivided lots sell for premium
    projectedRevenue = avgLotPrice * params.subdivisionLots;
  } else if (params.exitStrategy === 'BUILD_TO_RENT') {
    projectedRevenue = (params.purchasePrice + params.developmentCosts) * 1.25; // Value of cash flow asset
  }

  const totalProfit = projectedRevenue - (params.purchasePrice + params.developmentCosts + totalInterest);
  const equityMultiple = projectedRevenue / (equityRequired || 1);
  const cashOnCash = (totalProfit / (equityRequired || 1)) / Math.max(1, (params.holdTimeMonths / 12));
  
  // Approximate IRR
  const holdYears = Math.max(1, params.holdTimeMonths / 12);
  const unleveredIrr = Math.pow((projectedRevenue / (params.purchasePrice + params.developmentCosts)), (1 / holdYears)) - 1;
  const leveredIrr = Math.pow((projectedRevenue / (equityRequired || 1)), (1 / holdYears)) - 1;

  try {
    // 2. AI Scenario Analysis
    const prompt = `
    Analyze this real estate land investment scenario:
    - Purchase Price: $${params.purchasePrice}
    - Dev Costs: $${params.developmentCosts}
    - Hold Time: ${params.holdTimeMonths} months
    - Exit Strategy: ${params.exitStrategy}
    - Lots (if subdividing): ${params.subdivisionLots || 'N/A'}
    - LTV: ${params.ltvPercent}% @ ${params.interestRatePercent}% interest
    - Calculated Projected Revenue: $${projectedRevenue}
    - Calculated Levered IRR: ${(leveredIrr * 100).toFixed(2)}%
    - Calculated Equity Multiple: ${equityMultiple.toFixed(2)}x
    - Calculated Cash-on-Cash Return: ${(cashOnCash * 100).toFixed(2)}%

    Provide a structured financial analysis identifying hidden risks, timeline warnings, and an optimal strategy recommendation.
    Respond strictly in JSON format matching the schema.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [{ role: "user", content: prompt }],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "financial_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              optimalStrategy: { type: "string" },
              hiddenRisks: { type: "array", items: { type: "string" } },
              timelineWarnings: { type: "array", items: { type: "string" } },
              recommendation: { type: "string" }
            },
            required: ["optimalStrategy", "hiddenRisks", "timelineWarnings", "recommendation"],
            additionalProperties: false
          }
        }
      }
    });

    const aiData = JSON.parse(response.choices[0].message.content || '{}');

    return {
      metrics: {
        totalCapitalRequired,
        projectedRevenue,
        totalProfit,
        unleveredIrr: unleveredIrr * 100,
        leveredIrr: leveredIrr * 100,
        equityMultiple,
        cashOnCash: cashOnCash * 100
      },
      aiAnalysis: {
        optimalStrategy: aiData.optimalStrategy || "Hold and assess",
        hiddenRisks: aiData.hiddenRisks || [],
        timelineWarnings: aiData.timelineWarnings || [],
        recommendation: aiData.recommendation || "Proceed with caution."
      }
    };
  } catch (error) {
    console.error("AI Financial Analysis Failed:", error);
    // Fallback if AI fails
    return {
      metrics: {
        totalCapitalRequired,
        projectedRevenue,
        totalProfit,
        unleveredIrr: unleveredIrr * 100,
        leveredIrr: leveredIrr * 100,
        equityMultiple,
        cashOnCash: cashOnCash * 100
      },
      aiAnalysis: {
        optimalStrategy: "Fallback Strategy (AI Error)",
        hiddenRisks: ["Interest rate carry risk", "Market illiquidity"],
        timelineWarnings: ["Permitting delays could extend hold time"],
        recommendation: "Ensure capital reserves are sufficient for holding period."
      }
    };
  }
}
