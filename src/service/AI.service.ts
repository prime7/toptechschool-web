import { openai } from "@/lib/openai";
import { anthropic } from "@/lib/anthropic";
import { BaseService } from "./Base.service";
import { AI_CONFIGS } from "@/lib/constants";
import { type ChatCompletionSystemMessageParam, type ChatCompletionUserMessageParam } from "openai/resources/chat/completions";

export type AIProvider = "openai" | "anthropic";
export type AIRequestType = "resume_review" | "job_evaluation" | "practice_evaluation";

interface AIUsage {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export class AI extends BaseService {
  static async generateResponse<T>(
    systemPrompt: string,
    messages: string[],
    defaultResponse: T,
    requestType: AIRequestType,
    userId: string,
    provider: AIProvider = "openai"
  ): Promise<T> {
    return this.handleError(
      async () => {
        const formattedMessages = [
          { role: "system", content: systemPrompt } as ChatCompletionSystemMessageParam,
          ...messages.map(message => ({ role: "user", content: message } as ChatCompletionUserMessageParam))
        ];

        let response;
        let usage: AIUsage;

        if (provider === "openai") {
          const openaiResponse = await openai.chat.completions.create({
            model: AI_CONFIGS["gpt-4o-mini"].model,
            messages: formattedMessages,
            max_tokens: AI_CONFIGS["gpt-4o-mini"].maxTokens,
            temperature: AI_CONFIGS["gpt-4o-mini"].temperature,
            response_format: { type: "json_object" }
          });

          const promptTokens = openaiResponse.usage?.prompt_tokens || 0;
          const completionTokens = openaiResponse.usage?.completion_tokens || 0;

          response = openaiResponse.choices[0].message.content;
          usage = {
            provider,
            model: AI_CONFIGS["gpt-4o-mini"].model,
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            cost: this.calculateOpenAICost(promptTokens, completionTokens)
          };
        } else {
          const anthropicResponse = await anthropic.messages.create({
            model: AI_CONFIGS["claude-3-haiku-20240307"].model,
            messages: [{ role: "user", content: messages.join("\n") }],
            max_tokens: AI_CONFIGS["claude-3-haiku-20240307"].maxTokens,
            temperature: AI_CONFIGS["claude-3-haiku-20240307"].temperature,
            system: `${systemPrompt} You must respond with valid JSON only.`,
          });
          const inputTokens = anthropicResponse.usage?.input_tokens || 0;
          const outputTokens = anthropicResponse.usage?.output_tokens || 0;

          response = anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : '';
          usage = {
            provider,
            model: AI_CONFIGS["claude-3-haiku-20240307"].model,
            promptTokens: inputTokens,
            completionTokens: outputTokens,
            totalTokens: inputTokens + outputTokens,
            cost: this.calculateAnthropicCost(inputTokens, outputTokens)
          };
        }

        await this.prisma.aI.create({
          data: {
            provider: usage.provider,
            model: usage.model,
            promptTokens: usage.promptTokens,
            completionTokens: usage.completionTokens,
            totalTokens: usage.totalTokens,
            cost: usage.cost,
            requestType,
            userId
          }
        });

        return response ? JSON.parse(response) as T : defaultResponse;
      },
      `Failed to generate ${provider} response`
    );
  }

  private static calculateOpenAICost(promptTokens: number, completionTokens: number): number {
    return (promptTokens / 1000) * AI_CONFIGS["gpt-4o-mini"].inputCostPer1kTokens + (completionTokens / 1000) * AI_CONFIGS["gpt-4o-mini"].outputCostPer1kTokens;
  }

  private static calculateAnthropicCost(inputTokens: number, outputTokens: number): number {
    return (inputTokens / 1000) * AI_CONFIGS["claude-3-haiku-20240307"].inputCostPer1kTokens + (outputTokens / 1000) * AI_CONFIGS["claude-3-haiku-20240307"].outputCostPer1kTokens;
  }
} 