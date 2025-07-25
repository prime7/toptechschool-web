import OpenAI from "openai";
import { AIProvider, AIConfig } from "../types";

const MODEL_COST_PER_TOKEN = {
  "gpt-4o-mini": {
    input: 0.00000015,    // $0.15/1M tokens
    output: 0.00000060    // $0.60/1M tokens
  },
  "gpt-4.1-mini": {
    input: 0.00000040,    // $0.40/1M tokens
    output: 0.00000160,   // $1.60/1M tokens
  },
  "gpt-4.1-2025-04-14": {
    input: 0.00000800,    // $8.00/1M tokens
    output: 0.00002000    // $20.00/1M tokens
  }
} as const;

export type OpenAIModels = keyof typeof MODEL_COST_PER_TOKEN;

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor(config: AIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  }

  async generateResponse(params: {
    prompt: string;
    model: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{
    text: string;
    promptTokens: number;
    completionTokens: number;
    cost: number;
    time: number;
  }> {
    const start = performance.now();
    const response = await this.client.chat.completions.create({
      model: params.model,
      messages: [{ role: "user", content: params.prompt }],
      max_tokens: params.maxTokens ?? 4096,
      temperature: params.temperature,
    });

    const responseTime = performance.now() - start;
    const cost = this.calculateCost(
      response.usage?.prompt_tokens ?? 0,
      response.usage?.completion_tokens ?? 0,
      params.model
    );

    return {
      text: response.choices[0].message.content ?? "",
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      cost,
      time: Number((responseTime / 1000).toFixed(2))
    };
  }

  private calculateCost(
    input_tokens: number,
    output_tokens: number,
    model: string
  ): number {
    const costPerToken = MODEL_COST_PER_TOKEN[model as keyof typeof MODEL_COST_PER_TOKEN];
    if (!costPerToken) return 0;
    return (input_tokens * costPerToken.input + output_tokens * costPerToken.output);
  }
}