import { OpenAIProvider, OpenAIModels } from "./providers/openai";
import { AnthropicProvider, AnthropicModels } from "./providers/anthropic";
import { GeminiProvider, GeminiModels } from "./providers/gemini";
import { AIProvider, AIConfig } from "./types";
import { prisma } from "../prisma";

export type ProviderType = 'openai' | 'anthropic' | 'gemini';
export type ModelType = OpenAIModels | AnthropicModels | GeminiModels;

export class AI {
  private providers: Map<ProviderType, AIProvider> = new Map();
  private defaultProvider: ProviderType;

  constructor(configs: {
    providers: { type: ProviderType; config: AIConfig }[];
    defaultProvider: ProviderType;
  }) {
    for (const { type, config } of configs.providers) {
      if (type === 'openai') {
        this.providers.set(type, new OpenAIProvider(config));
      } else if (type === 'anthropic') {
        this.providers.set(type, new AnthropicProvider(config));
      } else if (type === 'gemini') {
        this.providers.set(type, new GeminiProvider(config));
      }
    }
    this.defaultProvider = configs.defaultProvider;
  }

  async generateResponse(params: {
    prompt: string;
    model: ModelType;
    provider?: ProviderType;
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


    const createAIRecord = async () => {
      try {
        console.log(`Creating AI record for ${params.userId}`);
        console.log(result);
        await prisma.aI.create({
          data: {
            provider: providerName,
            model: params.model,
            promptTokens: result.promptTokens,
            completionTokens: result.completionTokens,
            totalTokens: result.promptTokens + result.completionTokens,
            cost: result.cost,
            requestType: params.requestType,
            userId: params.userId,
            time: Math.round(result.time / 1000)
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    await createAIRecord();

    return result;
  }

  getAvailableProviders(): ProviderType[] {
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
    },
    {
      type: 'gemini',
      config: { apiKey: process.env.GEMINI_API_KEY || '' }
    }
  ],
  defaultProvider: 'anthropic'
});
