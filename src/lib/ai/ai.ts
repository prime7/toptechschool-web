import { OpenAIProvider } from "./providers/openai";
import { AnthropicProvider } from "./providers/anthropic";
import { AIProvider, AIConfig } from "./types";
import { prisma } from "../prisma";

export class AI {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider: string;

  constructor(configs: {
    providers: { type: 'openai' | 'anthropic'; config: AIConfig }[];
    defaultProvider: string;
  }) {
    for (const { type, config } of configs.providers) {
      if (type === 'openai') {
        this.providers.set(type, new OpenAIProvider(config));
      } else if (type === 'anthropic') {
        this.providers.set(type, new AnthropicProvider(config));
      }
    }
    this.defaultProvider = configs.defaultProvider;
  }

  async generateResponse(params: {
    prompt: string;
    model: string;
    provider?: string;
    maxTokens?: number;
    temperature?: number;
    requestType: 'job_evaluation' | 'resume_review' | 'practice_evaluation';
    userId: string;
  }): Promise<{
    text: string;
    promptTokens: number;
    completionTokens: number;
    cost: number;
    time: number;
  }> {
    const providerName = params.provider || this.defaultProvider;
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error(`Provider ${providerName} not found`);
    }

    
    const result = await provider.generateResponse({
      prompt: params.prompt,
      model: params.model,
      maxTokens: params.maxTokens,
      temperature: params.temperature
    });

    await prisma.aI.create({
      data: {
        provider: providerName,
        model: params.model,
        promptTokens: result.promptTokens,
        completionTokens: result.completionTokens,
        totalTokens: result.promptTokens + result.completionTokens,
        cost: result.cost,
        requestType: params.requestType,
        userId: params.userId
      }
    })

    return result;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}

export const ai = new AI({
  providers: [
    {
      type: 'openai',
      config: { apiKey: process.env.OPENAI_API_KEY || '' }
    },
    {
      type: 'anthropic',
      config: { apiKey: process.env.ANTHROPIC_API_KEY || '' }
    }
  ],
  defaultProvider: 'anthropic'
});
