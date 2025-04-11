import { openai } from "@/lib/openai";
import { anthropic } from "@/lib/anthropic";
import { BaseService } from "./Base.service";
import { OPENAI_CONFIG, ANTHROPIC_CONFIG } from "@/lib/constants";
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
            model: OPENAI_CONFIG.MODEL,
            messages: formattedMessages,
            max_tokens: OPENAI_CONFIG.MAX_TOKENS,
            temperature: OPENAI_CONFIG.TEMPERATURE,
            response_format: { type: "json_object" }
          });

          const promptTokens = openaiResponse.usage?.prompt_tokens || 0;
          const completionTokens = openaiResponse.usage?.completion_tokens || 0;

          response = openaiResponse.choices[0].message.content;
          usage = {
            provider,
            model: OPENAI_CONFIG.MODEL,
            promptTokens,
            completionTokens,
            totalTokens: promptTokens + completionTokens,
            cost: this.calculateOpenAICost(promptTokens, completionTokens)
          };
        } else {
          const anthropicResponse = await anthropic.messages.create({
            model: ANTHROPIC_CONFIG.MODEL,
            messages: [{ role: "user", content: messages.join("\n") }],
            max_tokens: ANTHROPIC_CONFIG.MAX_TOKENS,
            temperature: ANTHROPIC_CONFIG.TEMPERATURE,
            system: systemPrompt,
          });
          const inputTokens = anthropicResponse.usage?.input_tokens || 0;
          const outputTokens = anthropicResponse.usage?.output_tokens || 0;

          response = anthropicResponse.content[0].type === 'text' ? anthropicResponse.content[0].text : '';
          usage = {
            provider,
            model: ANTHROPIC_CONFIG.MODEL,
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
    return (promptTokens / 1000) * OPENAI_CONFIG.INPUT_COST_PER_1K_TOKENS + (completionTokens / 1000) * OPENAI_CONFIG.OUTPUT_COST_PER_1K_TOKENS;
  }

  private static calculateAnthropicCost(inputTokens: number, outputTokens: number): number {
    return (inputTokens / 1000) * ANTHROPIC_CONFIG.INPUT_COST_PER_1K_TOKENS + (outputTokens / 1000) * ANTHROPIC_CONFIG.OUTPUT_COST_PER_1K_TOKENS;
  }
} 