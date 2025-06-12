import OpenAI from 'openai';
import { AIProvider, AIConfig } from "../types";

const MODEL_COST_PER_TOKEN = {
  "gemini-2.0-flash": {
    input: 0.00000010,    // $0.10/1M tokens
    output: 0.00000040    // $0.40/1M tokens
  }
} as const;

export type GeminiModels = keyof typeof MODEL_COST_PER_TOKEN;

export class GeminiProvider implements AIProvider {
  private client: OpenAI;

  constructor(config: AIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
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
      messages: [
        { role: "user", content: params.prompt }
      ],
      max_tokens: params.maxTokens,
      temperature: params.temperature,
      response_format: { type: "json_object" }
    });

    const result = response.choices[0].message.content || '';
    const responseTime = performance.now() - start;

    // Note: Gemini API currently doesn't provide token counts directly
    // We're estimating based on character count (rough approximation)
    const promptTokens = Math.ceil(params.prompt.length / 4);
    const completionTokens = Math.ceil(result.length / 4);

    const cost = this.calculateCost(
      promptTokens,
      completionTokens,
      params.model
    );

    return {
      text: result,
      promptTokens,
      completionTokens,
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
