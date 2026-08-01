export interface AIModelRequest {
  systemPrompt: string;
  userPrompt: string;
  organizationId: string;
  userId: string;
  temperature?: number;
  tools?: AIToolDefinition[];
  propertyContextId?: string;
}

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export interface AIToolCall {
  toolName: string;
  arguments: Record<string, any>;
}

export interface AIResponse {
  content: string;
  toolCalls?: AIToolCall[];
  citations?: {
    source: string;
    retrievedAt: string;
    confidence: number;
  }[];
  tokensUsed: {
    prompt: number;
    completion: number;
    total: number;
  };
  estimatedCostUsd: number;
  executionTimeMs: number;
}
