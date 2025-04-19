import Anthropic from "@anthropic-ai/sdk";
import { AIProvider, AIConfig } from "../types";

const MODEL_COST_PER_TOKEN = {
  "claude-3-haiku-20240307": {
    input: 0.00000080,
    output: 0.00000040
  }
} as const;

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor(config: AIConfig) {
    this.client = new Anthropic({
      apiKey: config.apiKey,
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
    const start = Date.now();
    const response = await this.client.messages.create({
      model: params.model,
      messages: [{ role: "user", content: params.prompt }],
      max_tokens: params.maxTokens ?? 1000,
      temperature: params.temperature,
    });

    const responseTime = Date.now() - start;
    const cost = this.calculateCost(response.usage?.input_tokens ?? 0, response.usage?.output_tokens ?? 0, params.model);

    return {
      text: response.content[0].type === 'text' ? response.content[0].text : '',
      promptTokens: response.usage?.input_tokens ?? 0,
      completionTokens: response.usage?.output_tokens ?? 0,
      cost,
      time: responseTime
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